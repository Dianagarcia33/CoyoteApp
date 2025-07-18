import React from "react";
import { Text, TextInput, View, ViewStyle } from "react-native";

type InputCustomProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  isDarkMode?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  errorMessage?: string;
  style?: ViewStyle;
};

export function InputCustom({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  isDarkMode = false,
  secureTextEntry = false,
  keyboardType = "default",
  errorMessage,
  style,
}: InputCustomProps) {
  return (
    <View style={style}>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 12,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          height: 60,
          backgroundColor: isDarkMode ? "#070a13" : "#F7F8F8",
          borderWidth: errorMessage ? 1 : 0,
          borderColor: errorMessage ? "#EF4444" : "transparent",
        }}
      >
        {icon && React.isValidElement(icon) && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {React.cloneElement(icon, {
              color: isDarkMode ? "#FFFFFF" : icon.props.color ?? "#6B7280",
            })}
          </View>
        )}

        <TextInput
          style={{
            flex: 1,
            fontFamily: "Poppins-Regular",
            color: isDarkMode ? "#F9FAFB" : "#374151",
            paddingVertical: 0,
            paddingHorizontal: 0,
            height: "100%",
            textAlignVertical: "center",
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? "#9CA3AF" : "#A1A1AA"}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>

      {errorMessage && (
        <Text
          style={{
            marginTop: 4,
            color: "#EF4444",
            fontSize: 12,
            fontFamily: "Poppins-Regular",
          }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
