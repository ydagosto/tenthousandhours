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

		origin := c.Request.Header.Get("Origin")

		// Allow only specific origins
		if origin == "http://13.91.160.24:3000" || origin == "http://localhost:3000" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		// Explicitly allow DELETE in Access-Control-Allow-Methods
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true") // Allow credentials if needed

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
	router.GET("/validate-token", middleware.AuthMiddleware(), controllers.ValidateToken)

	// Protected routes
	protected := router.Group("/protected")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/get-user-info", controllers.GetUserInfo)
		protected.POST("/update-user-info", controllers.UpdateUserInfo)
		protected.POST("/update-user-password", controllers.UpdatePassword)
		protected.DELETE("/delete-user-data", controllers.DeleteUser)
		protected.POST("/create-activity", controllers.CreateActivity)
		protected.GET("/get-activities", controllers.GetActivities)
		protected.POST("/log-practice", controllers.LogPractice)
		protected.GET("/get-practice", controllers.GetPractice)
	}

	return router
}
