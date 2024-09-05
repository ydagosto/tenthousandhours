package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GetUserInfo(c *gin.Context) {

	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Struct to hold only the username and email
	var userInfo struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	// Query only for username and email fields
	if err := models.DB.Table("users").Select("username, email").Where("id = ?", userID).First(&userInfo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the username and email in the response
	c.JSON(http.StatusOK, userInfo)
}

// Struct for the request body to update user info
type UpdateUserInfoRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// UpdateUserInfo updates the username or email of the user based on userID
func UpdateUserInfo(c *gin.Context) {

	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Bind the JSON request body to the UpdateUserInfoRequest struct
	var req UpdateUserInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the user info in the database
	if err := models.DB.Model(&models.User{}).Where("id = ?", userID).
		Updates(map[string]interface{}{
			"username": req.Username,
			"email":    req.Email,
		}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user information"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "User information updated successfully"})
}

// UpdatePasswordRequest is the request payload for updating the password.
type UpdatePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=6"`
}

// UpdatePassword allows the user to update their password.
func UpdatePassword(c *gin.Context) {
	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Bind the request body to UpdatePasswordRequest
	var req UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the user by ID
	var user models.User
	if err := models.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// Compare the current password with the hashed password in the database
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	// Hash the new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password"})
		return
	}

	// Update the user's password in the database
	if err := models.DB.Model(&user).Update("password_hash", string(hashedPassword)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

// DeleteUser deletes the user's account and all related data
func DeleteUser(c *gin.Context) {
	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Start a transaction to delete the user and all related data
	if err := models.DB.Transaction(func(tx *gorm.DB) error {
		// Delete all practice logs associated with the user
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.PracticeLog{}).Error; err != nil {
			return err
		}

		// Delete all activities associated with the user
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Activity{}).Error; err != nil {
			return err
		}

		// Finally, delete the user
		if err := tx.Unscoped().Where("id = ?", userID).Delete(&models.User{}).Error; err != nil {
			return err
		}

		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user account"})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{"message": "User account and related data deleted successfully"})
}
