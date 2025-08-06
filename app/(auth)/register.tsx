import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from "react-native";

import { ButtonCustom } from "@/components/ButtonCustom";
import FormCliente from "@/components/formCliente";
import FormEntrenador from "@/components/formEntrenador";
import FormNutricionista from "@/components/FormNutricionista";
import FormGimnasio from "@/components/GymForm";
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const [tipo, setTipo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // Estados para contacto de emergencia
  const [contactoEmergenciaNombre, setContactoEmergenciaNombre] = useState("");
  const [contactoEmergenciaTelefono, setContactoEmergenciaTelefono] = useState("");
  const [contactoEmergenciaRelacion, setContactoEmergenciaRelacion] = useState("");

  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [tarifa, setTarifa] = useState("");
  const [moneda, setMoneda] = useState("COP");
  const [periodoFacturacion, setPeriodoFacturacion] = useState("mensual");
  const [documento, setDocumento] = useState<File | null>(null);

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [horario, setHorario] = useState("");
  const [instalaciones, setInstalaciones] = useState("");
  const [ubicacion, setUbicacion] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // función para detectar ubicación
  const detectarUbicacion = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setUbicacion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    nombre?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    contactoEmergenciaRelacion?: string;
  }>({});

  const handleLogin = async () => {
    const newErrors: typeof errors = {};

    router.replace("/home");
  };

  const handleRegister = async () => {
  setIsLoading(true);
  
  const payload: any = {
    role: tipo, // importante: Laravel espera "role"
    name: nombre,
    email,
    password,
    contacto_emergencia_nombre: contactoEmergenciaNombre,
    contacto_emergencia_telefono: contactoEmergenciaTelefono,
    contacto_emergencia_relacion: contactoEmergenciaRelacion,
  };
 
  if (tipo === "cliente") {
    payload.objetivo = objetivo;
  }
 
  if (tipo === "entrenador" || tipo === "nutricionista") {
    payload.especialidades = especialidades;
    payload.tarifa = tarifa;
    payload.moneda = moneda;
    payload.periodo_facturacion = periodoFacturacion; 
  }

  // Gimnasio
  if (tipo === "gimnasio") {
    payload.telefono = telefono;
    payload.direccion = direccion;
    payload.descripcion = descripcion;
    payload.horario = horario;
    payload.instalaciones = instalaciones;
    if (ubicacion) {
      payload.ubicacion = {
        latitude: ubicacion.latitude,
        longitude: ubicacion.longitude,
      };
    }
  }

  try {
    const response = await fetch("http://192.168.18.84:8000/api/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Error", "Revisa los campos obligatorios.");
    } else {
      Alert.alert("Registro exitoso", `Bienvenida, ${data.user.name}`);
      router.replace("/home");
    }
  } catch {
    Alert.alert("Error", "No se pudo conectar con el servidor.");
  } finally {
    setIsLoading(false);
  }
};


  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#0b111e" : "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: 30,
            paddingTop: 80,
            paddingBottom: keyboardVisible ? 20 : 40,
          }}
        >
          {/* Contenido arriba */}
          <View>
            <Text
              style={{
                color: isDarkMode ? "white" : "black",
                fontFamily: "Poppins-Bold",
                marginBottom: 20,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Crear una cuenta
            </Text>

            <View style={{ width: "100%" }}>
              <View style={{ zIndex: 3000 }}>
                <SelectDropdownCustom
                  value={tipo}
                  setValue={setTipo}
                  containerStyle={{ width: "100%" }}
                  options={[
                    { label: "Cliente", value: "cliente" },
                    { label: "Entrenador", value: "entrenador" },
                    { label: "Nutricionista", value: "nutricionista" },
                    { label: "Gimnasio", value: "gimnasio" },
                  ]}
                  isDarkMode={isDarkMode}
                  errorMessage={tipo === "" ? "Campo requerido" : undefined}
                />
              </View>

              {tipo === "cliente" && (
                <FormCliente
                  objetivo={objetivo}
                  setObjetivo={setObjetivo}
                  nombre={nombre}
                  setNombre={setNombre}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  contactoEmergenciaNombre={contactoEmergenciaNombre}
                  setContactoEmergenciaNombre={setContactoEmergenciaNombre}
                  contactoEmergenciaTelefono={contactoEmergenciaTelefono}
                  setContactoEmergenciaTelefono={setContactoEmergenciaTelefono}
                  contactoEmergenciaRelacion={contactoEmergenciaRelacion}
                  setContactoEmergenciaRelacion={setContactoEmergenciaRelacion}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  errors={errors}
                  isDarkMode={isDarkMode}
                  router={router}
                />
              )}

              {tipo === "entrenador" && (
                <View  >
                  <FormEntrenador
                    especialidades={especialidades}
                    setEspecialidades={setEspecialidades}
                    nombre={nombre}
                    setNombre={setNombre}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    tarifa={tarifa}
                    setTarifa={setTarifa}
                    moneda={moneda}
                    setMoneda={setMoneda}
                    periodoFacturacion={periodoFacturacion}
                    setPeriodoFacturacion={setPeriodoFacturacion}
                    documento={documento}
                    setDocumento={setDocumento}
                    contactoEmergenciaNombre={contactoEmergenciaNombre}
                    setContactoEmergenciaNombre={setContactoEmergenciaNombre}
                    contactoEmergenciaTelefono={contactoEmergenciaTelefono}
                    setContactoEmergenciaTelefono={setContactoEmergenciaTelefono}
                    contactoEmergenciaRelacion={contactoEmergenciaRelacion}
                    setContactoEmergenciaRelacion={setContactoEmergenciaRelacion}
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
                    errors={errors}
                    isDarkMode={isDarkMode}
                    router={router}
                  />
                </View>
              )}

              {tipo === "nutricionista" && (
                <View  >
                  <FormNutricionista
                    especialidades={especialidades}
                    setEspecialidades={setEspecialidades}
                    nombre={nombre}
                    setNombre={setNombre}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    tarifa={tarifa}
                    setTarifa={setTarifa}
                    moneda={moneda}
                    setMoneda={setMoneda}
                    periodoFacturacion={periodoFacturacion}
                    setPeriodoFacturacion={setPeriodoFacturacion}
                    documento={documento}
                    setDocumento={setDocumento}
                    contactoEmergenciaNombre={contactoEmergenciaNombre}
                    setContactoEmergenciaNombre={setContactoEmergenciaNombre}
                    contactoEmergenciaTelefono={contactoEmergenciaTelefono}
                    setContactoEmergenciaTelefono={setContactoEmergenciaTelefono}
                    contactoEmergenciaRelacion={contactoEmergenciaRelacion}
                    setContactoEmergenciaRelacion={setContactoEmergenciaRelacion}
                    isChecked={isChecked}
                    setIsChecked={setIsChecked}
                    errors={errors}
                    isDarkMode={isDarkMode}
                    router={router}
                  />
                </View>
              )}

              {tipo === "gimnasio" && (
                <View  >
                  <FormGimnasio
                    nombre={nombre}
                    setNombre={setNombre}
                    direccion={direccion}
                    setDireccion={setDireccion}
                    telefono={telefono}
                    setTelefono={setTelefono}
                    email={email}
                    setEmail={setEmail}
                    descripcion={descripcion}
                    setDescripcion={setDescripcion}
                    horario={horario}
                    setHorario={setHorario}
                    instalaciones={instalaciones}
                    setInstalaciones={setInstalaciones}
                    isDarkMode={isDarkMode}
                    detectarUbicacion={detectarUbicacion}
                    ubicacion={ubicacion}
                    errors={{}} // puedes pasar errores según validación
                  />
                </View>
              )}
            </View>
          </View>
 
          <View style={{ alignItems: "center" }}>
            <ButtonCustom
              text={isLoading ? "Cargando..." : "Registrar"}
              icon={
                isLoading ? null : (
                  <Feather name="log-in" size={20} color="white" />
                )
              }
              onPress={handleRegister}
            />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "#7B6F72",
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Ya tengo una cuenta{" "}
              </Text>
              <Text
                onPress={() => router.replace("/")} // o navega a donde necesites
                style={{
                  color: "#FB7747",
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 14,
                }}
              >
                Ingresar
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
