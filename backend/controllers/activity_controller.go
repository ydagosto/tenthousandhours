package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateActivity(c *gin.Context) {
	var activity models.Activity
	if err := c.ShouldBindJSON(&activity); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Check if an activity with the same name already exists for the user
	var existingActivity models.Activity
	if err := models.DB.Where("user_id = ? AND name = ?", userID, activity.Name).First(&existingActivity).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "An activity with this name already exists"})
		return
	}

	activity.UserID = userID.(uint)
	if err := models.DB.Create(&activity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activity)
}

func GetActivities(c *gin.Context) {

	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Retrieve all activities for the user
	var activities []models.Activity
	if err := models.DB.Where("user_id = ?", userID).Find(&activities).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func DeleteActivity(c *gin.Context) {
	// Retrieve activity ID from the request parameters
	activityID := c.Param("id")

	// Retrieve UserID from the context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Start a transaction
	tx := models.DB.Begin()

	// Check if the activity exists and belongs to the user
	var activity models.Activity
	if err := tx.Where("id = ? AND user_id = ?", activityID, userID).First(&activity).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Activity not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Delete associated practice logs
	if err := tx.Where("activity_id = ?", activityID).Delete(&models.PracticeLog{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete practice logs"})
		return
	}

	// Delete the activity
	if err := tx.Delete(&activity).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete activity"})
		return
	}

	// Commit the transaction if all deletions were successful
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Activity and related practice logs deleted successfully"})
}
