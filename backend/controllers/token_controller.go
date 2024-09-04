package controllers

import (
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

	// If the token is valid, return a success message with the user ID.
	c.JSON(http.StatusOK, gin.H{
		"message": "Token is valid",
		"userID":  userID,
	})
}
