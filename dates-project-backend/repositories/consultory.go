package repositories

import (
	"context"

	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

type ConsultoryRepository struct {
	db *gorm.DB
}

func (r *ConsultoryRepository) GetMany(ctx context.Context) ([]*models.Consultory, error) {
	consultories := []*models.Consultory{}

	res := r.db.Model(&models.Consultory{}).Order("updated_at desc").Find(&consultories)

	if res.Error != nil {
		return nil, res.Error
	}

	return consultories, nil
}

func (r *ConsultoryRepository) GetOne(ctx context.Context, consultoryId uint) (*models.Consultory, error) {
	consultory := &models.Consultory{}

	res := r.db.Model(&consultory).Where("id = ?", consultoryId).First(consultory)

	if res.Error != nil {
		return nil, res.Error
	}

	return consultory, nil
}

func (r *ConsultoryRepository) CreateOne(ctx context.Context, doctorId uint, consultory *models.Consultory) (*models.Consultory, error) {
	consultory.DoctorID = doctorId

	res := r.db.Model(&consultory).Create(consultory)

	if res.Error != nil {
		return nil, res.Error
	}

	return consultory, nil
}

func (r *ConsultoryRepository) UpdateOne(ctx context.Context, doctorId uint, consultoryId uint, updatedData map[string]interface{}) (*models.Consultory, error) {
	consultory := &models.Consultory{}

	res := r.db.Model(&consultory).Where("id = ? AND doctor_id = ?", consultoryId, doctorId).Updates(updatedData)

	if res.Error != nil {
		return nil, res.Error
	}

	return consultory, nil
}

func (r *ConsultoryRepository) DeleteOne(ctx context.Context, consultoryId uint, doctorId uint) error {
	user := &models.User{}

	res := r.db.Model(&user).Where("role = ?", "doctor").First(user)

	if res.Error != nil {
		return res.Error
	}

	res = r.db.Delete(&models.Consultory{}, consultoryId)

	return res.Error
}

func NewConsultoryRepository(db *gorm.DB) models.ConsultoryRepository {
	return &ConsultoryRepository{
		db: db,
	}
}
