import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Helper function para validar y parsear JSON de forma segura
const safeJsonParse = (text: string): { success: boolean; data?: any; error?: string } => {
  try {
    // Verificar si la respuesta parece ser HTML
    const trimmedText = text.trim();
    if (trimmedText.startsWith('<') || trimmedText.includes('<!DOCTYPE') || trimmedText.includes('<html')) {
      return {
        success: false,
        error: 'Respuesta es HTML, no JSON. Posible error de servidor.'
      };
    }

    // Verificar si está vacía
    if (!trimmedText || trimmedText.length === 0) {
      return {
        success: false,
        error: 'Respuesta vacía'
      };
    }

    // Intentar parsear JSON
    const parsed = JSON.parse(trimmedText);
    return {
      success: true,
      data: parsed
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al parsear JSON'
    };
  }
};

// Helper function para debuggear respuestas problemáticas
const debugResponse = (responseText: string, context: string) => {
  console.log(`=== DEBUG ${context} ===`);
  console.log('Longitud:', responseText.length);
  console.log('Primeros 100 caracteres:', responseText.slice(0, 100));
  console.log('Últimos 100 caracteres:', responseText.slice(-100));
  console.log('Contiene HTML?:', responseText.includes('<html') || responseText.includes('<!DOCTYPE'));
  console.log('Empieza con {?:', responseText.trim().startsWith('{'));
  console.log('Empieza con [?:', responseText.trim().startsWith('['));
  console.log('=========================');
};

const LocaleConfig = {
  locales: {
    'es': {
      monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
      monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
      dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
      today: 'Hoy'
    }
  },
  defaultLocale: 'es'
};

type Cita = {
  id: number;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  type: 'individual' | 'parcheFit';
  status: 'programada' | 'completada' | 'cancelada' | 'en_progreso';
  duration: number;
  participants: { name: string; email: string }[];
  scheduled_at?: string; // Para compatibilidad
  name?: string; // Para compatibilidad
  tipo_sesion?: 'individual' | 'parcheFit'; // Para compatibilidad
  participantes?: { name: string; email: string }[];
  cliente_individual?: { name: string; email: string } | null;
};

type CitaDelDia = {
  hora: string;
  nombre: string;
  tipo: 'individual' | 'parcheFit';
};

type EventsMap = Record<string, CitaDelDia[]>;

