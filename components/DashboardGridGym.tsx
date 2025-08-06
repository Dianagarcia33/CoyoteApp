import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../app/context/AuthContext";

// Iconos
import ClientesIcon from "../assets/images/clientes.png";
import FacturacionIcon from "../assets/images/facturacion.png";
import PuntosIcon from "../assets/images/puntos.png";
import RutinasIcon from "../assets/images/rutinas.png";

const GAP = 12;
const TOTAL_COLUMNS = 5;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING = 32;
const TOTAL_GAP_WIDTH = GAP * (TOTAL_COLUMNS - 1);
const AVAILABLE_WIDTH = SCREEN_WIDTH - CONTAINER_PADDING - TOTAL_GAP_WIDTH;
const COLUMN_WIDTH = AVAILABLE_WIDTH / TOTAL_COLUMNS;

type GridButtonProps = {
  image: any;
  label: string;
  subLabel?: string;
  number?: string;
  backgroundColor: string;
  onPress?: () => void;
  columns?: number;
  iconPosition?: "left" | "top";
  labelColor?: string;
  labelFontSize?: number;
  subLabelColor?: string;
  subLabelFontSize?: number;
};

const GridButton: React.FC<GridButtonProps> = ({
  image,
  label,
  subLabel,
  number,
  backgroundColor,
  onPress,
  columns = 2,
  iconPosition = "left",
  labelColor = "#000",
  labelFontSize = 16,
  subLabelColor = "#666",
  subLabelFontSize = 12,
}) => {
  const width = columns * COLUMN_WIDTH + GAP * (columns - 1);
  const isIconTop = iconPosition === "top";

  return (
    <TouchableOpacity
      style={{
        backgroundColor,
        padding: 20,
        borderRadius: 16,
        width,
        flexDirection: isIconTop ? "column" : "row",
        alignItems: "center",
        justifyContent: isIconTop ? "center" : "flex-start",
      }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={image}
        style={{
          width: 64,
          height: 64,
          resizeMode: "contain",
          marginBottom: isIconTop ? 8 : 0,
          marginRight: isIconTop ? 0 : 12,
        }}
      />
      <View
        style={{ flex: 1, alignItems: isIconTop ? "center" : "flex-start" }}
      >
        <Text
          style={{
            fontSize: labelFontSize,
            fontWeight: "bold",
            color: labelColor,
            textAlign: isIconTop ? "center" : "left",
          }}
        >
          {label}
        </Text>
        {subLabel && (
          <Text
            style={{
              fontSize: subLabelFontSize,
              color: subLabelColor,
              marginTop: 4,
              textAlign: isIconTop ? "center" : "left",
            }}
          >
            {subLabel}
          </Text>
        )}
      </View>
      {number && !isIconTop && (
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4B0082" }}>
          {number}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const DashboardGridGym = () => {
  const { user } = useAuth();

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      {/* Fila 1: Puntos (3) + Facturación (2) */}
      <View style={{ flexDirection: "row", gap: GAP, marginBottom: GAP }}>
        <GridButton
          image={PuntosIcon}
          label={`${user?.puntos || 0} Puntos`}
          backgroundColor="#FEF9C3"
          columns={3}
          iconPosition="left"
          labelColor="#A16207"
          labelFontSize={28}
        />
        <GridButton
          image={FacturacionIcon}
          label="Facturación"
          backgroundColor="#BBF7D0"
          columns={2}
          labelColor="#14532D"
          iconPosition="top"
          labelFontSize={18}
        />
      </View>
      <View style={{ flexDirection: "row", gap: GAP, marginBottom: GAP }}>
        <GridButton
          image={ClientesIcon}
          label="Clientes"
          iconPosition="top"
          number="4"
          backgroundColor="#DDD6FE"
          columns={5}
          labelFontSize={24}
        />
      </View>

      {/* Fila 4: Gestionar rutinas (5) */}
      <View style={{ flexDirection: "row" }}>
        <GridButton
          image={RutinasIcon}
          label="Gestionar Equipamiento"
          backgroundColor="#D4D4D4"
          columns={5}
          iconPosition="Left"
          onPress={() => router.push("../rutinas/misRutinas")}
          labelColor="#111827"
          labelFontSize={22}
          subLabelColor="#374151"
        />
      </View>
    </View>
  );
};
