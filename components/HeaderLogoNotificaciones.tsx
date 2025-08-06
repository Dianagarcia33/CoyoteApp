import { LogoCoyote } from "@/components/LogoCoyote";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface Props {
  onNotificationPress: () => void;
  unreadCount?: number; // Badge de mensajes no leídos
}

export const HeaderLogoNotificaciones: React.FC<Props> = ({ onNotificationPress, unreadCount = 0 }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
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
          backgroundColor: isDarkMode ? "#FFDACC" : "#FFDACC",
          borderRadius: 50,
          padding: 8,
        }}
        activeOpacity={0.8}
      >
        <Feather
          name="bell"
          size={22}
          color={isDarkMode ? "#ffffff" : "#111827"}
        />
        {/* Badge de notificaciones */}
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: "#EF4444",
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
