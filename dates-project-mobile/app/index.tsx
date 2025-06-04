import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FooterWave from "@/components/FooterWave";
import { useRouter } from "expo-router";

export default function Index() {
    const router = useRouter()

    return (
        <View style={styles.container}>
            <View style={styles.primary_elements}>
                <View style={styles.title_elements}>
                    <Image source={require('@/assets/icon.png')}  
                        style={styles.image}
                    />
                    <Text style={styles.title}>MedTech</Text>
                </View>
                <Text style={styles.subtitle}>Reserva tu cita con los mejores especialistas.</Text>
            </View>

            <View style={styles.buttons_container}>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push("/login")}
                        >
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push("/register")}    
                    >
                        <Text style={styles.text}>Register</Text>
                    </TouchableOpacity>
            </View>
            <FooterWave />
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    primary_elements: {
        display: "flex",
        flexDirection: "column",
        marginTop: -150,
    },
    title_elements: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 70,
        height: 70,
        marginRight: 5,
    },
    title: {
        fontSize: 32,
        color: "#000",
        fontWeight: "bold",
    },
    subtitle: {
        color: "#737270",
        marginTop: 10,
        textAlign: 'center',
        fontWeight: "700",
    },
    buttons_container: {
        position: "absolute",
        bottom: 200,
        gap: 10,
    },
    button: {
        paddingHorizontal: 80,
        paddingVertical: 20,
        backgroundColor: "#297081",
        borderRadius: 3,
    },
    text: {
        fontWeight: "700",
        color: "#fff",
        textTransform: "uppercase",
        textAlign: "center",
        fontSize: 15,
    }
});