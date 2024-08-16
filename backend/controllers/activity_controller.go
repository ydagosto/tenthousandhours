package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "backend/models"
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
    var activities []models.Activity
    if err := models.DB.Find(&activities).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, activities)
}
