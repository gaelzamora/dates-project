package handlers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/gaelzamora/courses-app/models"
	"github.com/gaelzamora/courses-app/services"
	"github.com/gofiber/fiber/v2"
)

type ConsultoryHandler struct {
	repository models.ConsultoryRepository
}

func (h *ConsultoryHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	pageParam := ctx.Query("page", "1")
	limitParam := ctx.Query("limit", "10")
	specialty := ctx.Query("specialty", "")

	page, _ := strconv.Atoi(pageParam)
	limit, _ := strconv.Atoi(limitParam)
	offset := (page - 1) * limit

	consultories, err := h.repository.GetManyWithDoctor(context, offset, limit, specialty)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data":    consultories,
	})
}

func (h *ConsultoryHandler) GetOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	consultoryId, _ := strconv.Atoi(ctx.Params("consultoryId"))

	consultory, err := h.repository.GetOne(context, uint(consultoryId))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data": &fiber.Map{
			"consultory": consultory,
		},
	})
}

func (h *ConsultoryHandler) CreateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	consultory := &models.Consultory{}

	userIdInterface := ctx.Locals("userId")
	if userIdInterface == nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(&fiber.Map{
			"status":  "fail",
			"message": "User ID is missing from context",
		})
	}

	userId := uint(userIdInterface.(float64))
	roleUser := ctx.Locals("role")

	if roleUser != "doctor" {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": "You don't have enough permission to create a new consultory",
			"data":    nil,
		})
	}

	if err := ctx.BodyParser(consultory); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	consultory, err := h.repository.CreateOne(context, userId, consultory)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status":  "success",
		"message": "Consultory created",
		"data":    consultory,
	})
}

func (h *ConsultoryHandler) DeleteOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	consultoryId, _ := strconv.Atoi(ctx.Params("consultoryId"))
	userId := uint(ctx.Locals("userId").(float64))

	err := h.repository.DeleteOne(context, uint(consultoryId), userId)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Consultory deleted",
		"data":    "",
	})
}

func (h *ConsultoryHandler) UploadConsultoryImages(ctx *fiber.Ctx) error {
	consultoryId, err := strconv.Atoi(ctx.Params("consultoryId"))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "fail",
			"message": "Invalid consultory ID",
		})
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "fail",
			"message": "Invalid form data",
		})
	}

	files := form.File["images"]
	if len(files) == 0 {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "fail",
			"message": "No images uploaded",
		})
	}

	var uploadedImages []models.ImageConsultory
	userId := uint(ctx.Locals("userId").(float64))

	for _, file := range files {
		key := fmt.Sprintf("consultories/%d/%s", consultoryId, file.Filename)
		imageURL, err := services.UploadToS3(file, key)
		if err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  "fail",
				"message": "Failed to upload image to S3",
			})
		}

		image := models.ImageConsultory{
			ConsultoryID: uint(consultoryId),
			DoctorID:     userId,
			URL:          imageURL,
			Type:         models.Common,
			CreatedAt:    time.Now(),
		}
		if err := h.repository.SaveConsultoryImage(&image); err != nil {
			return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  "fail",
				"message": "Failed to save image in DB",
			})
		}

		uploadedImages = append(uploadedImages, image)
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "success",
		"message": "Images uploaded",
		"data":    uploadedImages,
	})
}

func (h *ConsultoryHandler) GetConsultoryImages(ctx *fiber.Ctx) error {
	consultoryId, err := strconv.Atoi(ctx.Params("consultoryId"))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "fail",
			"message": "Invalid form data",
		})
	}
	images, err := h.repository.GetImagesFromConsultory(uint(consultoryId))

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   images,
	})
}

func NewConsultoryHandler(router fiber.Router, repository models.ConsultoryRepository) {
	handler := &ConsultoryHandler{
		repository: repository,
	}

	// Consultories
	router.Get("/", handler.GetMany)
	router.Get("/:consultoryId", handler.GetOne)
	router.Post("/", handler.CreateOne)
	router.Delete("/:consultoryId", handler.DeleteOne)

	// Images in consultories
	router.Post("/:consultoryId/images", handler.UploadConsultoryImages)
	router.Get("/:consultoryId/images", handler.GetConsultoryImages)
}
