package handlers

import (
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

	imageURL, err := services.UploadToS3(file)

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

func (h *UserHandler) GetUserInfo(ctx *fiber.Ctx) error {
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

func NewUserHandler(router fiber.Router, repository *repositories.UserRepository) {
	handler := &UserHandler{
		repository: repository,
	}

	router.Post("/upload-profile-picture", handler.UploadProfilePicture)
	router.Get("/me", handler.GetUserInfo)
}
