package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in your application.
type PracticeLog struct {
	gorm.Model
	ActivityID uint      `gorm:"not null"`
	Count      float64   `json:"count" gorm:"not null"`
	Date       time.Time `json:"date" gorm:"type:date;not null"`
	UserID     uint      `gorm:"not null"`
}
