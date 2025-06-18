package handlers

import (
	"strconv"

	"github.com/gaelzamora/courses-app/models"
	"github.com/gaelzamora/courses-app/repositories"
	"github.com/gaelzamora/courses-app/services"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	repository models.UserRepository
}

func (h *UserHandler) UploadProfilePicture(ctx *fiber.Ctx) error {
	file, err := ctx.FormFile("profile_picture")

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to upload file",
		})
	}

	imageURL, err := services.UploadToS3(file, "profile")

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to upload file to S3",
		})
	}

	userId := uint(ctx.Locals("userId").(float64))

	if err := h.repository.UpdateProfilePicture(userId, imageURL); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to update profile picture",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Profile picture uploaded successfully",
		"data":    imageURL,
	})

}

func (h *UserHandler) GetMyUserInfo(ctx *fiber.Ctx) error {
	userId := uint(ctx.Locals("userId").(float64))

	user, err := h.repository.GetUserByID(userId)

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to retrieve user information",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status": "success",
		"data":   user,
	})
}

func (h *UserHandler) GetUserById(ctx *fiber.Ctx) error {
	userId, err := strconv.Atoi(ctx.Params("userId"))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "fail",
			"message": "Invalid user ID",
		})
	}

	user, err := h.repository.GetUserByID(uint(userId))

	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to retrieve user information",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status": "success",
		"data":   user,
	})
}

func (h *UserHandler) UpdateUserInfo(ctx *fiber.Ctx) error {
	userId := uint(ctx.Locals("userId").(float64))

	updateData := make(map[string]interface{})
	if err := ctx.BodyParser(&updateData); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Invalid request body",
		})
	}

	if _, exists := updateData["email"]; exists {
		delete(updateData, "email")
	}

	err := h.repository.UpdateUserInfo(userId, updateData)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to update user information",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "User information updated successfully",
	})
}

func NewUserHandler(router fiber.Router, repository *repositories.UserRepository) {
	handler := &UserHandler{
		repository: repository,
	}

	router.Post("/upload-profile-picture", handler.UploadProfilePicture)
	router.Get("/me", handler.GetMyUserInfo)
	router.Get("/user/:userId", handler.GetUserById)
	router.Put("/me", handler.UpdateUserInfo)
}
