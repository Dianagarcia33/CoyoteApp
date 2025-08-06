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
}: FormEntrenadorProps) {
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) {
      setDocumento(result.assets[0]);
    }
  };

  return (
    <View style={{ marginTop: 5 }}>
      {/* zIndex: 40 */}
      <View style={{ zIndex: 40 }}>
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
      </View>

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
        style={{ marginBottom: 10 }}
        secureTextEntry
        errorMessage={errors.password}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        {/* Input tarifa con zIndex más bajo */}
        <View style={{ flex: 1, zIndex: 10 }}>
          <InputCustom
            label="Tarifa"
            value={tarifa}
            onChangeText={setTarifa}
            placeholder="Tarifa"
            icon={
              <Feather
                name="dollar-sign"
                size={20}
                color={isDarkMode ? "#FFFFFF" : "#6B7280"}
              />
            }
            isDarkMode={isDarkMode}
            keyboardType="numeric"  
            errorMessage={errors.tarifa}
          />
        </View>

        {/* Selector moneda con zIndex más alto */}
        <View style={{ flex: 1, zIndex: 50 }}>
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
      </View>

      {/* zIndex: 30 para evitar conflictos */}
      <View style={{ zIndex: 30 }}>
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
      </View>

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
