package repositories

import (
	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

type RatingRepository struct {
	db *gorm.DB
}

func (r *RatingRepository) AddRating(rating *models.Rating) error {
	return r.db.Create(rating).Error
}

func (r *RatingRepository) UpdateUserRating(userId uint) error {
	var avgRating float64
	err := r.db.Model(&models.Rating{}).
		Where("to_user_id = ?", userId).
		Select("AVG(stars)").
		Scan(&avgRating).Error
	if err != nil {
		return err
	}

	return r.db.Model(&models.User{}).Where("id = ?", userId).Update("rating", avgRating).Error
}

func (r *RatingRepository) UpdateConsultoryRating(consultoryId uint) error {
	var avgRating float64
	err := r.db.Model(&models.Rating{}).
		Where("consultory_id = ?", consultoryId).
		Select("AVG(stars)").
		Scan(&avgRating).Error
	if err != nil {
		return err
	}

	return r.db.Model(&models.Consultory{}).Where("id = ?", consultoryId).Update("rating", avgRating).Error
}

func NewRatingRepository(db *gorm.DB) models.RatingRepository {
	return &RatingRepository{
		db: db,
	}
}
