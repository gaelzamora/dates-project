package models

import (
	"context"
	"time"
)

type Date struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	Name            string    `json:"name" gorm:"not null"`
	DoctorID        uint      `json:"doctorId"`
	PatientID       uint      `json:"patientId" gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ConsultoryID    uint      `json:"consultoryId"`
	Used            bool      `json:"used" default:"false"`
	AppointmentDate string    `json:"appointmentDate"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type DateRepository interface {
	GetMany(ctx context.Context, userId uint) ([]*Date, error)
	GetOne(ctx context.Context, userId uint, dateId uint) (*Date, error)
	CreateOne(ctx context.Context, patientId uint, date *Date) (*Date, error)
	UpdateOne(ctx context.Context, userId uint, dateId uint, updatedData map[string]interface{}) (*Date, error)
	DeleteOne(ctx context.Context, dateId uint) error
}

type ValidateDate struct {
	DoctorID     uint `json:"doctorId"`
	PatientID    uint `json:"patientId"`
	ConsultoryID uint `json:"consultoryId"`
}
