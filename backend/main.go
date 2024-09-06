package main

import (
	"backend/models"
	"backend/routers"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables from .env file in local development
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found or could not load it, continuing with environment variables...")
	}

	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}

	// Set the global DB variable
	models.DB = db

	// Migrate the schema
	db.AutoMigrate(&models.User{}, &models.Activity{}, &models.PracticeLog{}, &models.PasswordReset{})

	// Setup router
	router := routers.SetupRouter()

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
