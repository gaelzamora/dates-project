package main

import (
	"fmt"

	"github.com/gaelzamora/courses-app/config"
	"github.com/gaelzamora/courses-app/db"
	"github.com/gaelzamora/courses-app/handlers"
	"github.com/gaelzamora/courses-app/middlewares"
	"github.com/gaelzamora/courses-app/repositories"
	"github.com/gaelzamora/courses-app/services"
	"github.com/gofiber/fiber/v2"
)

func main() {
	envConfig := config.NewEnvConfig()
	db := db.Init(envConfig, db.DBMigrator)

	app := fiber.New(fiber.Config{
		AppName:      "Dates Project",
		ServerHeader: "Fiber",
		BodyLimit:    20 * 1024 * 1024,
	})

	// Repositories
	authRepository := repositories.NewAuthRepository(db)
	dateRepository := repositories.NewDateRepository(db)
	consultoryRepository := repositories.NewConsultoryRepository(db)
	userRepository := repositories.NewUserRepository(db)
	ratingRepository := repositories.NewRatingRepository(db)

	// Service
	authService := services.NewAuthService(authRepository)

	// Routing
	server := app.Group("/api")
	handlers.NewAuthHandler(server.Group("/auth"), authService)

	privateRoutes := server.Use(middlewares.AuthProtected(db))

	handlers.NewDateHandler(privateRoutes.Group("/dates"), dateRepository)
	handlers.NewConsultoryHandler(privateRoutes.Group("/consultories"), consultoryRepository)
	handlers.NewUserHandler(privateRoutes.Group("/users"), userRepository)
	handlers.NewRatingHandler(privateRoutes.Group("/ratings"), ratingRepository)

	app.Listen(fmt.Sprintf("0.0.0.0:" + envConfig.ServerPort))
}
