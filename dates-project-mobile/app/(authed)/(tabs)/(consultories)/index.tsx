import { VStack } from "@/components/VStack";
// import { useAuth } from "@/context/AuthContext";
import { consultoryService } from "@/services/consultory";
import { Consultory } from "@/types/consultory";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View, Image, Dimensions, ScrollView, Animated } from "react-native";

export default function ConsultoryScreen() {
    // const { user } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [consultories, setConsultories] = useState<Consultory[]>([])

    // function onGoToConsultoryPage(id: number) {
    //     router.push(`/(authed)/(tabs)/(consultories)/consultory/[id]`)
    // }

    const images = [
        require("@/assets/ads/add1.png"),
        require("@/assets/ads/add2.png"),
    ]
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim1 = useRef(new Animated.Value(1)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;

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

   useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            // Crossfade: la actual se desvanece, la siguiente aparece
            Animated.parallel([
                Animated.timing(currentIndex === 0 ? fadeAnim1 : fadeAnim2, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(currentIndex === 0 ? fadeAnim2 : fadeAnim1, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentIndex(nextIndex);
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex, fadeAnim1, fadeAnim2, images.length]);

    useFocusEffect(useCallback(() => { fetchConsultories() }, []))

    return (
        <FlatList
            data={consultories}
            keyExtractor={({ id }) => id.toString()}
            onRefresh={fetchConsultories}
            refreshing={isLoading}
            numColumns={2}
            contentContainerStyle={{ padding: 20, gap: 20 }}
            ListHeaderComponent={
                <>
                    <View style={{ width: imageWidth, height: imageHeight, borderRadius: 20, overflow: "hidden" }}>
                        <Animated.Image
                            source={images[0]}
                            style={{
                                position: "absolute",
                                width: imageWidth,
                                height: imageHeight,
                                borderRadius: 20,
                                opacity: fadeAnim1,
                            }}
                            resizeMode="cover"
                        />
                        <Animated.Image
                            source={images[1]}
                            style={{
                                position: "absolute",
                                width: imageWidth,
                                height: imageHeight,
                                borderRadius: 20,
                                opacity: fadeAnim2,
                            }}
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
                    </View>
                </>
            }
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
})
