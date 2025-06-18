import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type ButtonCustomProps = {
  text?: string;
  icon?: React.ReactNode;
  height?: number | string;
  width?: number | string;
  onPress?: () => void;
  colors?: string[]; // <-- nueva prop para los colores del gradiente
};

export function ButtonCustom({
  text,
  icon,
  height = 48,
  width,
  onPress,
  colors,
}: ButtonCustomProps) {
  const gradientColors = colors ?? ["#F95B38", "#ED4F56"]; // colores por defecto

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.shadow,
        { height },
        width !== undefined ? { width } : undefined,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.button,
          { height } as ViewStyle,
          width !== undefined ? { width } : undefined,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: 320, // ancho por defecto
    borderRadius: 16,
    shadowColor: "rgba(0,0,0,0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 5,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});