export default function CalendarScreen() {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [showListView, setShowListView] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Función para generar horas dinámicamente basadas en las citas
  const getHorasDisponibles = (): string[] => {
    const horasSet = new Set<string>();
    
    // Agregar horas base (de 6:00 a 23:30 cada 30 minutos)
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        horasSet.add(timeString);
      }
    }
    
    // Agregar horas específicas de las citas para asegurar que todas aparezcan
    citas.forEach(cita => {
      const fechaCita = cita.start || cita.scheduled_at;
      if (fechaCita) {
        const fechaObj = new Date(fechaCita);
        const hora = fechaObj.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        horasSet.add(hora);
      }
    });
    
    // Convertir a array y ordenar
    return Array.from(horasSet).sort();
  };

  // Función para mapear tipos del backend a visualización del usuario
  const mapearTipoParaVisualizacion = (tipo: string): string => {
    // Asegurar que sea string y convertir a lowercase para comparación
    const tipoStr = String(tipo || '').trim();
    const tipoLower = tipoStr.toLowerCase();
    
    // Si es cualquier variación de grupal, mostrar parcheFit
    if (tipoLower.includes('grup') || 
        tipoLower.includes('parche') ||
        tipoLower === 'grupal' || 
        tipoLower === 'grupo' ||
        tipoLower === 'parche' || 
        tipoLower === 'parcheFit' || 
        tipoLower === 'parche fit') {
      return 'parcheFit';
    }
    
    return 'individual';
  };

  // Función para normalizar tipos del backend
  const normalizarTipo = (tipo: string): 'individual' | 'parcheFit' => {
    // Asegurar que sea string y convertir a lowercase para comparación
    const tipoStr = String(tipo || '').trim();
    const tipoLower = tipoStr.toLowerCase();
    
    // Verificar diferentes variaciones de "grupal"
    if (tipoLower === 'grupal' || 
        tipoLower === 'grupo' || 
        tipoLower === 'parche' || 
        tipoLower === 'parcheFit' || 
        tipoLower === 'parche fit' ||
        tipoLower === 'grupal' ||
        tipoLower.includes('grup') ||
        tipoLower.includes('parche')) {
      return 'parcheFit';
    }
    
    return 'individual';
  };
 
  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await fetch('http://192.168.18.84:8000/api/entrenador/citas/calendario', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Status de respuesta:', response.status);
        console.log('Content-Type:', response.headers.get('content-type'));
        
        // Obtener el texto crudo antes de intentar parsearlo como JSON
        const responseText = await response.text();
        console.log('Respuesta cruda (primeros 200 caracteres):', responseText.slice(0, 200));
        console.log('Longitud de respuesta:', responseText.length);
        
        if (!responseText || responseText.length === 0) {
          throw new Error('Respuesta vacía del servidor');
        }

        // Debug detallado si hay problema
        if (responseText.includes('Unexpected character: :')) {
          debugResponse(responseText, 'RESPUESTA PRINCIPAL CON ERROR');
        }

        // Verificar si la respuesta parece ser HTML (error de servidor)
        if (responseText.trim().startsWith('<')) {
          console.error('Respuesta parece ser HTML:', responseText.slice(0, 300));
          throw new Error('El servidor devolvió HTML en lugar de JSON. Posible error 500.');
        }

        // Verificar si la respuesta contiene caracteres sospechosos
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          console.error('Respuesta contiene HTML:', responseText.slice(0, 300));
          throw new Error('El servidor devolvió una página HTML. Verificar URL del API.');
        }
        
        let result;
        const parseResult = safeJsonParse(responseText);
        if (parseResult.success) {
          result = parseResult.data;
        } else {
          console.error('Error parsing JSON:', parseResult.error);
          console.error('Texto que causó el error:', responseText.slice(0, 500));
          throw new Error(`Error parsing JSON: ${parseResult.error}`);
        }
        
        console.log('Fecha actual del sistema:', new Date().toLocaleString('es-CO'));
        
        if (response.ok && result) {
          // Intentar diferentes estructuras de respuesta
          let eventos = [];
          let stats = null;
          
          // Estructura nueva esperada
          if (result.success && result.data && result.data.eventos) {
            eventos = result.data.eventos;
            stats = result.data.estadisticas;
          }
          // Estructura alternativa - eventos directo en data
          else if (result.data && Array.isArray(result.data)) {
            eventos = result.data;
          }
          // Estructura alternativa - eventos directo en result
          else if (Array.isArray(result)) {
            eventos = result;
          }
          // Fallback - usar API anterior
          else {
            console.log('Estructura no reconocida, intentando API anterior...');
            try {
              const fallbackResponse = await fetch('http://192.168.18.84:8000/api/entrenador/citas', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log('Status fallback:', fallbackResponse.status);
              
              if (!fallbackResponse.ok) {
                throw new Error(`Fallback API error: ${fallbackResponse.status}`);
              }
              
              const fallbackText = await fallbackResponse.text();
              console.log('Respuesta fallback cruda (primeros 200 chars):', fallbackText.slice(0, 200));
              
              if (fallbackText && fallbackText.length > 0 && !fallbackText.trim().startsWith('<')) {
                const fallbackParseResult = safeJsonParse(fallbackText);
                if (fallbackParseResult.success) {
                  console.log('Respuesta fallback parseada exitosamente');
                  eventos = fallbackParseResult.data?.data || [];
                } else {
                  console.error('Error parsing fallback JSON:', fallbackParseResult.error);
                  debugResponse(fallbackText, 'FALLBACK CON ERROR');
                  throw new Error(fallbackParseResult.error);
                }
              } else {
                throw new Error('Respuesta fallback vacía o HTML');
              }
            } catch (fallbackError) {
              console.error('Error en API fallback:', fallbackError);
              console.log('Intentando API alternativa...');
              
              // Si el fallback también falla, intentar con la API de próximas citas
              try {
                const proximasResponse = await fetch('http://192.168.18.84:8000/api/entrenador/citas/proximas', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (proximasResponse.ok) {
                  const proximasText = await proximasResponse.text();
                  console.log('Respuesta próximas citas cruda:', proximasText.slice(0, 200));
                  
                  if (proximasText && !proximasText.trim().startsWith('<')) {
                    const proximasParseResult = safeJsonParse(proximasText);
                    if (proximasParseResult.success) {
                      console.log('Respuesta de próximas citas parseada exitosamente');
                      
                      if (proximasParseResult.data?.success && proximasParseResult.data?.data && Array.isArray(proximasParseResult.data.data)) {
                        eventos = proximasParseResult.data.data;
                        console.log('Usando datos de próximas citas como eventos');
                      }
                    } else {
                      console.error('Error parsing próximas citas JSON:', proximasParseResult.error);
                    }
                  }
                }
              } catch (proximasError) {
                console.error('Error en API de próximas citas:', proximasError);
                // Si todo falla, usar datos vacíos
                eventos = [];
              }
            }
          }
          
          console.log('Total de eventos encontrados:', eventos.length);
          
          // Procesar eventos para compatibilidad
          const eventosFormateados = eventos.map((evento: any) => {
            // Normalizar el tipo primero
            const tipoOriginal = evento.type || evento.tipo_sesion || 'individual';
            const tipoNormalizado = normalizarTipo(tipoOriginal);
            
            const eventoFormateado = {
              id: evento.id,
              title: evento.title || evento.name || 'Cita',
              start: evento.start || evento.scheduled_at,
              end: evento.end || evento.scheduled_at,
              backgroundColor: evento.backgroundColor || (tipoNormalizado === 'parcheFit' ? '#FF6A3D' : '#7C3AED'),
              borderColor: evento.borderColor || (tipoNormalizado === 'parcheFit' ? '#FF6A3D' : '#7C3AED'),
              textColor: evento.textColor || '#fff',
              type: tipoNormalizado,
              status: evento.status || 'programada',
              duration: evento.duration || evento.duration_minutes || 60,
              participants: evento.participants || evento.participantes || [],
              // Mantener compatibilidad
              scheduled_at: evento.start || evento.scheduled_at,
              name: evento.title || evento.name,
              tipo_sesion: tipoNormalizado,
              participantes: evento.participants || evento.participantes || [],
              cliente_individual: evento.cliente_individual || 
                (evento.type === 'individual' && evento.participants && evento.participants.length > 0 
                  ? evento.participants[0] 
                  : null)
            };
            
            return eventoFormateado;
          });
          
          console.log('Total de eventos formateados:', eventosFormateados.length);
          
          // Si no hay eventos, agregar datos de prueba temporalmente
          if (eventosFormateados.length === 0) {
            console.log('No hay eventos de la API, agregando datos de prueba...');
            const citasPruebaRaw = [
              {
                id: 1,
                title: 'Sesión con Juan Pérez',
                start: '2025-08-03T08:00:00.000000Z',
                end: '2025-08-03T09:00:00.000000Z',
                backgroundColor: '#7C3AED',
                borderColor: '#7C3AED',
                textColor: '#fff',
                type: 'individual',
                status: 'programada',
                duration: 60,
                participants: [],
                scheduled_at: '2025-08-03T08:00:00.000000Z',
                name: 'Sesión con Juan Pérez',
                tipo_sesion: 'individual',
                participantes: [],
                cliente_individual: { name: 'Juan Pérez', email: 'juan@test.com' }
              },
              {
                id: 2,
                title: 'Entrenamiento de Tarde - Juan Entrenador',
                start: '2025-08-03T22:00:00.000000Z',
                end: '2025-08-03T23:00:00.000000Z',
                backgroundColor: '#FF6A3D',
                borderColor: '#FF6A3D',
                textColor: '#fff',
                type: 'parcheFit',
                status: 'programada',
                duration: 45,
                participants: [],
                scheduled_at: '2025-08-03T22:00:00.000000Z',
                name: 'Entrenamiento de Tarde - Juan Entrenador',
                tipo_sesion: 'parcheFit',
                participantes: [],
                cliente_individual: null
              },
              {
                id: 3,
                title: 'Sesión con Ana Martínez',
                start: '2025-08-04T14:00:00.000000Z',
                end: '2025-08-04T15:00:00.000000Z',
                backgroundColor: '#7C3AED',
                borderColor: '#7C3AED',
                textColor: '#fff',
                type: 'individual',
                status: 'completada',
                duration: 60,
                participants: [],
                scheduled_at: '2025-08-04T14:00:00.000000Z',
                name: 'Sesión con Ana Martínez',
                tipo_sesion: 'individual',
                participantes: [],
                cliente_individual: { name: 'Ana Martínez', email: 'ana@test.com' }
              },
              {
                id: 4,
                title: 'Clase Grupal de Crossfit',
                start: '2025-08-05T10:00:00.000000Z',
                end: '2025-08-05T11:00:00.000000Z',
                backgroundColor: '#FF6A3D',
                borderColor: '#FF6A3D',
                textColor: '#fff',
                type: 'grupal', // Simulando lo que vendría del backend
                status: 'programada',
                duration: 60,
                participants: [],
                scheduled_at: '2025-08-05T10:00:00.000000Z',
                name: 'Clase Grupal de Crossfit',
                tipo_sesion: 'grupal', // Simulando lo que vendría del backend
                participantes: [],
                cliente_individual: null
              }
            ];
            
            // Procesar datos de prueba a través de la misma lógica
            const citasPrueba = citasPruebaRaw.map((evento: any) => {
              const tipoOriginal = evento.type || evento.tipo_sesion || 'individual';
              const tipoNormalizado = normalizarTipo(tipoOriginal);
              
              return {
                ...evento,
                type: tipoNormalizado,
                tipo_sesion: tipoNormalizado
              };
            });
            
            setCitas(citasPrueba);
          } else {
            setCitas(eventosFormateados);
          }
          setEstadisticas(stats);
        } else {
          console.error('Error en la respuesta del calendario:', result);
          setCitas([]);
          setEstadisticas(null);
        }
      } catch (error) {
        console.error('Error al obtener datos del calendario:', error);
        
        // Intentar con la API alternativa como fallback
        try {
          console.log('Intentando API alternativa...');
          const fallbackResponse = await fetch('http://192.168.18.84:8000/api/entrenador/citas', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const fallbackText = await fallbackResponse.text();
          console.log('Fallback response (primeros 200 chars):', fallbackText.slice(0, 200));
          
          if (fallbackText && fallbackText.length > 0 && !fallbackText.trim().startsWith('<')) {
            const fallbackMainParseResult = safeJsonParse(fallbackText);
            if (fallbackMainParseResult.success) {
              const eventos = fallbackMainParseResult.data?.data || [];
              const eventosFormateados = eventos.map((evento: any) => {
                // Normalizar el tipo primero
                const tipoOriginal = evento.type || evento.tipo_sesion || 'individual';
                const tipoNormalizado = normalizarTipo(tipoOriginal);
                
                return {
                  id: evento.id,
                  title: evento.title || evento.name || 'Cita',
                  start: evento.start || evento.scheduled_at,
                  end: evento.end || evento.scheduled_at,
                  backgroundColor: evento.backgroundColor || (tipoNormalizado === 'parcheFit' ? '#FF6A3D' : '#7C3AED'),
                  borderColor: evento.borderColor || (tipoNormalizado === 'parcheFit' ? '#FF6A3D' : '#7C3AED'),
                  textColor: evento.textColor || '#fff',
                  type: tipoNormalizado,
                  status: evento.status || 'programada',
                  duration: evento.duration || 60,
                  participants: evento.participants || evento.participantes || [],
                  scheduled_at: evento.start || evento.scheduled_at,
                  name: evento.title || evento.name,
                  tipo_sesion: tipoNormalizado,
                  participantes: evento.participants || evento.participantes || [],
                  cliente_individual: tipoNormalizado === 'individual' && evento.participants && evento.participants.length > 0 
                    ? evento.participants[0] 
                    : evento.cliente_individual
                };
              });
              
              setCitas(eventosFormateados);
              setEstadisticas(null);
            } else {
              console.error('Error parsing fallback JSON:', fallbackMainParseResult.error);
              console.error('Fallback text que causó error:', fallbackText.slice(0, 500));
              setCitas([]);
              setEstadisticas(null);
            }
          } else {
            console.error('Fallback response vacía o HTML');
            setCitas([]);
            setEstadisticas(null);
          }
        } catch (fallbackError) {
          console.error('Error en API fallback:', fallbackError);
          setCitas([]);
          setEstadisticas(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [token]);

  // Obtener días de la semana actual
  const getWeekDays = () => {
    const days = [];
    const currentDate = new Date(selectedDate);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Domingo
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayDateString = day.toISOString().slice(0, 10);
      
      // Verificar si este día tiene citas
      const hasCitas = citas.some(cita => {
        const fechaCita = cita.start || cita.scheduled_at;
        if (!fechaCita) return false;
        const fechaFormateada = new Date(fechaCita).toISOString().slice(0, 10);
        return fechaFormateada === dayDateString;
      });
      
      days.push({
        date: dayDateString,
        day: day.getDate(),
        weekDay: day.toLocaleDateString('es-ES', { weekday: 'short' }),
        isSelected: dayDateString === selectedDate,
        hasCitas: hasCitas
      });
    }
    return days;
  };

  // Obtener citas del día seleccionado mapeadas por hora
  const getCitasDelDia = (): EventsMap => {
    const map: EventsMap = {};
    
    const citasFiltradas = citas.filter(cita => {
      // Usar el campo 'start' de la nueva API o 'scheduled_at' como fallback
      const fechaCita = cita.start || cita.scheduled_at;
      if (!fechaCita) return false;
      const fechaFormateada = new Date(fechaCita).toISOString().slice(0, 10);
      return fechaFormateada === selectedDate;
    });
    
    citasFiltradas.forEach(cita => {
      const fechaCita = cita.start || cita.scheduled_at;
      if (!fechaCita) return;
      
      const fechaObj = new Date(fechaCita);
      const hora = fechaObj.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      
      let nombre = '';
      const tipoOriginal = cita.type || cita.tipo_sesion || 'individual';
      const tipo = normalizarTipo(tipoOriginal);
      
      if (tipo === 'individual') {
        if (cita.cliente_individual && cita.cliente_individual.name) {
          nombre = cita.cliente_individual.name;
        } else if (cita.participants && cita.participants.length > 0) {
          nombre = cita.participants[0].name;
        } else {
          nombre = cita.title || cita.name || 'Cliente individual';
        }
      } else if (tipo === 'parcheFit') {
        nombre = cita.title || cita.name || 'Parche fit';
      } else {
        nombre = cita.title || cita.name || 'Sin nombre';
      }

      if (!map[hora]) map[hora] = [];
      map[hora].push({
        hora,
        nombre,
        tipo: tipo as 'individual' | 'parcheFit'
      });
    });
    
    return map;
  };

  // Obtener todas las citas ordenadas por fecha
  const getCitasOrdenadas = useCallback(() => {
    const citasConFecha = citas.filter(cita => cita.start || cita.scheduled_at);
    
    return citasConFecha
      .sort((a, b) => {
        const fechaA = new Date(a.start || a.scheduled_at!);
        const fechaB = new Date(b.start || b.scheduled_at!);
        return fechaA.getTime() - fechaB.getTime();
      })
      .map(cita => {
        const fechaCita = cita.start || cita.scheduled_at!;
        const fechaObj = new Date(fechaCita);
        const tipoOriginal = cita.type || cita.tipo_sesion || 'individual';
        const tipo = normalizarTipo(tipoOriginal);
        
        let nombre = '';
        if (tipo === 'individual') {
          if (cita.cliente_individual && cita.cliente_individual.name) {
            nombre = cita.cliente_individual.name;
          } else if (cita.participants && cita.participants.length > 0) {
            nombre = cita.participants[0].name;
          } else {
            nombre = cita.title || cita.name || 'Cliente individual';
          }
        } else if (tipo === 'parcheFit') {
          nombre = cita.title || cita.name || 'Parche fit';
        } else {
          nombre = cita.title || cita.name || 'Sin nombre';
        }

        const citaFormateada = {
          ...cita,
          fechaFormateada: fechaObj.toLocaleDateString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          horaFormateada: fechaObj.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          nombre,
          tipo: tipo as 'individual' | 'parcheFit',
          mesAno: `${LocaleConfig.locales['es'].monthNames[fechaObj.getMonth()]} ${fechaObj.getFullYear()}`
        };
        
        return citaFormateada;
      });
  }, [citas]);

  // Handler para cambiar vista con feedback
  const toggleView = () => {
    setShowListView(!showListView);
    // Agregar pequeño feedback háptico si está disponible
    // HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light);
  };

  // Scroll automático al mes actual cuando se abre la vista de lista
  useEffect(() => {
    if (showListView && scrollViewRef.current) {
      // Scroll al inicio cuando se cambia a vista de lista
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true
        });
      }, 100);
    }
  }, [showListView]);

  const weekDays = getWeekDays();
  const eventosDelDia = getCitasDelDia();
  const horasDisponibles = getHorasDisponibles();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === "ios" ? 50 : 35 }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingTop: 15, 
        paddingBottom: 16 
      }}>
        <View style={{ width: 40 }} />
        <Text style={{ 
          fontWeight: 'bold', 
          fontSize: 22, 
          color: '#222', 
          textAlign: 'center'
        }}>
          Calendario
        </Text>
        <TouchableOpacity
          onPress={toggleView}
          style={{
            padding: 10,
            backgroundColor: showListView ? '#FF6A3D' : '#F7F8F8',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 44,
            height: 44,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <MaterialIcons 
            name={showListView ? "calendar-today" : "view-list"} 
            size={22} 
            color={showListView ? '#fff' : '#666'} 
          />
        </TouchableOpacity>
      </View>

      {/* Indicador de vista actual - solo mostrar cuando hay citas */}
      {!loading && citas.length > 0 && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 12,
          paddingHorizontal: 16
        }}>
          <Text style={{ 
            fontSize: 14, 
            color: '#666',
            textAlign: 'center'
          }}>
            {showListView ? '📋 Vista de lista - Todas las citas' : '📅 Vista semanal - Citas por día'}
          </Text>
        </View>
      )}

      {/* Mes actual y estadísticas - solo mostrar en vista calendario */}
      {!showListView && (
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 16,
          paddingHorizontal: 16
        }}>
          <Text style={{ 
            fontWeight: '600', 
            fontSize: 16, 
            color: '#222' 
          }}>
            {(() => {
              const d = new Date(selectedDate);
              return `${LocaleConfig.locales['es'].monthNames[d.getMonth()]} ${d.getFullYear()}`;
            })()}
          </Text>
          {estadisticas && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', marginRight: 16 }}>
                <Text style={{ fontSize: 12, color: '#666' }}>Total Citas</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>
                  {estadisticas.total_citas}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#666' }}>Participantes</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>
                  {estadisticas.total_participantes}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Selector de días de la semana - solo mostrar en vista calendario */}
      {!showListView && (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          {/* Días de la semana */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 70 }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.date}
              onPress={() => setSelectedDate(day.date)}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: day.isSelected ? '#FF6A3D' : '#F7F8F8',
                borderRadius: 16,
                width: 50,
                height: 60,
                paddingVertical: 8,
                position: 'relative'
              }}
            >
              <Text style={{ 
                color: day.isSelected ? '#fff' : '#bdbdbd', 
                fontWeight: '600', 
                fontSize: 12,
                marginBottom: 4
              }}>
                {day.weekDay.charAt(0).toUpperCase() + day.weekDay.slice(1)}
              </Text>
              <Text style={{ 
                color: day.isSelected ? '#fff' : '#222', 
                fontWeight: 'bold', 
                fontSize: 18
              }}>
                {day.day}
              </Text>
              {/* Indicador de citas */}
              {day.hasCitas && !day.isSelected && (
                <View style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#FF6A3D'
                }} />
              )}
            </TouchableOpacity>
          ))}
          </ScrollView>
        </View>
      )}

      {/* Vista de lista de citas */}
      {showListView ? (
        <View style={{ flex: 1, marginTop: 16 }}>
          <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1 }} 
            contentContainerStyle={{ 
              paddingBottom: 80,
              paddingHorizontal: 16
            }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <MaterialIcons name="schedule" size={48} color="#E5E5E5" />
                <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 12 }}>Cargando citas...</Text>
              </View>
            ) : getCitasOrdenadas().length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <MaterialIcons name="event-note" size={48} color="#E5E5E5" />
                <Text style={{ color: '#6B7280', fontSize: 16, marginTop: 12 }}>No hay citas programadas</Text>
                <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4, textAlign: 'center', paddingHorizontal: 32 }}>
                  Las citas aparecerán aquí cuando las programes
                </Text>
              </View>
            ) : (
              getCitasOrdenadas().map((cita, index) => {
                const getAvatarUri = (nombre: string) => {
                  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=FF6A3D&color=ffffff&size=80`;
                };

                return (
                  <View 
                    key={`${cita.id}-${index}`} 
                    style={{
                      backgroundColor: '#FFF7ED',
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                      borderWidth: 1,
                      borderColor: '#FED7AA'
                    }}
                  >
                    {/* Avatar del cliente */}
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: '#F3F4F6',
                      marginRight: 12,
                      overflow: 'hidden'
                    }}>
                      <Image 
                        source={{ uri: getAvatarUri(cita.nombre) }}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24
                        }}
                      />
                    </View>

                    {/* Información de la cita */}
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#1F2937',
                        marginBottom: 4
                      }}>
                        {cita.nombre}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: '#6B7280'
                      }}>
                        {(() => {
                          const fechaObj = new Date(cita.start || cita.scheduled_at!);
                          const diaSemana = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });
                          const dia = fechaObj.getDate().toString().padStart(2, '0');
                          const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
                          const hora = fechaObj.toLocaleTimeString('es-ES', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          }).toLowerCase();
                          return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia}.${mes}, ${hora}`;
                        })()}
                      </Text>
                    </View>

                    {/* Badge del tipo de sesión */}
                    <View style={{
                      backgroundColor: cita.tipo === 'parcheFit' ? '#FF6A3D' : '#7C3AED',
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginLeft: 8
                    }}>
                      <Text style={{
                        color: '#FFFFFF',
                        fontSize: 10,
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {cita.tipo === 'parcheFit' ? 'PARCHEFIT' : 'INDIVIDUAL'}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      ) : (
        /* Horas y eventos - vista calendario */
        <ScrollView style={{ flex: 1, marginTop: 16 }} contentContainerStyle={{ paddingBottom: 80 }}>
          {loading ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <MaterialIcons name="schedule" size={48} color="#E5E5E5" />
              <Text style={{ color: '#bdbdbd', fontSize: 16, marginTop: 12 }}>Cargando citas...</Text>
            </View>
          ) : horasDisponibles.length === 0 || Object.keys(eventosDelDia).length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40, paddingHorizontal: 32 }}>
              <MaterialIcons name="event-available" size={48} color="#E5E5E5" />
              <Text style={{ color: '#bdbdbd', fontSize: 16, marginTop: 12, textAlign: 'center' }}>
                No hay citas para este día
              </Text>
              <Text style={{ color: '#bdbdbd', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
                Selecciona otro día o usa el botón 📋 para ver todas las citas
              </Text>
            </View>
          ) : (
            horasDisponibles.map((hour: string, idx: number) => {
              const eventosHora = eventosDelDia[hour] || [];
              return (
                <View key={hour} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 24, minHeight: 38 }}>
                  <View style={{ width: 70, justifyContent: 'center', alignItems: 'flex-start', minHeight: 38 }}>
                    <Text style={{ color: '#bdbdbd', fontSize: 13 }}>{hour}</Text>
                  </View>
                  <View style={{ 
                    flex: 1, 
                    borderBottomWidth: idx < horasDisponibles.length-1 ? 1 : 0, 
                    borderBottomColor: '#F2F2F2', 
                    minHeight: 38, 
                    justifyContent: 'center',
                    paddingVertical: 4
                  }}>
                    {eventosHora.map((evento, i) => {
                      // Buscar la cita original para obtener los colores de la API
                      const citaOriginal = citas.find(cita => {
                        const fechaCita = cita.start || cita.scheduled_at;
                        if (!fechaCita) return false;
                        const horaOriginal = new Date(fechaCita).toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        });
                        return horaOriginal === evento.hora;
                      });

                      // Usar colores de la API o colores por defecto
                      const backgroundColor = citaOriginal?.backgroundColor || 
                        (evento.tipo === 'parcheFit' ? '#FF6A3D' : '#7C3AED');
                      const borderColor = citaOriginal?.borderColor || backgroundColor;
                      const textColor = citaOriginal?.textColor || '#fff';

                      return (
                        <View key={i} style={{
                          backgroundColor: citaOriginal?.status === 'completada' ? '#10b981' : '#fff',
                          borderWidth: 1.5,
                          borderColor: borderColor,
                          borderRadius: 12,
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          minWidth: 110,
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          marginBottom: i < eventosHora.length - 1 ? 4 : 0,
                        }}>
                          <Text style={{ 
                            color: citaOriginal?.status === 'completada' ? textColor : borderColor, 
                            fontWeight: '500', 
                            fontSize: 13 
                          }}>
                            {evento.nombre}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                            <Text style={{ 
                              color: citaOriginal?.status === 'completada' ? textColor : '#666', 
                              fontSize: 10, 
                              textTransform: 'capitalize'
                            }}>
                              {mapearTipoParaVisualizacion(evento.tipo)}
                            </Text>
                            {citaOriginal?.status && (
                              <Text style={{ 
                                color: citaOriginal?.status === 'completada' ? textColor : '#666', 
                                fontSize: 10,
                                marginLeft: 4,
                                textTransform: 'capitalize'
                              }}>
                                • {citaOriginal.status}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}
