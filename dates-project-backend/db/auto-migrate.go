package db

import (
	"github.com/gaelzamora/courses-app/models"
	"gorm.io/gorm"
)

func DBMigrator(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Consultory{},
		&models.Date{},
		&models.Rating{},
	)
}
