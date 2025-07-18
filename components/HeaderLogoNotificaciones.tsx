import { LogoCoyote } from "@/components/LogoCoyote";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";

interface Props {
  onNotificationPress: () => void;
}

export const HeaderLogoNotificaciones: React.FC<Props> = ({ onNotificationPress }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 40,
        marginBottom: 16,
      }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <LogoCoyote width={120} height={60} />
      </View>
      <TouchableOpacity
        onPress={onNotificationPress}
        style={{
          position: "absolute",
          right: 20,
          top: 40,
          backgroundColor: isDarkMode ? "#1f2937" : "#f3f4f6",
          borderRadius: 12,
          padding: 8,
        }}
        activeOpacity={0.8}
      >
        <Feather
          name="bell"
          size={22}
          color={isDarkMode ? "#ffffff" : "#111827"}
        />
      </TouchableOpacity>
    </View>
  );
};
