package handlers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/gaelzamora/courses-app/models"
	"github.com/gofiber/fiber/v2"
	"github.com/skip2/go-qrcode"
)

type DateHandler struct {
	repository models.DateRepository
}

func (h *DateHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	userId := uint(ctx.Locals("userId").(float64))

	dates, err := h.repository.GetMany(context, userId)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data":    dates,
	})
}

func (h *DateHandler) GetOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	dateId, _ := strconv.Atoi(ctx.Params("dateId"))
	userId := uint(ctx.Locals("userId").(float64))

	date, err := h.repository.GetOne(context, userId, uint(dateId))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	var QRCode []byte
	QRCode, err = qrcode.Encode(
		fmt.Sprintf("dateId:%v,userId:%v", dateId, userId),
		qrcode.Medium,
		256,
	)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status": "fail",
			"mesage": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data": &fiber.Map{
			"date":   date,
			"qrcode": QRCode,
		},
	})
}

func (h *DateHandler) CreateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	date := &models.Date{}
	patientId := uint(ctx.Locals("userId").(float64))

	if err := ctx.BodyParser(date); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	date, err := h.repository.CreateOne(context, patientId, date)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status":  "success",
		"message": "Date created",
		"data":    date,
	})
}

func (h *DateHandler) validateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	validateBody := &models.ValidateDate{}

	validateData := make(map[string]interface{})
	validateData["used"] = true

	date, err := h.repository.UpdateOne(context, validateBody.DoctorID, validateBody.PatientID,
		validateData)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Thank you for come :)",
		"data":    date,
	})
}

func NewDateHandler(router fiber.Router, repository models.DateRepository) {
	handler := &DateHandler{
		repository: repository,
	}

	router.Get("/", handler.GetMany)
	router.Get("/:dateId", handler.GetOne)
	router.Post("/", handler.CreateOne)
	router.Put("/validate", handler.validateOne)
}
