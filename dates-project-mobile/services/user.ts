import { AuthResponse } from "@/types/user"
import { Api } from "./api"

async function login(email: string, password: string): Promise<AuthResponse> {
    return Api.post("/auth/login", { email, password })
}

async function register(firstName: string, lastName: string, email: string, password): Promise<AuthResponse> {
    return Api.post("/auth/register", { firstName, lastName, email, password })
}

async function getUser(id: number): Promise<AuthResponse> {
    console.log("Numero aqui...")
    console.log(id)
    return Api.get(`/users/user/${id}`)    
}

const userService = {
    login,
    register,
    getUser,
}

export { userService }