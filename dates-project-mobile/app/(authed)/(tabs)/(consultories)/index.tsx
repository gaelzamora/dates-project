// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { consultoryService } from "@/services/consultory";
import { Consultory } from "@/types/consultory";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View, Image, Dimensions, Animated, TouchableOpacity, ActivityIndicator,  } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { icons } from "@/icons/icons";

const specialistList = [
    "all",
    "general",
    "pediatric",
    "cardiology",
    "neurology",
    "pulmonology",
    "physiotherapy",
    "psychology"
]

export default function ConsultoryScreen() {
    const [isLoading, setIsLoading] = useState(false)
    const [consultories, setConsultories] = useState<Consultory[]>([])
    const [activeConsultoryOption, setActiveConsultoryOption] = useState(specialistList[0])

    const { user } = useAuth()

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

    const fetchConsultories = async (specialty: string) => {
        try {
            setIsLoading(true)
            const response = await consultoryService.getAll(1, 4, specialty)
            setConsultories(response.data)
        } catch (error) {
            Alert.alert("Error", error)
        } finally {
            setIsLoading(false)
        }
    }   

    function onGoToConsultory(id: number) { 
      router.push(`/(authed)/(tabs)/(consultories)/consultory/${id}`)
    }

   useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % images.length;
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

    useFocusEffect(useCallback(() => { fetchConsultories(activeConsultoryOption.toLowerCase()) }, [activeConsultoryOption]))

    return (

      <>
          <View style={styles.headerContainer}>
                <View style={styles.profileSection}>
                    <Image 
                        source={{ uri: user.profilePicture }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.userName}>
                            {(user?.firstName && user?.lastName) ? `${user.firstName} ${user.lastName}` : "Usuario"}
                        </Text>
                    </View>
                </View>
                <View style={styles.iconSection}>
                    <Ionicons name="search" size={24} color="black" style={styles.headerIcon} />
                    <Ionicons name="filter" size={24} color="black" style={styles.headerIcon} />
                </View>
        </View>
        <FlatList
          data={consultories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, gap: 20 }}
          ListEmptyComponent={
            isLoading ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
                <ActivityIndicator size="large" color="#4F8EF7" />
              </View>
            ) : (
              <Text style={{ textAlign: "center", marginTop: 40 }}>No consultorios encontrados</Text>
            )
          }
          ListHeaderComponent={
            <>
              <View style={{ width: imageWidth, height: imageHeight, borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
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
                  <Text style={{ fontSize: 20, fontWeight: "700" }}>Doctor Speciality</Text>
                </View>
              </View>
    
              <FlatList
                data={specialistList}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingVertical: 10, gap: 1 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    style={[
                        styles.consultoryOption,
                        activeConsultoryOption === item && styles.activeOptionConsultory
                    ]}
                    onPress={async () => {
                      setActiveConsultoryOption(item);
                      await fetchConsultories(item.toLowerCase());
                    }}
                    >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialCommunityIcons
                        name={icons.specialist[item] || "menu"}
                        size={22}
                        color="#4F8EF7"
                        />
                        <Text style={[
                            { fontWeight: "600", marginLeft: 8, textTransform: "capitalize" },
                            activeConsultoryOption === item && styles.activeOptionConsultoryText
                        ]}>{item}</Text>
                    </View>
                    </TouchableOpacity>
                )}
                />
    
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
            <TouchableOpacity 
              onPress={() => onGoToConsultory(consult.id)}
              style={styles.gridItem}>
                <Image 
                    source={{ uri: consult.doctorProfilePicture }}
                    style={styles.avatarDoctor}
                />
                <View>
                    <Text style={styles.textSpecialty}>{consult.specialty}</Text>
                    <Text style={styles.textDoctor}>{"Dr. " + consult.doctorFirstName + " " + consult.doctorLastName}</Text>
                    <Text>{consult.location}</Text>
                    <View style={styles.containerRate}>
                        <Ionicons 
                            name="star"
                            color={"black"}
                            size={15}
                        />
                        <Text style={styles.textMedium}>{consult.rating}</Text>
                    </View>
                </View>
            </TouchableOpacity>
          )}
        />
      </>
  );
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
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: 110,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 20,
    },
    avatarDoctor: {
        width: 90,
        height: 90,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    textDoctor: {
        fontSize: 15,
        fontWeight: "700",
        color: "#545454"
    },
    locationDoctor: {
        color: "#545454",
        fontSize: 12,
        fontWeight: "600"
    },
    containerRate: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    textMedium: {
        color: "black",
        fontWeight: "600",
        marginLeft: 10
    },
    consultoryOption: {
        backgroundColor: "#fff",    
        borderRadius: 36,
        paddingHorizontal: 18,
        paddingVertical: 12,
        marginRight: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Sombra para Android
        elevation: 5,
        borderColor: "#d3d3d3",
        borderWidth: 1
    },
    activeOptionConsultory: {
        borderColor: "#4F8EF7",
        borderWidth: 1
    },
    activeOptionConsultoryText: {
        color: "#4F8EF7"
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginTop: 30
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    greeting: {
        fontSize: 14,
        color: "#585858",
        fontWeight: "500"
    },
    userName: {
        fontSize: 17,
        fontWeight: "700",
        color: "black",
    },
    iconSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerIcon: {
        marginLeft: 16,
    },
    textSpecialty: {
      fontSize: 10,
      color: "#595959",
      textTransform: "capitalize"
    }
})
