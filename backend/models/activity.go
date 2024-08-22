package models

import (
	"gorm.io/gorm"
)

// User represents a user in your application.
type Activity struct {
	gorm.Model
	Name        string  `json:"name" gorm:"not null"`
	Description string  `json:"description"`
	Unit        string  `json:"unit"`
	Goal        float64 `json:"goal"`
	Count       float64 `json:"count" gorm:"not null"`
	UserID      uint    `json:"user_id" gorm:"not null"`

	PracticeLog PracticeLog `gorm:"foreignKey:ActivityID"`
}
