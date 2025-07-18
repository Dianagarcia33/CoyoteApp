import { Checkbox } from "@/components/Checkbox";
import { InputCustom } from "@/components/InputCustom";
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type FormClienteProps = {
  objetivo: string;
  setObjetivo: (val: string) => void;
  nombre: string;
  setNombre: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isChecked: boolean;
  setIsChecked: (val: boolean) => void;
  errors: {
    nombre?: string;
    email?: string;
    password?: string;
  };
  isDarkMode: boolean;
  router: any;
};

export default function FormCliente({
  objetivo,
  setObjetivo,
  nombre,
  setNombre,
  email,
  setEmail,
  password,
  setPassword,
  isChecked,
  setIsChecked,
  errors,
  isDarkMode,
  router,
}: FormClienteProps) {
  return (
    <View style={{ marginTop: 5 }}>
      <SelectDropdownCustom
        value={objetivo}
        setValue={setObjetivo}
        options={[
          { label: "Perdida de peso", value: "perdidaPeso" },
          { label: "Aumento de masa muscular", value: "aumentoMasa" },
          { label: "Mejorar resistencia", value: "mejorarResistencia" },
          { label: "Aumentar fuerza", value: "aumentarFuerza" },
          { label: "Mejorar flexibilidad", value: "mejorarFlexibilidad" },
          { label: "Mejorar salud en general", value: "mejorarSalud" },
          { label: "Rehabilitacion", value: "rehabilitacion" },
        ]}
        placeholder="Mi objetivo"
        isDarkMode={isDarkMode}
        icon={<Feather name="user" size={20} color="#374151" />}
      />

      <InputCustom
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre completo"
        icon={
          <Feather
            name="user"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        style={{ marginBottom: 10 }}
        errorMessage={errors.nombre}
      />

      <InputCustom
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        icon={
          <Feather
            name="mail"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        keyboardType="email-address"
        style={{ marginBottom: 10 }}
        errorMessage={errors.email}
      />

      <InputCustom
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        icon={
          <Feather
            name="lock"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        secureTextEntry
        errorMessage={errors.password}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <Checkbox checked={isChecked} onChange={setIsChecked} />

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            flexWrap: "wrap",
            marginLeft: 8,
          }}
        >
          <Text
            style={{
              color: isDarkMode ? "white" : "black",
              fontFamily: "Poppins-Regular",
              fontSize: 14,
            }}
          >
            Acepto los{" "}
          </Text>
          <Text
            onPress={() => router.push("terms")}
            style={{
              color: "#FB7747",
              textDecorationLine: "underline",
              fontFamily: "Poppins-SemiBold",
              fontSize: 14,
            }}
          >
            términos y condiciones
          </Text>
        </View>
      </View>
    </View>
  );
}
