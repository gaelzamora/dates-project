import { ApiResponse } from "./api"

export enum UserRole {
    Doctor = "doctor",
    Patient = "patient",
}

export type AuthResponse = ApiResponse<{ token: string, user: User }>


export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    age: number;
    profilePicture: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
};