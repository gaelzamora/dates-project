import { HStack } from "@/components/HStack";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { VStack } from "@/components/VStack";
import { useAuth } from "@/context/AuthContext";
import { consultoryService } from "@/services/consultory";
import { Consultory } from "@/types/consultory";
import { UserRole } from "@/types/user";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, StyleSheet, Text } from "react-native";

export default function ConsultoryScreen() {
    const { user } = useAuth()
    const navigation = useNavigation()

    const [isLoading, setIsLoading] = useState(false)
    const [consultories, setConsultories] = useState<Consultory[]>([])

    function onGoToConsultoryPage(id: number) {
        router.push(`/(authed)/(tabs)/(consultories)/consultory/[id]`)
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
                <Text style={styles.title}>Consultories</Text>
            </HStack>

            <FlatList
                data={consultories}
                keyExtractor={({ id }) => id.toString()}
                onRefresh={fetchConsultories}
                refreshing={isLoading}
                ItemSeparatorComponent={() => <VStack h={20} />}
                renderItem={({ item: consult }) => (
                    <VStack
                        gap={20}
                        p={20}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 20,
                        }}
                        key={consult.id}
                    >
                        <TouchableOpacity onPress={() => onGoToConsultoryPage(consult.id)}>
                            <HStack alignItems="center" justifyContent="space-between">
                                <HStack alignItems="center">
                                    <Text style={styles.name}>{consult.name}</Text>
                                    <Text style={styles.name}>|</Text>
                                    <Text style={styles.location}>{consult.location}</Text>
                                </HStack>
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                )}
            />
        </VStack>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
    },
    name: {
        fontSize: 26,
    },
    location: {
        fontSize: 16,
    }
})

const headerRight = () => {
    return (
        <TabBarIcon 
            size={32}
            name="add-circle-outline"
            onPress={() => router.push("/(authed)/(tabs)/(consultories)/new")}
        />
    )
}