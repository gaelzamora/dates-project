import { User } from "@/types/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { userService } from "@/services/user";
import { Consultory } from "@/types/consultory";
import { consultoryService } from "@/services/consultory";

export default function ConsultoryDetailScreen() {
    const { id } = useLocalSearchParams()

    const [consultory, setConsultory] = useState<Consultory | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchConsultory = async () => {
            setIsLoading(true);
            try {
                const consultoryData = await consultoryService.getOne(Number(id));
                setConsultory(consultoryData);
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false);
            }
        };
        fetchConsultory();
    }, [id]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#4F8EF7" />
            </View>
        );
    }

    if (!consultory) {
        return <Text>No consultory data</Text>;
    }


    return (
        <View>
            <Text>{consultory.specialty}</Text>
        </View>
    )
}