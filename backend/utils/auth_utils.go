package utils

import (
	"backend/models"
	"fmt"
	"log"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/golang-jwt/jwt/v4"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// sendResetEmail sends a password reset email with a link to reset the password
func SendResetEmail(toEmail, resetToken string) error {
	from := mail.NewEmail("tenthousandhours", "no-reply@tenthousandhours.net")
	subject := "Password Reset Request"
	to := mail.NewEmail("", toEmail)
	resetLink := fmt.Sprintf("http://tenthousandhours.net/reset-password?token=%s", resetToken)

	// Construct the email content
	plainTextContent := fmt.Sprintf("Please click the link below to reset your password:\n%s", resetLink)
	htmlContent := fmt.Sprintf("<p>Please click the link below to reset your password:</p><a href=\"%s\">Reset Password</a>", resetLink)
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)

	// Get SendGrid API key from environment variables
	sendgridKey := os.Getenv("SENDGRID_API_KEY")
	if sendgridKey == "" {
		return fmt.Errorf("SendGrid API key is missing")
	}

	client := sendgrid.NewSendClient(sendgridKey)
	response, err := client.Send(message)
	if err != nil {
		log.Printf("Error sending reset email: %v", err)
		return err
	}

	// Log response for debugging
	log.Printf("SendGrid Response: StatusCode: %d, Body: %s, Headers: %v", response.StatusCode, response.Body, response.Headers)
	return nil
}

// GenerateResetToken generates a JWT token with the user's ID for password reset
func GenerateResetToken(user models.User) (string, error) {
	// Secret key from environment variable or hardcode for testing purposes
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		log.Fatal("JWT secret key is not set in the environment variables")
	}

	// Set expiration time (e.g., 1 hour)
	expirationTime := time.Now().Add(1 * time.Hour)

	// Create a new JWT token
	claims := &jwt.MapClaims{
		"userID": user.ID,
		"exp":    expirationTime.Unix(), // Expiration time in Unix format
	}

	// Create a new token object
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// HashPassword hashes a plain text password using bcrypt
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// CheckPasswordHash compares the hashed password with the provided password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
