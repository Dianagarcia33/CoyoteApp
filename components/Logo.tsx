import LogoImage from "@/assets/images/loginIcon.png"; // ajusta si usas otro logo
import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type LogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ width = 150, height = 150, style }: LogoProps) {
  return (
    <Image
      source={LogoImage}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}
