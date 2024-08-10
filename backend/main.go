package main

import (
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, world!",
		})
	})
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
