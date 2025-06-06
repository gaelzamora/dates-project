import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function TabLayout() {
    const { user } = useAuth();

    const tabs = [
        {
            name: "(consultory)",
            displayName: "Home",
            icon: "home",
            showFor: [true], // visible for all
        },
        {
            name: "(dates)",
            displayName: "Notas",
            icon: "document-text",
            showFor: [true],
        },
        {
            name: "settings",
            displayName: "Settings",
            icon: "settings",
            showFor: [true],
        },
    ];

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                },
                headerShown: false,
            }}
        >
            {tabs.map(tab => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        tabBarLabel: tab.displayName,
                        tabBarIcon: ({ focused }) => (
                            <View
                                style={[
                                    styles.iconWrapper,
                                    focused && styles.iconWrapperActive,
                                ]}
                            >
                                <Ionicons
                                    name={tab.icon as ComponentProps<typeof Ionicons>["name"]}
                                    size={28}
                                    color={focused ? "#fff" : "gray"}
                                />
                            </View>
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        borderRadius: 999,
        padding: 8,
    },
    iconWrapperActive: {
        backgroundColor: "#2970e1",
        borderRadius: 999,
    },
});