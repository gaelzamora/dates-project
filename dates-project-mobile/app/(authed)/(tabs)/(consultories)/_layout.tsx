import { Stack } from "expo-router"
import React from "react"

export default function ConsultoryLayout() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Consultories" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="new" />
            <Stack.Screen name="consultory/[id]" />
        </Stack>
    )    
}