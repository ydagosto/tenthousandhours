package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in your application.
type PracticeLog struct {
	gorm.Model
	UserID     uint      `gorm:"not null"`
	ActivityID uint      `gorm:"not null"`
	Count      float64   `json:"count" gorm:"not null"`
	Date       time.Time `json:"date" gorm:"type:date;not null"`

	// Define relationships
	User     User     `gorm:"foreignKey:UserID"`
	Activity Activity `gorm:"foreignKey:ActivityID"`
}
