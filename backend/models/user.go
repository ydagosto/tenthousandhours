package models

import (
	"gorm.io/gorm"
)

// User represents a user in your application.
type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex"`
	Email        string `gorm:"uniqueIndex"`
	PasswordHash string
}
