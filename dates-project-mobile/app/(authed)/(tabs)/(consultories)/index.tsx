import { HStack } from "@/components/HStack";
import { VStack } from "@/components/VStack";
import { useAuth } from "@/context/AuthContext";
import { consultoryService } from "@/services/consultory";
import { Consultory } from "@/types/consultory";
import { UserRole } from "@/types/user";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ConsultoryScreen() {
    const { user } = useAuth()
    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState(false)
    const [consultories, setConsultories] = useState<Consultory[]>([])

    function onGoToConsultoryPage(id: number) {
        router.push(`(authed)/(tabs)/(consultories)${id}`)
    }

    const fetchConsultories = async () => {
        try {
            setIsLoading(true)
            const response = await consultoryService.getAll()
            setConsultories(response.data)
        } catch (error) {
            Alert.alert("Error", error)
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => { fetchConsultories() }, []))

    useEffect(() => {
        navigation.setOptions({
            HeaderTitle: "Consultories",
            HeaderRight: user?.role === UserRole.Doctor ? headerRight : null,
        })
    }, [navigation, user])

    return (
        <VStack flex={1} p={20} gap={20}>
            <HStack alignItems="center" justifyContent="center">
                <Text style={}>Consultories</Text>
            </HStack>
        </VStack>
    )
}