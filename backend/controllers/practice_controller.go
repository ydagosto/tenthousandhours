package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogPractice(c *gin.Context) {
	// Start a database transaction
	tx := models.DB.Begin()

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

	// Set userID in practice log
	practiceLogs.UserID = userID.(uint)

	// Create the practice log in the transaction
	if err := tx.Create(&practiceLogs).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update the activity's count field based on the sum of all practice logs for this activity and user
	var totalHours float64
	if err := tx.Model(&models.PracticeLog{}).
		Where("activity_id = ? AND user_id = ?", practiceLogs.ActivityID, userID).
		Select("COALESCE(SUM(count), 0)").Scan(&totalHours).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update the activity's count with the calculated total
	if err := tx.Model(&models.Activity{}).
		Where("id = ?", practiceLogs.ActivityID).
		Update("count", totalHours).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Commit the transaction if all is good
	tx.Commit()

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
