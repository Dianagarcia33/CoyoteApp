import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../app/context/AuthContext";
import { useSOS } from "../hooks/useSOS";

// Iconos
import ClientesIcon from "../assets/images/clientes.png";
import FacturacionIcon from "../assets/images/facturacion.png";
import ProximaSesionIcon from "../assets/images/proxima.png";
import PuntosIcon from "../assets/images/puntos.png";
import RutinasIcon from "../assets/images/rutinas.png";
import SosIcon from "../assets/images/sos.png";

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

  // Personalización especial para cada botón según la imagen
  if (label.toLowerCase().includes("puntos")) {
    return (
      <View style={{
        backgroundColor,
        borderRadius: 16,
        width,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
      }}>
        <Image source={image} style={{ width: 40, height: 40, marginRight: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#F59E0B', marginBottom: -4 }}>500</Text>
          <Text style={{ fontSize: 18, color: '#A16207', fontWeight: '600', textTransform: 'lowercase' }}>puntos</Text>
        </View>
      </View>
    );
  }
  if (label === "Facturación") {
    return (
      <View style={{
        backgroundColor,
        borderRadius: 16,
        width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <Image source={image} style={{ width: 36, height: 36, marginBottom: 8 }} />
        <Text style={{ fontSize: 16, color: '#14532D', fontWeight: 'bold' }}>{label}</Text>
      </View>
    );
  }
  if (label === "Próxima sesión") {
    return (
      <TouchableOpacity
        style={{
          backgroundColor,
          borderRadius: 16,
          width,
          padding: 20,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={image} style={{ width: 32, height: 32, marginBottom: 8 }} />
        <Text style={{ fontSize: 18, color: '#7F1D1D', fontWeight: 'bold', marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: '#9F1239' }}>{subLabel}</Text>
      </TouchableOpacity>
    );
  }
  if (label === "SOS") {
    return (
      <TouchableOpacity
        style={{
          backgroundColor,
          borderRadius: 16,
          width,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={image} style={{ width: 36, height: 36, marginBottom: 8 }} />
        <Text style={{ fontSize: 18, color: '#991B1B', fontWeight: 'bold' }}>{label}</Text>
      </TouchableOpacity>
    );
  }
  if (label === "Clientes" || label === "Sin token") {
    return (
      <TouchableOpacity
        style={{
          backgroundColor,
          borderRadius: 16,
          width,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image source={image} style={{ width: 56, height: 56 }} />
          <Text style={{ fontSize: 20, color: '#7C3AED', fontWeight: 'bold', marginTop: 6 }}>{label}</Text>
        </View>
        <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#7C3AED', marginLeft: 8 }}>{number}</Text>
      </TouchableOpacity>
    );
  }
  if (label === "Gestionar rutinas") {
    return (
      <TouchableOpacity
        style={{
          backgroundColor,
          borderRadius: 16,
          width,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
        }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image source={image} style={{ width: 36, height: 36, marginRight: 16 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, color: '#111827', fontWeight: 'bold' }}>{label}</Text>
          <Text style={{ fontSize: 14, color: '#374151' }}>Ingresa aquí</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // fallback
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
      <View style={{ flex: 1, alignItems: isIconTop ? "center" : "flex-start" }}>
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

export const DashboardGridEntrenador = () => {
  const { user, token } = useAuth();
  const { confirmSOS } = useSOS();
  const [clientesCount, setClientesCount] = useState<number | null>(null);
  const [proximaCita, setProximaCita] = useState<any>(null);

  // Función para formatear la fecha y mostrar información adicional
  const formatearFecha = (fechaISO: string, esFutura?: boolean) => {
    try {
      const fecha = new Date(fechaISO);
      const ahora = new Date();
      
      // Log para debugging
      console.log('Formateando fecha:', {
        fechaOriginal: fechaISO,
        fechaParseada: fecha.toLocaleString('es-CO'),
        ahoraLocal: ahora.toLocaleString('es-CO'),
        diferencia: fecha.getTime() - ahora.getTime(),
        esFuturaCalculada: fecha > ahora
      });
      
      const esFuturaCalculada = esFutura !== undefined ? esFutura : fecha > ahora;
      
      const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota' // Zona horaria de Colombia
      };
      
      const fechaFormateada = fecha.toLocaleDateString('es-CO', opciones);
      
      // Agregar indicador si es futura o pasada
      const indicador = esFuturaCalculada ? '🟢' : '🔴';
      
      return `${indicador} ${fechaFormateada}`;
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return fechaISO;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setClientesCount(null);
        return;
      }
      try {
        const res = await fetch("http://192.168.18.84:8000/api/entrenador/clientes/stats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setClientesCount(data?.data?.total_clientes ?? 0);
      } catch {
        setClientesCount(0);
      }
    };
    fetchStats();
  }, [token]);

  // Obtener próximas citas
  useEffect(() => {
    const fetchProximasCitas = async () => {
      if (!token) {
        setProximaCita(null);
        return;
      }
      try {
        // Primero intentar con la API específica de próximas citas
        const res = await fetch("http://192.168.18.84:8000/api/entrenador/citas/proximas", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('🔍 API PRÓXIMAS CITAS:', JSON.stringify(data, null, 2));
        
        let citaEncontrada = null;
        
        if (data?.data) {
          // Si la API retorna un objeto de cita directamente
          if (data.data.scheduled_at) {
            citaEncontrada = data.data;
          } 
          // Si la API retorna un array de citas (tomar la primera)
          else if (Array.isArray(data.data) && data.data.length > 0) {
            citaEncontrada = data.data[0];
          }
        }
        
        // Si no encontramos cita próxima, usar la API del calendario como fallback
        if (!citaEncontrada) {
          console.log('🔄 No hay próximas citas, consultando calendario...');
          const calendarRes = await fetch("http://192.168.18.84:8000/api/entrenador/citas/calendario", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (calendarRes.ok) {
            const calendarData = await calendarRes.json();
            console.log('📅 API CALENDARIO:', JSON.stringify(calendarData, null, 2));
            
            let eventos = [];
            if (calendarData.success && calendarData.data && calendarData.data.eventos) {
              eventos = calendarData.data.eventos;
            } else if (calendarData.data && Array.isArray(calendarData.data)) {
              eventos = calendarData.data;
            }
            
            // Buscar la próxima cita futura
            const ahora = new Date();
            const citasFuturas = eventos
              .filter((evento: any) => {
                const fechaEvento = new Date(evento.start || evento.scheduled_at);
                return fechaEvento > ahora;
              })
              .sort((a: any, b: any) => {
                const fechaA = new Date(a.start || a.scheduled_at);
                const fechaB = new Date(b.start || b.scheduled_at);
                return fechaA.getTime() - fechaB.getTime();
              });
            
            if (citasFuturas.length > 0) {
              citaEncontrada = {
                ...citasFuturas[0],
                scheduled_at: citasFuturas[0].start || citasFuturas[0].scheduled_at
              };
              console.log('✅ Próxima cita encontrada en calendario:', citaEncontrada);
            }
          }
        }
        
        if (citaEncontrada) {
          console.log('📋 CITA SELECCIONADA:', {
            fecha: citaEncontrada.scheduled_at,
            fechaLocal: new Date(citaEncontrada.scheduled_at).toLocaleString('es-CO'),
            ahora: new Date().toLocaleString('es-CO'),
            esFutura: new Date(citaEncontrada.scheduled_at) > new Date(),
            diferenciaMins: Math.round((new Date(citaEncontrada.scheduled_at).getTime() - new Date().getTime()) / (1000 * 60))
          });
          setProximaCita(citaEncontrada);
        } else {
          console.log('❌ No se encontraron citas futuras');
          setProximaCita(null);
        }
        
      } catch (error) {
        console.error('Error fetching próximas citas:', error);
        setProximaCita(null);
      }
    };
    fetchProximasCitas();
  }, [token]);

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      {/* Fila 1: Puntos (3) + Facturación (2) */}
      <View style={{ flexDirection: "row", gap: GAP, marginBottom: GAP }}>
        <GridButton
          image={PuntosIcon}
          label="500 puntos"
          backgroundColor="#FEF9C3"
          columns={3}
        />
        <GridButton
          image={FacturacionIcon}
          label="Facturación"
          backgroundColor="#BBF7D0"
          columns={2}
        />
      </View>

      {/* Fila 2: Próxima sesión (5) */}
      <View style={{ flexDirection: "row", marginBottom: GAP }}>
        <GridButton
          image={ProximaSesionIcon}
          label="Próxima sesión"
          subLabel={proximaCita?.scheduled_at ? 
            formatearFecha(proximaCita.scheduled_at, proximaCita.is_future) : 
            "Sin próximas citas"}
          backgroundColor="#FFE4E6"
          columns={5}
          onPress={() => router.push("/calendar")}
        />
      </View>

      {/* Fila 3: SOS (2) + Clientes (3) */}
      <View style={{ flexDirection: "row", gap: GAP, marginBottom: GAP }}>
        <GridButton
          image={SosIcon}
          label="SOS"
          backgroundColor="#FECACA"
          columns={2}
          onPress={confirmSOS}
        />
        <GridButton
          image={ClientesIcon}
          label={token ? "Clientes" : "Sin token"}
          number={clientesCount !== null ? String(clientesCount) : "-"}
          backgroundColor="#DDD6FE"
          columns={3}
          onPress={() => router.push("/(tabs)/clients")}
        />
      </View>

      {/* Fila 4: Gestionar rutinas (5) */}
      <View style={{ flexDirection: "row" }}>
        <GridButton
          image={RutinasIcon}
          label="Gestionar rutinas"
          backgroundColor="#D4D4D4"
          columns={5}
          onPress={() => router.push("../rutinas/misRutinas")}
        />
      </View>
    </View>
  );
};
