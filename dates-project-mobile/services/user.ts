import { AuthResponse } from "@/types/user"
import { Api } from "./api"

async function login(email: string, password: string): Promise<AuthResponse> {
    console.log(email, password)
    return Api.post("/auth/login", { email, password })
}

async function register(firstName: string, lastName: string, email: string, password): Promise<AuthResponse> {
    console.log("Tus credenciales son: ", firstName, lastName, email, password)
    return Api.post("/auth/register", { firstName, lastName, email, password })
}

const userService = {
    login,
    register,
}

export { userService }