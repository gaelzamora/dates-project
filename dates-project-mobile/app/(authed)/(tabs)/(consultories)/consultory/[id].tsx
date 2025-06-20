import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Consultory } from "@/types/consultory";
import { consultoryService } from "@/services/consultory";
import { Ionicons } from "@expo/vector-icons";
import { icons } from "@/icons/icons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from 'react-native-elements'
import { AboutTab } from "@/components/consultory/AboutTab";

const tabList = [
    { key: "about", label: "About" },
    { key: "availability", label: "Abailability" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
]

export default function ConsultoryDetailScreen() {    
    const [consultory, setConsultory] = useState<Consultory | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("About")

    const { id } = useLocalSearchParams()
    const router = useRouter()

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
        <View style={{ paddingHorizontal: 16 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={{ uri: consultory.doctorProfilePicture }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                    />

                    <View style={styles.overlay}>
                        <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons 
                            name="arrow-back-outline" 
                            size={25}
                            style={styles.icon}
                        />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Ionicons name="heart-outline" size={25} style={styles.icon} />
                            <Ionicons name="share-social-outline" size={25} style={styles.icon} />
                        </View>
                    </View>

                    <View style={styles.doctorInfContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                            <MaterialCommunityIcons 
                                name={icons.specialist[consultory.specialty] || "help-circle-outline"}
                                size={20}
                                color={"#595959"}
                            />
                            <Text style={{ textTransform: "capitalize", color: "#595959", fontSize: 15 }}>{consultory.specialty}</Text>
                        </View>
                        <Text style={styles.doctorName}>{"Dr. " + consultory.doctorFirstName + " " + consultory.doctorLastName}</Text>
                        <Text style={styles.price}>{"$" + consultory.price}<Text style={styles.text}>/session</Text> </Text>
                    </View>

                    <View style={styles.detailsDoctor}>
                        <View style={styles.itemDetail}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                <Icon 
                                    name="work-history"
                                    color={"#9a5c33"}
                                />
                            </View>
                            <Text style={styles.information}>{consultory.doctorAge} years</Text>
                            <Text style={styles.titleInformation}>Experience</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                <Icon 
                                    name="star"
                                    color={"#f9dc23"}
                                />
                            </View>
                            <Text style={styles.information}>{consultory.rating}</Text>
                            <Text style={styles.titleInformation}>Rating</Text>
                        </View>
                        <View style={styles.itemDetail}>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                                <Icon 
                                    name="groups"
                                    color={"#4b4b49"}
                                />
                            </View>
                            <Text style={styles.information}>1500+</Text>
                            <Text style={styles.titleInformation}>Patients</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.tabContent}>
                    {tabList.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.label)}
                            style={[
                                activeTab === tab.label && styles.textTabActive
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textTab,
                                    activeTab === tab.label && { color: "black" }
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View> 
                <View style={styles.tabInfContainer}>
                    {activeTab === "About" && <AboutTab {...consultory} />}
                </View>

            </ScrollView>
                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity
                        style={styles.bookNowButton}
                        activeOpacity={0.8}
                        onPress={() => {
                        // Acción de agendar
                        }}
                    >
                        <Icon name="event-available" size={24} color="#fff" />
                        <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
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
    },
    overlay: {
        flex: 1,
        paddingVertical: 56,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    text: {
        color: "#595959",
        fontSize: 14,
        fontWeight: "bold",
    },
    icon: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 999,
    },
    doctorInfContainer: {
        paddingHorizontal: 20,
        position: "absolute",
        top: 140        
    },
    doctorName: {
        fontSize: 30,
        fontWeight: "700",
        maxWidth: 140,
    },
    price: {
        fontSize: 30,
        color: "#3a7df3",
        fontWeight: "800",
        marginTop: 20,
    },
    detailsDoctor: {
        bottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
    },
    itemDetail: {
        flex: 1,
        textAlign: "center",
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 5,
        borderRadius: 10
    },
    information: {
        fontSize: 18,
        fontWeight: "700"
    },
    titleInformation: {
        fontSize: 12,
        color: "#595959"
    },
    tabContent: {
        backgroundColor: "#e8e8e8",
        borderRadius: 40,
        marginTop: 10,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    textTab: {
        fontWeight: "500",
        color: "#696969",
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    textTabActive: {
        backgroundColor: "white",
        color: "black",
        borderRadius: 30
    },
    fixedButtonContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -20,
        alignItems: "center",
        zIndex: 100,
    },
    tabInfContainer: {

    },
    bookNowButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4461ed",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 10,
        elevation: 4,
        width: "90%",
        alignSelf: "center"
    },
    bookNowText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 12,
    },
})