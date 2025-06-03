package repositories

import (
	"context"

	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

type DateRepository struct {
	db *gorm.DB
}

func (r *DateRepository) GetMany(ctx context.Context, userId uint) ([]*models.Date, error) {
	dates := []*models.Date{}

	res := r.db.Model(&models.Date{}).Where("user_id = ?", userId).Preload("Patient").Order("updated_at desc").Find(&dates)

	if res.Error != nil {
		return nil, res.Error
	}

	return dates, nil
}

func (r *DateRepository) GetOne(ctx context.Context, userId uint, dateId uint) (*models.Date, error) {
	date := &models.Date{}

	res := r.db.Model(&date).Where("user_id = ?", userId).Where("id = ?", dateId).Preload("Patient").First(date)

	if res.Error != nil {
		return nil, res.Error
	}

	return date, nil
}

func (r *DateRepository) CreateOne(ctx context.Context, patientId uint, date *models.Date) (*models.Date, error) {
	date.PatientID = patientId

	res := r.db.Model(&date).Create(date)

	if res.Error != nil {
		return nil, res.Error
	}

	return date, nil
}

func (r *DateRepository) UpdateOne(ctx context.Context, userId uint, dateId uint, updatedData map[string]interface{}) (*models.Date, error) {
	date := &models.Date{}

	res := r.db.Model(&date).Where("user_id = ?", userId).Where("id = ?", dateId).Updates(updatedData)

	if res.Error != nil {
		return nil, res.Error
	}

	return date, nil
}

func (r *DateRepository) DeleteOne(ctx context.Context, dateId uint) error {
	res := r.db.Delete(&models.Date{}, dateId)

	return res.Error
}

func NewDateRepository(db *gorm.DB) models.DateRepository {
	return &DateRepository{
		db: db,
	}
}
