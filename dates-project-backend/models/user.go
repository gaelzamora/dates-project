package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	Doctor  UserRole = "doctor"
	Patient UserRole = "patient"
)

type User struct {
	ID             uint      `json:"id" gorm:"primarykey"`
	FirstName      string    `json:"firstName" gorm:"text;not null"`
	LastName       string    `json:"lastName" gorm:"text;not null"`
	Email          string    `json:"email" gorm:"text;not null"`
	Role           UserRole  `json:"role" gorm:"text; default:patient"`
	Password       string    `json:"-"`
	Age            uint      `json:"age"`
	ProfilePicture string    `json:"profilePicture"`
	Rating         float64   `json:"rating" gorm:"default:0"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type UserRepository interface {
	UpdateProfilePicture(userId uint, imageURL string) error
	GetUserByID(userId uint) (*User, error)
	UpdateUserInfo(userId uint, updateData map[string]interface{}) error
}

func (u *User) AfterCreate(db *gorm.DB) (err error) {
	if u.ID == 1 {
		db.Model(u).Update("role", Doctor)
	}
	return
}
