import { AuthResponse, User } from "@/types/user"
import { Api } from "./api"

async function login(email: string, password: string): Promise<AuthResponse> {
    return Api.post("/auth/login", { email, password })
}

async function register(firstName: string, lastName: string, email: string, password): Promise<AuthResponse> {
    const response = await Api.post("/auth/register", { firstName, lastName, email, password })

    return response.data
}

async function getUser(id: number): Promise<User> {
    const response = await Api.get(`/users/user/${id}`)
    return response.data
}

const userService = {
    login,
    register,
    getUser,
}

export { userService }