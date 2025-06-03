package models

import (
	"context"
	"time"
)

type Consultory struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	DoctorID    uint      `json:"doctorId"`
	Location    string    `json:"location"`
	Capacity    uint      `json:"capacity"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ConsultoryRepository interface {
	GetMany(ctx context.Context) ([]*Consultory, error)
	GetOne(ctx context.Context, consultoryId uint) (*Consultory, error)
	CreateOne(ctx context.Context, doctorId uint, consultory *Consultory) (*Consultory, error)
	UpdateOne(ctx context.Context, doctorId uint, consultoryId uint, updatedData map[string]interface{}) (*Consultory, error)
	DeleteOne(ctx context.Context, consultoryId uint, doctorId uint) error
}

type ValidateConsultory struct {
	DoctorID uint `json:"doctorId"`
}
