package models

import "time"

type Rating struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	FromUserID   uint      `json:"fromUserId" gorm:"not null"`
	ToUserID     uint      `json:"toUserId" gorm:"not null"`
	ConsultoryID *uint     `json:"consultoryId"`
	Stars        float64   `json:"stars" gorm:"not null"`
	CreatedAt    time.Time `json:"createdAt"`
}

type RatingRepository interface {
	AddRating(rating *Rating) error
	UpdateUserRating(userId uint) error
	UpdateConsultoryRating(consultoryId uint) error
	//GetUserAverageRating(id string, avgRating *float64) error
	//GetConsultoryAverageRating(id string, avgRating *float64) error
}
