import { Consultory } from "@/types/consultory"
import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Icon } from "react-native-elements"

export const AboutTab = ( consultory : Consultory | null) => {
    return (
        <>
            <Text style={{
                fontWeight: "700",
                fontSize: 20,
                marginVertical: 15
            }}>Description</Text>
            <Text style={styles.containerDescription}>{consultory.description}</Text>

            <View style={styles.pricesSession}>
                <View style={styles.sessionContainer}>
                    <Icon 
                        name="paid"
                        size={25}
                        color={"#545454"}
                    />
                    <Text style={styles.sessionText}>Session Fee</Text>
                    <Text style={styles.sessionPrice}>$95.00</Text>
                </View>
                <View style={styles.sessionContainer}>
                    <Icon 
                        name="chat"
                        size={25}
                        color={"#545454"}
                    />
                    <Text style={styles.sessionText}>Message Fee</Text>
                    <Text style={styles.sessionPrice}>$20.00<Text style={{ color: "#8f8f8f" }}> (30 days)</Text></Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerDescription: {
        textAlign: "justify",
    },
    pricesSession: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginTop: 10
    },
    sessionContainer: {
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 18,
        flex: 1,
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap: 5,
        alignItems: "flex-start"
    },
    sessionText: {
        fontSize: 15,
        color: "545454"
    },
    sessionPrice: {
        fontSize: 14,
        fontWeight: "700"
    }
})