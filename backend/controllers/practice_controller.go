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

	// Validate that practice log for the same day doesn't exceed 24 hours
	var totalHoursLogged float64
	date := practiceLogs.Date.Format("2006-01-02") // Assuming practiceLogs.Date is a time.Time field

	// Query to get total hours logged by the user for this activity on the same day
	if err := tx.Model(&models.PracticeLog{}).
		Where("activity_id = ? AND user_id = ? AND DATE(date) = ?", practiceLogs.ActivityID, userID, date).
		Select("COALESCE(SUM(count), 0)").Scan(&totalHoursLogged).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching existing logged hours"})
		return
	}

	// Calculate total hours with the new entry
	newTotal := totalHoursLogged + practiceLogs.Count
	if newTotal > 24 {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Total practice time for the day cannot exceed 24 hours"})
		return
	}

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

// DeletePractice deletes a list of practice logs
func DeletePractice(c *gin.Context) {
	// Start a database transaction
	tx := models.DB.Begin()

	// Extract list of log IDs from the request body
	var request struct {
		LogIDs     []uint `json:"logIds"`
		ActivityID uint   `json:"activityId"`
	}

	// Bind the incoming JSON to the struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the user is authenticated
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Verify that log IDs are provided
	if len(request.LogIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No log IDs provided"})
		return
	}

	// Delete the practice logs in the transaction for the authenticated user
	if err := tx.Where("id IN (?) AND user_id = ? AND activity_id = ?", request.LogIDs, userID, request.ActivityID).
		Delete(&models.PracticeLog{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete practice logs"})
		return
	}

	// Recalculate the total hours logged for this activity by the user
	var totalHours float64
	if err := tx.Model(&models.PracticeLog{}).
		Where("activity_id = ? AND user_id = ?", request.ActivityID, userID).
		Select("COALESCE(SUM(count), 0)").Scan(&totalHours).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error recalculating total hours"})
		return
	}

	// Update the activity's count based on the recalculated total
	if err := tx.Model(&models.Activity{}).
		Where("id = ?", request.ActivityID).
		Update("count", totalHours).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating activity count"})
		return
	}

	// Commit the transaction if everything is successful
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Practice logs deleted and activity updated successfully"})
}
