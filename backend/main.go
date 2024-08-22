package main

import (
	"backend/models"
	"backend/routers"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=db user=postgres password=postgres dbname=tenthousandhours port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}

	// Set the global DB variable
	models.DB = db

	// Migrate the schema
	db.AutoMigrate(&models.User{}, &models.Activity{}, &models.PracticeLog{})

	// Setup router
	router := routers.SetupRouter()

	// Start the server
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
