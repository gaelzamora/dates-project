import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { ComponentProps } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function TabLayout() {
    const route = useRoute()
    const { user } = useAuth()

    const tabs = [
        {
            name: "(consultories)",
            displayName: "Home",
            icon: "home-sharp",
        },
        {
            name: "(dates)",
            displayName: "Notes",
            icon: "document-text-sharp",
        },
        {
            name: "(shop)",
            displayName: "Shop",
            icon: "bag-sharp",
        },
        
        {
            name: "settings",
            displayName: "Settings",
            icon: "settings-outline",
        },
    ];

    console.log("ruta: ", route.name)

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: "transparent",
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 120,
                    },
                    headerShown: false,
                }}
            >
                {tabs.map(tab => (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            tabBarLabel: () => null,    
                            tabBarIcon: ({ focused }) => (
                                <View style={[
                                    styles.containerIcon,
                                    focused && styles.activeIcon
                                ]}>
                                    <Ionicons
                                        name={
                                             tab.name === "settings"
                                            ? (focused ? "settings-outline" : "settings-sharp")
                                            : tab.icon as ComponentProps<typeof Ionicons>["name"]   
                                        }
                                        size={28}
                                        color={focused ? "white" : "#949598"}
                                    />
                                </View>
                            ),
                        }}
                    />
                ))}
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
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
    containerIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 70,
    },
    activeIcon: {
        backgroundColor: "#4461ed",
        borderRadius: 40,
    }
});