import LogoImage from "@/assets/images/react-logo.png"; // ajusta si usas otro logo
import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type LogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ width = 120, height = 120, style }: LogoProps) {
  return (
    <Image
      source={LogoImage}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}
