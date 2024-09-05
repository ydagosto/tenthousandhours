package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ValidateToken is the controller for the /validate-token endpoint
func ValidateToken(c *gin.Context) {
	// At this point, the token has been validated by the middleware.
	// You can retrieve the user ID from the context if needed.
	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
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
