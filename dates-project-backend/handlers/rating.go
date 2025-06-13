package handlers

import (
	"github.com/gaelzamora/courses-app/models"
	"github.com/gofiber/fiber/v2"
)

type RatingHandler struct {
	repository models.RatingRepository
}

func (h *RatingHandler) AddRating(ctx *fiber.Ctx) error {
	rating := new(models.Rating)

	if err := ctx.BodyParser(rating); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Invalid request body",
		})
	}

	if rating.Stars < 0 || rating.Stars > 5 {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Rating must be between 0 and 5",
		})
	}

	if err := h.repository.AddRating(rating); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
			"status":  "fail",
			"message": "Failed to add rating",
		})
	}

	if rating.ConsultoryID != nil {
		h.repository.UpdateConsultoryRating(*rating.ConsultoryID)
	} else {
		h.repository.UpdateUserRating(rating.ToUserID)
	}

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status":  "success",
		"message": "Rating added successfully",
	})

}

// func (h *RatingHandler) GetAverageRating(ctx *fiber.Ctx) error {
// 	id := ctx.Params("id")
// 	entityType := ctx.Query("type")

// 	var avgRating float64
// 	var err error

// 	if entityType == "user" {
// 		err = h.repository.GetUserAverageRating(id, &avgRating)
// 	} else if entityType == "consultory" {
// 		err = h.repository.GetConsultoryAverageRating(id, &avgRating)
// 	} else {
// 		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
// 			"status":  "fail",
// 			"message": "Invalid type parameter",
// 		})
// 	}

// 	if err != nil {
// 		return ctx.Status(fiber.StatusInternalServerError).JSON(&fiber.Map{
// 			"status":  "fail",
// 			"message": "Failed to retrieve average rating",
// 		})
// 	}

// 	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
// 		"status": "success",
// 		"data":   avgRating,
// 	})
// }

func NewRatingHandler(router fiber.Router, repository models.RatingRepository) {
	handler := &RatingHandler{
		repository: repository,
	}

	router.Post("/", handler.AddRating)
}
