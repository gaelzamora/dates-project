package repositories

import (
	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func (r *UserRepository) UpdateProfilePicture(userId uint, imageURL string) error {
	return r.db.Model(&models.User{}).Where("id = ?", userId).Update("profile_picture", imageURL).Error
}

func (r *UserRepository) GetUserByID(userId uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, "id = ?", userId).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) UpdateUserInfo(userId uint, updateData map[string]interface{}) error {
	return r.db.Model(&models.User{}).Where("id = ?", userId).Updates(updateData).Error
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}
