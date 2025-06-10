import { defaultShortcuts, ShortcutProps } from "@/styles/shortcuts";
import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

export interface StackProps extends PropsWithChildren, ShortcutProps, ViewProps {
    flex?: number
    direction?: "row" | "column"
    gap?: number
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline"
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
}

export function Stack({
    flex,
    direction,
    gap,
    alignItems,
    justifyContent,
    children,
    style,
    ...restProps
}: StackProps) {
    return (
        <View style={[defaultShortcuts(restProps), {
            flex,
            flexDirection: direction,
            gap,
            alignItems,
            justifyContent,
        }, style]} {...restProps}>
            {children}
        </View>
    )
}