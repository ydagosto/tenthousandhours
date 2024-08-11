package routers

import (
	"backend/controllers"
	"backend/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

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
		//protected.GET("/dashboard", controllers.Dashboard)
	}

	return router
}
