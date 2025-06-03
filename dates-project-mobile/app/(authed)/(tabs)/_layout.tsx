import {TabBarIcon} from "@/components/navigation/TabBarIcon";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { ComponentProps } from "react";
import { Text } from "react-native";

export default function TabLayout() {
    const {user} = useAuth()

    const tabs = [
        {
            showFor: [UserRole.Patient, UserRole.Doctor],
            name: "(consultory)",
            displayName: "Consultory",
            icon: "calendar",
            options: {
                headerShown: false,
            }
        },
        {
            showFor: [UserRole.Patient],
            name: "(dates)",
            displayName: "My Dates",
            icon: "ticket",
            options: {
                headerShown: false,
            }
        },
        {
            showFor: [UserRole.Doctor],
            name: "scan-date",
            displayName: "Scan Date",
            icon: "scan",
            options: {
                headerShown: true,
            }
        },
        {
            showFor: [UserRole.Patient, UserRole.Doctor],
            name: "settings",
            displayName: "Settings",
            icon: "cog",
            options: {
                headerShown: true,
            }
        },
    ];

    return (
        <Tabs>
            { tabs.map(tab => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        ...tab.options,
                        headerTitle: tab.displayName,
                        href: tab.showFor.includes(user?.role!) ? `/(authed)/(tabs)/settings` : null,
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ color: focused ? "black" : "gray", fontSize: 12 }}>
                                {tab.displayName} 
                            </Text>
                        ),
                        tabBarIcon: ({ focused }) => (
                            <TabBarIcon 
                                name={tab.icon as ComponentProps<typeof Ionicons>["name"]}
                                color={focused ? "black" : "gray"}
                            />
                        )
                    }}
                />
            ))}
        </Tabs>
    )
}