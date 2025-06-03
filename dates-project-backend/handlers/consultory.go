package handlers

import (
	"context"
	"strconv"
	"time"

	"github.com/gaelzamora/courses-app/models"
	"github.com/gofiber/fiber/v2"
)

type ConsultoryHandler struct {
	repository models.ConsultoryRepository
}

func (h *ConsultoryHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	consultories, err := h.repository.GetMany(context)

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

func NewConsultoryHandler(router fiber.Router, repository models.ConsultoryRepository) {
	handler := &ConsultoryHandler{
		repository: repository,
	}

	router.Get("/", handler.GetMany)
	router.Get("/:consultoryId", handler.GetOne)
	router.Post("/", handler.CreateOne)
	router.Delete("/:consultoryId", handler.DeleteOne)
}
