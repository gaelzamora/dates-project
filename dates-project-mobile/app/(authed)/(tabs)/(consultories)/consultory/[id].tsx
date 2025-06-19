import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Image } from "react-native";
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

    console.log(consultory.doctorProfilePicture)

    return (
        <View>
            <Image 
                source={{ uri: consultory.doctorProfilePicture }}
                width={100}
                height={100}
            />
            <View style={styles.consultoryInformationContainer}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    consultoryInformationContainer: {
        padding: 20,
    },

})