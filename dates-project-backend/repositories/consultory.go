package repositories

import (
	"context"

	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

type ConsultoryRepository struct {
	db *gorm.DB
}

func (r *ConsultoryRepository) GetMany(ctx context.Context, offset, limit int) ([]*models.Consultory, error) {
	consultories := []*models.Consultory{}

	res := r.db.WithContext(ctx).
		Offset(offset).
		Limit(limit).
		Find(&consultories)

	if res.Error != nil {
		return nil, res.Error
	}

	return consultories, nil
}

func (r *ConsultoryRepository) GetManyWithDoctor(ctx context.Context, offset, limit int, specialty string) ([]models.ConsultoryWithDoctor, error) {
	var consultories []models.ConsultoryWithDoctor

	db := r.db.WithContext(ctx).
		Table("consultories").
		Select(`consultories.id, consultories.specialty, consultories.price, consultories.description, consultories.location, consultories.capacity, consultories.rating, consultories.created_at, consultories.updated_at,
                users.id as doctor_id, users.first_name as doctor_first_name, users.last_name as doctor_last_name, users.email as doctor_email, users.age as doctor_age, users.profile_picture as doctor_profile_pic, users.rating as doctor_rating`).
		Joins("join users on users.id = consultories.doctor_id")

	if specialty != "" {
		db = db.Where("consultories.specialty = ?", specialty)
	}

	err := db.Offset(offset).Limit(limit).Scan(&consultories).Error
	return consultories, err
}

func (r *ConsultoryRepository) GetOne(ctx context.Context, consultoryId uint) (models.ConsultoryWithDoctor, error) {
	var consultory models.ConsultoryWithDoctor

	err := r.db.WithContext(ctx).
		Table("consultories").
		Select(`consultories.id, consultories.specialty, consultories.price, consultories.description, consultories.location, consultories.capacity, consultories.rating, consultories.created_at, consultories.updated_at,
                users.id as doctor_id, users.first_name as doctor_first_name, users.last_name as doctor_last_name, users.email as doctor_email, users.age as doctor_age, users.profile_picture as doctor_profile_pic, users.rating as doctor_rating`).
		Joins("join users on users.id = consultories.doctor_id").
		Where("consultories.id = ?", consultoryId).
		Scan(&consultory).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return consultory, nil
		}
		return consultory, err
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

func (r *ConsultoryRepository) GetImagesFromConsultory(consultoryId uint) ([]*models.ImageConsultory, error) {
	images := []*models.ImageConsultory{}

	res := r.db.Where("consultory_id = ?", consultoryId).Find(&images)

	if res.Error != nil {
		return nil, res.Error
	}

	return images, nil
}

func (r *ConsultoryRepository) SaveConsultoryImage(image *models.ImageConsultory) error {
	return r.db.Create(image).Error
}

func NewConsultoryRepository(db *gorm.DB) models.ConsultoryRepository {
	return &ConsultoryRepository{
		db: db,
	}
}
