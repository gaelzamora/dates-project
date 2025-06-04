import { ApiResponse } from "./api";

export type ConsultoryResponse = ApiResponse<Consultory>
export type ConsultoryListResponse = ApiResponse<Consultory[]>

export type Consultory = {
    id: number
    name: string
    description: string
    doctorId: number
    location: string
    created_at: string
    updated_at: string
}