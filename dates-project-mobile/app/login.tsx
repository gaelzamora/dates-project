import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { VStack } from "@/components/VStack";
import { HStack } from "@/components/HStack";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function login() {
    const router = useRouter()
    const { authenticate, isLoadingAuth } = useAuth()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [hidePassword, setHidePassword] = useState(true)

    async function onAuthenticate() {
        await authenticate("login", email, password)
    }
    
    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <VStack flex={1} justifyContent="center" alignItems="center" p={40} gap={40}>
                    <HStack gap={10} style={styles.title_elements}>
                        <Image source={require('@/assets/icon.png')}  
                            style={styles.image}
                        />
                    </HStack>

                    <TouchableOpacity
                        style={{ position: "absolute", left: 30, top: 80 }}
                        onPress={() => {
                            router.push("/")
                        }}   
                    >
                        <Ionicons name="arrow-back-outline" size={24} color={"#297081"} />
                    </TouchableOpacity>

                    <VStack w={"100%"} gap={15}>
                        <VStack gap={5}>
                            <Text ml={10} fontSize={14} color="gray">Email</Text>
                            <HStack
                                alignItems="center"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "lightgray",
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Input
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email"
                                    placeholderTextColor={"darkgray"}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    h={48}
                                    p={14}
                                    style={{ flex: 1, height: 48 }}
                                />
                            </HStack>
                        </VStack>

                        <VStack gap={5}>
                            <Text ml={10} fontSize={14} color="gray">Password</Text>
                            <HStack
                                alignItems="center"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "lightgray",
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Input
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Password"
                                    placeholderTextColor={"darkgray"}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    h={48}
                                    p={14}
                                    secureTextEntry={hidePassword}
                                    style={{ flex: 1, height: 48 }}

                                />
                                <TouchableOpacity
                                    onPress={() => setHidePassword(!hidePassword)}
                                    style={{ paddingHorizontal: 10 }} 
                                >
                                    <Ionicons 
                                        name={hidePassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color={"gray"}
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>

                        <Button
                            isLoading={isLoadingAuth}
                            onPress={onAuthenticate}
                        >
                            Login
                        </Button>
                    </VStack>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70,
    },
    title_elements: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})