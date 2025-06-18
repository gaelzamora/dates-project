import { ConsultoryResponse, ConsultoryListResponse, Consultory } from "@/types/consultory";
import { Api } from "./api";

async function createOne(name: string, description: string, location: string, capacity: number): Promise<ConsultoryResponse> {
    return Api.post("/consultories", { name, description, location, capacity })
}

async function getOne(id: number): Promise<Consultory> {
    const response = await Api.get(`/consultories/${id}`)
    return response.data
}

async function getAll(page, limit, specialty: string): Promise<ConsultoryListResponse> {
    if (specialty == "all") {
        specialty = ""
    }
    
    return Api.get("/consultories", {
        params: { page, limit, specialty}
    })
}

async function updateOne(id: number, name: string, description: string, location: string, capacity: number): Promise<ConsultoryResponse> {
    return Api.put(`/consultories/${id}`, { name, description, location, capacity })
}

async function deleteOne(id: number): Promise<null> {
    return Api.delete(`/consultories/${id}`)
}

export const consultoryService = {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne
}
