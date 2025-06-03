import { StatusBar, Text } from "react-native";
import React from "react";
import "../global.css";
import { Slot } from "expo-router";
import { AuthenticationProvider } from "@/context/AuthContext";


export default function Root() {
  return (
    <>
      <StatusBar/>
      <AuthenticationProvider>
        <Slot />
      </AuthenticationProvider>
    </>
  )
}