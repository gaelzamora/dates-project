import { Stack } from "expo-router";
import React from "react";

export default function ShopLayout() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Shop" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="item/[id]"/>
        </Stack>
    )
}