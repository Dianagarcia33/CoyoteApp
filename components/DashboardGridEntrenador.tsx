import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type GridButtonProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subLabel?: string;
  backgroundColor: string;
  onPress?: () => void;
  fullWidth?: boolean;
};

const GridButton: React.FC<GridButtonProps> = ({
  icon,
  label,
  subLabel,
  backgroundColor,
  onPress,
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        flex: fullWidth ? 1 : 0.48,
        backgroundColor,
        padding: 20,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name={icon} size={32} color="#333" />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 10 }}>
        {label}
      </Text>
      {subLabel && (
        <Text style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{subLabel}</Text>
      )}
    </TouchableOpacity>
  );
};

export const DashboardGridEntrenador = () => {
  return (
    <View style={{   paddingHorizontal: 20 }}>
     
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <GridButton
          icon="award"
          label="20.000 pts"
          backgroundColor="#FEE2E2" // pastel rojo
        />
        <GridButton
          icon="file-text"
          label="Facturación"
          backgroundColor="#DBEAFE" // pastel azul
        />
      </View>

      {/* Fila 2 - botón completo */}
      <View style={{ flexDirection: "row" }}>
        <GridButton
          icon="calendar"
          label="Próxima sesión"
          subLabel="28/06/2025 - 8:00am"
          backgroundColor="#DCFCE7" // pastel verde
          fullWidth
        />
      </View>

      {/* Fila 3 */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <GridButton
          icon="alert-triangle"
          label="SOS"
          backgroundColor="#FDF2E9" // pastel naranja
        />
        <GridButton
          icon="users"
          label="Clientes"
          backgroundColor="#EDE9FE" // pastel morado
        />
      </View>

      {/* Fila 4 - botón completo */}
      <View style={{ flexDirection: "row" }}>
         <GridButton
      icon="activity"
      label="Gestionar rutinas"
      subLabel="Ingresar aquí"
      backgroundColor="#FEF9C3"
      fullWidth
      onPress={() => router.push("../rutinas/misRutinas")}
    />
      </View>
    </View>
  );
};
