package models

import (
	"time"

	"gorm.io/gorm"
)

// PasswordReset represents the password reset token for a user.
type PasswordReset struct {
	gorm.Model
	UserID    uint      `gorm:"not null"`       // Foreign key to the User model
	Token     string    `gorm:"not null"`       // The reset token (JWT or random string)
	CreatedAt time.Time `gorm:"autoCreateTime"` // Automatically set the creation time
	ExpiresAt time.Time `gorm:"not null"`       // Expiration time of the token
}

// BeforeCreate sets the expiration time before creating a new password reset record
func (pr *PasswordReset) BeforeCreate(tx *gorm.DB) (err error) {
	pr.ExpiresAt = time.Now().Add(1 * time.Hour) // Set the expiration time (valid for 1 hour)
	return
}
