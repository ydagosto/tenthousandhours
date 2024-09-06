package models

import (
	"gorm.io/gorm"
)

// User represents a user in your application.
type User struct {
	gorm.Model
	Username       string          `gorm:"uniqueIndex;not null" json:"username"`
	Email          string          `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash   string          `gorm:"not null" json:"-"`
	EmailVerified  bool            `gorm:"default:false" json:"email_verified"`
	Activities     []Activity      `gorm:"foreignKey:UserID" json:"activities"`
	PracticeLogs   []PracticeLog   `gorm:"foreignKey:UserID"`
	PasswordResets []PasswordReset `gorm:"foreignKey:UserID"`
}
