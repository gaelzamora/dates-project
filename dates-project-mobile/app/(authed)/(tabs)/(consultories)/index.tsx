import { VStack } from "@/components/VStack";
// import { useAuth } from "@/context/AuthContext";
import { consultoryService } from "@/services/consultory";
import { Consultory } from "@/types/consultory";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View, Image, Dimensions } from "react-native";

export default function ConsultoryScreen() {
    // const { user } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [consultories, setConsultories] = useState<Consultory[]>([])

    // function onGoToConsultoryPage(id: number) {
    //     router.push(`/(authed)/(tabs)/(consultories)/consultory/[id]`)
    // }

    const screenWidth = Dimensions.get("window").width
    const imageWidth = screenWidth - 40
    const imageHeight = (imageWidth * 220) / 345

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

    return (
        <VStack flex={1} p={20} gap={20}>
            <View style={styles.addConsultories}>
                <Image 
                    source={require("@/assets/ads/add1.png")}
                    style={{ width: imageWidth, height: imageHeight, borderRadius: 20 }}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.consultoriesContainer}>
                <View style={styles.headerAllConsultories}> 
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>All Consultories</Text>
                    <View style={styles.rightOption}>
                        <Text style={{ fontWeight: "600", fontSize: 14 }}>Popular</Text>
                        <Image 
                            source={require("@/assets/utils/arrow-to-down.png")}
                            style={{ width: 12, height: 12, marginLeft: 10 }}
                        />
                    </View>
                </View>

                <FlatList
                    data={consultories}
                    keyExtractor={({ id }) => id.toString()}
                    onRefresh={fetchConsultories}
                    refreshing={isLoading}
                    numColumns={2}
                    style={{ height: "100%" }}
                    renderItem={({ item: consult }) => (
                        <View style={styles.gridItem}>
                            <Text style={styles.nameConsultory}>{consult.name}</Text>
                            <Text style={styles.locationConsultory}>{consult.location}</Text>
                            <View style={styles.containerRate}>
                                <Ionicons 
                                    name="star"
                                    color={"white"}
                                    size={15}
                                />
                                <Text style={styles.textMedium}>5.0</Text>
                            </View>
                        </View>
                    )}           
                />
            </View>
        </VStack>
    )
}

const styles = StyleSheet.create({
    consultoriesContainer: {
        margin: 0
    },
    headerAllConsultories: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    rightOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    gridItem: {
        width: 160,
        height: 160,
        margin: 8,
        backgroundColor: "#4461ed",
        padding: 20,
        borderRadius: 20,
    },
    nameConsultory: {
        fontSize: 20,
        color: "white",
        fontWeight: "600"
    },
    locationConsultory: {
        fontSize: 13,
        color: "#d9d9d9",
        fontWeight: "600",
        marginTop: 30,
    },
    containerRate: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    textMedium: {
        color: "white",
        fontWeight: "600",
        marginLeft: 10
    },
    addConsultories: {
        margin: 0
    }
})
