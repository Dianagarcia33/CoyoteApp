import LogoImage from "@/assets/images/coyote-logo2.png"; // ajusta si usas otro logo
import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

type LogoCoyoteProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function LogoCoyote({ width = 150, height = 150, style }: LogoProps) {
  return (
    <Image
      source={LogoImage}
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}
