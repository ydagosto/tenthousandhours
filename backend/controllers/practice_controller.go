package controllers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogPractice(c *gin.Context) {

	// ActivityID uint      `gorm:"not null"`
	// Count      float64   `json:"count" gorm:"not null"`
	// Date       time.Time `json:"date" gorm:"type:date;not null"`
	// UserID     uint      `gorm:"not null"`

	var PracticeLog models.PracticeLog
	if err := c.ShouldBindJSON(&PracticeLog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	PracticeLog.UserID = userID.(uint)
	if err := models.DB.Create(&PracticeLog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, PracticeLog)

}
