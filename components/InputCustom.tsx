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
  style?: ViewStyle; // para altura externa
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
        className={`w-full px-3 rounded-2xl flex-row items-center gap-3 ${
          isDarkMode ? "bg-[#070a13]" : "bg-[#F7F8F8]"
        } ${errorMessage ? "border border-red-500" : ""}`}
        style={{
          height: 60,
        }}
      >
        {icon && (
          <View className="justify-center items-center">
            {React.cloneElement(icon as React.ReactElement, {
              color: isDarkMode ? "#FFFFFF" : (icon as any)?.props?.color,
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
          className="mt-1 text-red-500 text-xs font-semibold"
          style={{ fontFamily: "Poppins-Regular" }}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
