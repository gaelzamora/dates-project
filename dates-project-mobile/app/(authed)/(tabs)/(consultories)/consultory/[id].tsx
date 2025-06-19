import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Image } from "react-native";
import { Consultory } from "@/types/consultory";
import { consultoryService } from "@/services/consultory";
import { Ionicons } from "@expo/vector-icons";

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
        <View style={styles.container}>
            <Image
                source={{ uri: consultory.doctorProfilePicture }}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            />
            <View style={styles.overlay}>
                <Ionicons 
                    name="arrow-back-outline" 
                    size={30}
                    style={{ padding: 10 }}
                />
                <View style={{ 
                    flexDirection: "row",
                    alignItems: "center",
                 }}>
                    <Ionicons 
                        name="heart-outline"
                        size={30}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 450,
        position: "relative",
        overflow: "hidden",
        borderRadius: 15,
    },
    overlay: {
        flex: 1,
        paddingVertical: 56,
        paddingHorizontal: 26,
        backgroundColor: "rgba(0,0,0,0.1)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
})