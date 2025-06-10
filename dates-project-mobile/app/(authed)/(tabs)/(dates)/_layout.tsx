import { Stack } from "expo-router";
import React from "react";

export default function DateLayout() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Dates" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="date/[id]" />
        </Stack>
    )
}