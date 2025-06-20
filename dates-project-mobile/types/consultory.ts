import { ApiResponse } from "./api";

export type ConsultoryResponse = ApiResponse<Consultory>
export type ConsultoryListResponse = ApiResponse<Consultory[]>

export type Consultory = {
    id: number
    specialty: string
    description: string
    price: number
    location: string
    capacity: number
    rating: number
    created_at: string
    updated_at: string

    doctorId: number
    doctorFirstName: string
    doctorLastName: string
    doctorEmail: string
    doctorAge: number
    doctorProfilePicture: string
    doctorRating: number
}