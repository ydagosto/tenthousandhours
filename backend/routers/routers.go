package routers

import (
	"backend/controllers"
	"backend/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORS middleware function
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(CORSMiddleware())

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, world!",
		})
	})

	router.POST("/register", controllers.Register)

	router.POST("/login", controllers.Login)

	// Protected routes
	protected := router.Group("/protected")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/create-activity", controllers.CreateActivity)
		protected.GET("/get-activities", controllers.GetActivities)
	}

	return router
}
