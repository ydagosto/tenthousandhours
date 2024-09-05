package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
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
