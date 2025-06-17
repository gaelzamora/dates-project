import { AuthResponse } from "@/types/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { userService } from "@/services/user";

export default function ConsultoryDetailScreen() {
    const { id } = useLocalSearchParams()

    const [user, setUser] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await userService.getUser(Number(id));
                setUser(response);
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#4F8EF7" />
            </View>
        );
    }

    if (!user) {
        return <Text>No user data</Text>;
    }


    return (
        <View>
            <Text>ID: {user.data.user.id}</Text>
            <Text>Name: {user.data.user.firstName} {user.data.user.lastName}</Text>
            <Text>Email: {user.data.user.email}</Text>
            {/* Agrega más campos según tu AuthResponse */}
        </View>
    )
}