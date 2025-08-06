import { Checkbox } from "@/components/Checkbox";
import { InputCustom } from "@/components/InputCustom";
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Text, View } from "react-native";

type FormNutricionistaProps = {
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
  contactoEmergenciaNombre: string;
  setContactoEmergenciaNombre: (val: string) => void;
  contactoEmergenciaTelefono: string;
  setContactoEmergenciaTelefono: (val: string) => void;
  contactoEmergenciaRelacion: string;
  setContactoEmergenciaRelacion: (val: string) => void;
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
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    contactoEmergenciaRelacion?: string;
  };
  isDarkMode: boolean;
  router: any;
};

export default function FormNutricionista({
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
  contactoEmergenciaNombre,
  setContactoEmergenciaNombre,
  contactoEmergenciaTelefono,
  setContactoEmergenciaTelefono,
  contactoEmergenciaRelacion,
  setContactoEmergenciaRelacion,
  isChecked,
  setIsChecked,
  errors,
  isDarkMode,
  router,
}: FormNutricionistaProps) {
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
          { label: "Nutrición deportiva", value: "nutricionDeportiva" },
          { label: "Control de peso", value: "controlPeso" },
          { label: "Nutrición clínica", value: "nutricionClinica" },
          { label: "Nutrición infantil", value: "nutricionInfantil" },
          { label: "Educación alimentaria", value: "educacionAlimentaria" },
        ]}
        placeholder="Especialidades"
        isDarkMode={isDarkMode}
        icon={<Feather name="heart" size={20} color="#374151" />}
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
        errorMessage={errors.nombre}
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
      />

      <InputCustom
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        icon={
          <Feather
            name="lock"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.password}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <InputCustom
            label="Tarifa"
            value={tarifa}
            onChangeText={setTarifa}
            placeholder="Tarifa"
            keyboardType="numeric"
            icon={
              <Feather
                name="dollar-sign"
                size={14}
                color={isDarkMode ? "#FFFFFF" : "#6B7280"}
              />
            }
            isDarkMode={isDarkMode}
            errorMessage={errors.tarifa}
          />
        </View>

        <View style={{ flex: 1 }}>
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
            icon={<Feather name="dollar-sign" size={20} color="#374151" />}
            containerStyle={{ width: "100%" }}
            errorMessage={errors.moneda}
          />
        </View>
      </View>

      <SelectDropdownCustom
        value={periodoFacturacion}
        setValue={setPeriodoFacturacion}
        options={[
          { label: "Mensual", value: "mensual" },
          { label: "Trimestral", value: "trimestral" },
          { label: "Anual", value: "anual" },
        ]}
        placeholder="Periodo de facturación"
        isDarkMode={isDarkMode}
        icon={<Feather name="calendar" size={20} color="#374151" />}
        errorMessage={errors.periodoFacturacion}
      />

      <InputCustom
        label="Documento profesional"
        placeholder="Subir archivo"
        value={documento?.name || ""}
        onChangeText={pickDocument}
        icon={
          <Feather
            name="file"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        errorMessage={errors.documento}
      />

      {/* Campos de contacto de emergencia */}
      <Text
        style={{
          color: isDarkMode ? "white" : "black",
          fontFamily: "Poppins-SemiBold",
          fontSize: 16,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Contacto de emergencia
      </Text>

      <InputCustom
        label="Nombre del contacto de emergencia"
        value={contactoEmergenciaNombre}
        onChangeText={setContactoEmergenciaNombre}
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
        errorMessage={errors.contactoEmergenciaNombre}
      />

      <InputCustom
        label="Teléfono del contacto de emergencia"
        value={contactoEmergenciaTelefono}
        onChangeText={setContactoEmergenciaTelefono}
        placeholder="Número de teléfono"
        icon={
          <Feather
            name="phone"
            size={14}
            color={isDarkMode ? "#FFFFFF" : "#6B7280"}
          />
        }
        isDarkMode={isDarkMode}
        keyboardType="phone-pad"
        style={{ marginBottom: 10 }}
        errorMessage={errors.contactoEmergenciaTelefono}
      />

      {/* zIndex: 10 para evitar conflictos */}
      <View style={{ zIndex: 10, marginBottom: 10 }}>
        <SelectDropdownCustom
          value={contactoEmergenciaRelacion}
          setValue={setContactoEmergenciaRelacion}
          options={[
            { label: "Padre/Madre", value: "padre" },
            { label: "Esposo/Esposa", value: "esposo" },
            { label: "Hermano/Hermana", value: "hermano" },
            { label: "Hijo/Hija", value: "hijo" },
            { label: "Abuelo/Abuela", value: "abuelo" },
            { label: "Tío/Tía", value: "tio" },
            { label: "Primo/Prima", value: "primo" },
            { label: "Amigo/Amiga", value: "amigo" },
            { label: "Otro", value: "otro" },
          ]}
          placeholder="Relación con el contacto"
          isDarkMode={isDarkMode}
          icon={<Feather name="users" size={20} color="#374151" />}
          containerStyle={{ width: "100%" }}
          errorMessage={errors.contactoEmergenciaRelacion}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        <Checkbox checked={isChecked} onChange={setIsChecked} />
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
