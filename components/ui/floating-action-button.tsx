import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  icon?: string; // Ionicons name
  size?: number;
  color?: string;
  backgroundColor?: string;
  position?: { bottom?: number; right?: number; left?: number };
  onPress: () => void;
}

export function FloatingActionButton({
  icon = "add",
  size = 28,
  color = "white",
  backgroundColor = "#3B82F6", // Tailwind's blue-500
  position = { bottom: 24, right: 20 },
  onPress,
}: FloatingActionButtonProps) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: position.bottom,
        right: position.right,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 50,
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 28,
        }}
        android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: true }}
      >
        <Ionicons name={icon as any} size={size} color={color} />
      </Pressable>
    </View>
  );
}
