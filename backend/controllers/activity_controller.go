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
