import { Stack } from "expo-router"
import React from "react"

export default function ConsultoryLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="new" />
            <Stack.Screen name="consultory/[id]" />
        </Stack>
    )    
}