import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { ComponentProps } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function TabLayout() {
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