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

		// Define a set of allowed origins
		allowedOrigins := map[string]bool{
			"http://localhost:3000":            true,
			"http://tenthousandhours.net":      true,
			"https://tenthousandhours.net":     true,
			"https://www.tenthousandhours.net": true,
			"http://138.91.196.78:80":          true,
		}

		// Check if the request origin is in the allowed list
		if allowedOrigins[origin] {
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

	// Create a new group for /api prefix
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Hello, world!",
			})
		})

		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		api.GET("/validate-token", middleware.AuthMiddleware(), controllers.ValidateToken)
		api.POST("/send-password-reset", controllers.SendPasswordReset)
		api.POST("/reset-password", controllers.ResetPassword)

		// Protected routes
		protected := api.Group("/protected")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/get-user-info", controllers.GetUserInfo)
			protected.POST("/update-user-info", controllers.UpdateUserInfo)
			protected.POST("/update-user-password", controllers.UpdatePassword)
			protected.DELETE("/delete-user-data", controllers.DeleteUser)
			protected.POST("/create-activity", controllers.CreateActivity)
			protected.DELETE("/delete-activity/:id", controllers.DeleteActivity)
			protected.GET("/get-activities", controllers.GetActivities)
			protected.POST("/log-practice", controllers.LogPractice)
			protected.GET("/get-practice", controllers.GetPractice)
			protected.DELETE("/delete-practice", controllers.DeletePractice)
		}
	}

	return router
}
