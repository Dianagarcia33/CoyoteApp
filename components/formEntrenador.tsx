import { Checkbox } from "@/components/Checkbox";
import { InputCustom } from "@/components/InputCustom";
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Text, View } from "react-native";

type FormEntrenadorProps = {
  especialidades: string[];
  setEspecialidades: (val: string[]) => void;
  nombre: string;
  setNombre: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  tarifa: string;
  setTarifa: (val: string) => void;
  moneda: string;
  setMoneda: (val: string) => void;
  periodoFacturacion: string;
  setPeriodoFacturacion: (val: string) => void;
  documento: any;
  setDocumento: (file: any) => void;
  isChecked: boolean;
  setIsChecked: (val: boolean) => void;
  errors: {
    nombre?: string;
    email?: string;
    password?: string;
    tarifa?: string;
    moneda?: string;
    periodoFacturacion?: string;
    documento?: string;
    especialidades?: string;
  };
  isDarkMode: boolean;
  router: any;
};

export default function FormEntrenador({
  especialidades,
  setEspecialidades,
  nombre,
  setNombre,
  email,
  setEmail,
  password,
  setPassword,
  tarifa,
  setTarifa,
  moneda,
  setMoneda,
  periodoFacturacion,
  setPeriodoFacturacion,
  documento,
  setDocumento,
  isChecked,
  setIsChecked,
  errors,
  isDarkMode,
  router,
}: FormEntrenadorProps) {
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) {
      setDocumento(result.assets[0]);
    }
  };

  return (
    <View style={{ marginTop: 5 }}>
      <SelectDropdownCustom
        value={especialidades[0] || ""}
        setValue={(val) => setEspecialidades([val])}
        options={[
          { label: "Fuerza", value: "fuerza" },
          { label: "Resistencia", value: "resistencia" },
          { label: "Movilidad", value: "movilidad" },
          { label: "Cardio", value: "cardio" },
        ]}
        placeholder="Especialidades"
        containerStyle={{ width: "100%" }}
        isDarkMode={isDarkMode}
        icon={<Feather name="briefcase" size={20} color="#374151" />}
        errorMessage={errors.especialidades}
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

      <View style={{ flexDirection: "row", gap: 10 }}>
        <InputCustom
          label="Tarifa"
          value={tarifa}
          onChangeText={setTarifa}
          placeholder="Tarifa"
          icon={
            <Feather
              name="dollar-sign"
              size={14}
              color={isDarkMode ? "#FFFFFF" : "#6B7280"}
            />
          }
          isDarkMode={isDarkMode}
          keyboardType="numeric"
          containerStyle={{ flex: 1 }}
          errorMessage={errors.tarifa}
        />

        <SelectDropdownCustom
          value={moneda}
          setValue={setMoneda}
          options={[
            { label: "COP", value: "COP" },
            { label: "USD", value: "USD" },
            { label: "EUR", value: "EUR" },
          ]}
          placeholder="Moneda"
          isDarkMode={isDarkMode}
          icon={
            <Feather
              name="dollar-sign"
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#374151"}
            />
          }
          containerStyle={{ flex: 1 }}
          errorMessage={errors.moneda}
        />
      </View>

      <SelectDropdownCustom
        value={periodoFacturacion}
        setValue={setPeriodoFacturacion}
        options={[
          { label: "Mensual", value: "mensual" },
          { label: "Trimestral", value: "trimestral" },
          { label: "Anual", value: "anual" },
        ]}
        containerStyle={{ width: "100%" }}
        placeholder="Periodo de facturación"
        isDarkMode={isDarkMode}
        icon={<Feather name="calendar" size={20} color="#374151" />}
        errorMessage={errors.periodoFacturacion}
      />

      <InputCustom
        label="Documento profesional"
        placeholder="Subir archivo"
        value={documento?.name || ""}
        onFocus={pickDocument}
        icon={
          <Feather
            name="file"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        editable={false}
        errorMessage={errors.documento}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <Checkbox checked={isChecked} onChange={setIsChecked} isDarkMode={isDarkMode} />
        <Text
          style={{
            color: isDarkMode ? "white" : "black",
            marginLeft: 8,
            fontFamily: "Poppins-Regular",
            fontSize: 14,
            flex: 1,
            flexWrap: "wrap",
          }}
        >
          Acepto los{" "}
          <Text
            onPress={() => router.push("terms")}
            style={{
              color: "#FB7747",
              textDecorationLine: "underline",
              fontFamily: "Poppins-SemiBold",
            }}
          >
            términos y condiciones
          </Text>
        </Text>
      </View>
    </View>
  );
}
