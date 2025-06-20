package models

import (
	"context"
	"time"
)

type TypesConsultory string

const (
	GeneralMedicine TypesConsultory = "generalMedicine"
	Pediatrics      TypesConsultory = "pediatrics"
	Cardiology      TypesConsultory = "cardiology"
	Neurology       TypesConsultory = "neurology"
	Pulmonology     TypesConsultory = "pulmonology"
	Physiotherapy   TypesConsultory = "physiotherapy"
	Psychology      TypesConsultory = "psychology"
)

type Consultory struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Specialty   string    `json:"specialty"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	DoctorID    uint      `json:"doctorId"`
	Location    string    `json:"location"`
	Capacity    uint      `json:"capacity"`
	Rating      float64   `json:"rating" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ImageTypeConsultory string

const (
	Common ImageTypeConsultory = "common"
	Main   ImageTypeConsultory = "main"
)

type ImageConsultory struct {
	ID           uint                `json:"id" gorm:"primaryKey"`
	ConsultoryID uint                `json:"consultoryId"`
	DoctorID     uint                `json:"doctorId"`
	URL          string              `json:"url"`
	Type         ImageTypeConsultory `json:"type"`
	CreatedAt    time.Time           `json:"created_at"`
}

type ConsultoryWithDoctor struct {
	ID          uint      `json:"id"`
	Specialty   string    `json:"specialty"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Location    string    `json:"location"`
	Capacity    uint      `json:"capacity"`
	Rating      float64   `json:"rating"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	DoctorID         uint    `json:"doctorId"`
	DoctorFirstName  string  `json:"doctorFirstName"`
	DoctorLastName   string  `json:"doctorLastName"`
	DoctorEmail      string  `json:"doctorEmail"`
	DoctorAge        uint    `json:"doctorAge"`
	DoctorProfilePic string  `json:"doctorProfilePicture"`
	DoctorRating     float64 `json:"doctorRating"`
}

type ConsultoryRepository interface {
	GetOne(ctx context.Context, consultoryId uint) (ConsultoryWithDoctor, error)
	CreateOne(ctx context.Context, doctorId uint, consultory *Consultory) (*Consultory, error)
	UpdateOne(ctx context.Context, doctorId uint, consultoryId uint, updatedData map[string]interface{}) (*Consultory, error)
	DeleteOne(ctx context.Context, consultoryId uint, doctorId uint) error
	SaveConsultoryImage(image *ImageConsultory) error
	GetImagesFromConsultory(consultoryId uint) ([]*ImageConsultory, error)
	GetManyWithDoctor(ctx context.Context, offset, limit int, specialty string) ([]ConsultoryWithDoctor, error)
}

type ValidateConsultory struct {
	DoctorID uint `json:"doctorId"`
}
