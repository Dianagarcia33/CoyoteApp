import { InputCustom } from "@/components/InputCustom";
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  nombre: string;
  setNombre: (val: string) => void;
  direccion: string;
  setDireccion: (val: string) => void;
  telefono: string;
  setTelefono: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
  horario: string;
  setHorario: (val: string) => void;
  instalaciones: string;
  setInstalaciones: (val: string) => void;
  isDarkMode: boolean;
  detectarUbicacion: () => void;
  ubicacion: { latitude: number; longitude: number } | null;
  errors: {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    descripcion?: string;
    horario?: string;
    instalaciones?: string;
  };
};

export default function FormGimnasio({
  nombre,
  setNombre,
  direccion,
  setDireccion,
  telefono,
  setTelefono,
  email,
  setEmail,
  descripcion,
  setDescripcion,
  horario,
  setHorario,
  instalaciones,
  setInstalaciones,
  isDarkMode,
  detectarUbicacion,
  ubicacion,
  errors,
}: Props) {
  return (
    <View style={{ marginTop: 5 }}>
      <InputCustom
        label="Nombre del gimnasio"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del gimnasio"
        icon={
          <Feather
            name="home"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.nombre}
        style={{ marginBottom: 10 }}
      />

      <InputCustom
        label="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        icon={
          <Feather
            name="map-pin"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.direccion}
        style={{ marginBottom: 10 }}
      />

      <InputCustom
        label="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        icon={
          <Feather
            name="phone"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.telefono}
        style={{ marginBottom: 10 }}
      />

      <InputCustom
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        icon={
          <Feather
            name="mail"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.email}
        style={{ marginBottom: 10 }}
      />

      <InputCustom
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        multiline
        numberOfLines={4}
        icon={
          <Feather
            name="info"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.descripcion}
        style={{ marginBottom: 10 }}
      />

      <SelectDropdownCustom
        value={instalaciones}
        setValue={setInstalaciones}
        options={[
          { label: "Máquinas de musculación", value: "musculacion" },
          { label: "Zona de cardio", value: "cardio" },
          { label: "Piscina", value: "piscina" },
          { label: "Sala de spinning", value: "spinning" },
          { label: "Cancha múltiple", value: "cancha" },
        ]}
        placeholder="Tipo de instalaciones"
        icon={<Feather name="grid" size={20} color="#374151" />}
        isDarkMode={isDarkMode}
      />

      <InputCustom
        label="Horario"
        value={horario}
        onChangeText={setHorario}
        placeholder="Ej. Lunes a Viernes 6:00 AM - 10:00 PM"
        icon={
          <Feather
            name="clock"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.horario}
        style={{ marginBottom: 10 }}
      />

      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="map-pin" size={16} color="#FB7747" />
          <Text
            onPress={detectarUbicacion}
            style={{
              marginLeft: 4,
              color: "#FB7747",
              fontSize: 14,
              fontFamily: "Poppins-Medium",
            }}
          >
            Detectar ubicación
          </Text>
        </View>

        {ubicacion && (
          <Text style={{ marginTop: 8, color: isDarkMode ? "#FFF" : "#000" }}>
            Ubicación: {ubicacion.latitude.toFixed(5)},{" "}
            {ubicacion.longitude.toFixed(5)}
          </Text>
        )}
      </View>
    </View>
  );
}
