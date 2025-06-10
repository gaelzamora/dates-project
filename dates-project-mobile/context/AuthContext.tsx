import { userService } from "@/services/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { User } from "@/types/user";
import { router } from "expo-router";

interface AuthContextProps {
    isLoggedIn: boolean;
    isLoadingAuth: boolean;
    authenticate: (authMode: "login" | "register", email: string, password: string, firstName?: string, lastName?: string) => Promise<void>
    logout: VoidFunction;
    user: User | null;
}

const AuthContext = React.createContext({} as AuthContextProps);

export function useAuth() {
    return React.useContext(AuthContext)
}

export function AuthenticationProvider({ children }: React.PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoadingAuth, setIsLoadingAuth] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        async function checkIfLoggedIn() {
            const token = await AsyncStorage.getItem("token")
            const user = await AsyncStorage.getItem("user")

            if (token && user) {
                setIsLoggedIn(true)
                setUser(JSON.parse(user))
                router.replace("/(authed)/(tabs)/settings")
            } else {
                setIsLoggedIn(false)
            }
        }

        checkIfLoggedIn()
    }, [])

    async function authenticate(authMode: "login" | "register",  email: string, password: string, firstName: string, lastName: string) {
        try {
            setIsLoadingAuth(true)

            let response;
            
            if (authMode === "login") {
                response = await userService[authMode](email, password);
            } else if (authMode === "register") {
                response = await userService[authMode](firstName, lastName, email, password);
            }

                if (response) {
                    setIsLoggedIn(true)
                    await AsyncStorage.setItem("token", response.data.token)
                    await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
                    setUser(response.data.user)
                    router.replace("/(authed)/(tabs)/(consultories)")
                
                }
        } catch (error) {
            setIsLoggedIn(false)
        } finally {
            setIsLoadingAuth(false)
        }
    }

    async function logout() {
        setIsLoggedIn(false)
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider
            value={ {
                authenticate,
                logout,
                isLoggedIn,
                isLoadingAuth,
                user,
            } }>
                { children }
        </AuthContext.Provider>
    )
}