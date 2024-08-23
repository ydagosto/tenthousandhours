package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogPractice(c *gin.Context) {

	var practiceLogs models.PracticeLog
	if err := c.ShouldBindJSON(&practiceLogs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	practiceLogs.UserID = userID.(uint)
	if err := models.DB.Create(&practiceLogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, practiceLogs)

}

func GetPractice(c *gin.Context) {

	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Get the activityID from the query parameters
	activityID := c.Query("activityID")
	if activityID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Activity ID is required"})
		return
	}

	// Retrieve all activities for the user
	var practiceLogs []models.PracticeLog
	if err := models.DB.Where("user_id = ? AND activity_id = ?", userID, activityID).Find(&practiceLogs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, practiceLogs)
}
