import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface MedidaCorporal {
  id: number;
  fecha_medicion: string;
  peso: number;
  altura: number;
  imc: number;
  interpretacion_imc: string;
  porcentaje_grasa?: number;
  masa_muscular?: number;
  tipo_medicion: string;
  notas?: string;
}

interface MarcaPersonal {
  id: number;
  ejercicio: {
    name: string;
    muscle_group: string;
  };
  tipo_marca: string;
  valor_principal: number;
  fecha_marca: string;
  es_record_personal: boolean;
  validada: boolean;
}

interface ClienteProgreso {
  cliente?: {
    tiempo_entrenando: string;
  };
  medidas_recientes?: {
    ultima_medicion: string;
    peso_actual: number;
    imc_actual: number;
    progreso_peso: number;
    progreso_grasa?: number;
    progreso_musculo?: number;
  };
  marcas_recientes?: {
    total_marcas: number;
    marcas_este_mes: number;
    ultima_marca?: {
      ejercicio: string;
      valor: number;
      fecha: string;
      es_record: boolean;
    };
  };
}

export default function PerfilClienteScreen() {
  const { name, avatar, objetivo, id } = useLocalSearchParams<{ 
    name?: string; 
    avatar?: string; 
    email?: string;
    total_rutinas?: string;
    objetivo?: string;
    id?: string;
  }>();

  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progreso, setProgreso] = useState<ClienteProgreso>({});
  const [ultimaMedida, setUltimaMedida] = useState<MedidaCorporal | null>(null);
  const [marcasRecientes, setMarcasRecientes] = useState<MarcaPersonal[]>([]);

  // Función para obtener datos del cliente desde la API
  const obtenerDatosCliente = useCallback(async () => {
    if (!token || !id) {
      setLoading(false);
      return;
    }

    try {
      // Obtener dashboard completo del cliente
      const dashboardRes = await fetch(`http://192.168.18.84:8000/api/entrenador/clientes/${id}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        console.log('📊 Dashboard del cliente:', dashboardData);
        
        if (dashboardData.success) {
          setProgreso(dashboardData.data);
        }
      }

      // Obtener última medida corporal
      const medidasRes = await fetch(`http://192.168.18.84:8000/api/entrenador/clientes/${id}/medidas?per_page=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (medidasRes.ok) {
        const medidasData = await medidasRes.json();
        console.log('📏 Medidas del cliente:', medidasData);
        
        if (medidasData.success && medidasData.data?.data?.length > 0) {
          setUltimaMedida(medidasData.data.data[0]);
        }
      }

      // Obtener marcas recientes
      const marcasRes = await fetch(`http://192.168.18.84:8000/api/entrenador/clientes/${id}/marcas?per_page=3`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (marcasRes.ok) {
        const marcasData = await marcasRes.json();
        console.log('🏆 Marcas del cliente:', marcasData);
        
        if (marcasData.success && marcasData.data?.data) {
          setMarcasRecientes(marcasData.data.data);
        }
      }

    } catch (error) {
      console.error('❌ Error obteniendo datos del cliente:', error);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    obtenerDatosCliente();
  }, [obtenerDatosCliente]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A3D" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Perfil */}
          <View style={styles.profileSection}>
            {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{name || 'Cliente'}</Text>
              <Text style={styles.objetivo}>{objetivo || 'Sin objetivo definido'}</Text>
              {progreso.cliente && (
                <Text style={styles.tiempoEntrenando}>
                  {progreso.cliente.tiempo_entrenando}
                </Text>
              )}
            </View>
          </View>

          {/* Tarjeta IMC */}
          <View style={styles.imcCard}>
            <Text style={styles.imcLabel}>IMC</Text>
            <Text style={styles.imcValue}>
              {ultimaMedida?.imc?.toFixed(1) || progreso.medidas_recientes?.imc_actual?.toFixed(1) || '26'}
            </Text>
            <Text style={styles.imcStatus}>
              {ultimaMedida?.interpretacion_imc || 'Normal'}
            </Text>
            {progreso.medidas_recientes?.ultima_medicion && (
              <Text style={styles.ultimaMedicion}>
                Última medición: {new Date(progreso.medidas_recientes.ultima_medicion).toLocaleDateString('es-ES')}
              </Text>
            )}
          </View>

          {/* Progreso reciente */}
          {progreso.medidas_recientes && (
            <View style={styles.progresoCard}>
              <Text style={styles.sectionTitle}>Progreso Reciente</Text>
              <View style={styles.progresoGrid}>
                <View style={styles.progresoItem}>
                  <Text style={styles.progresoValor}>
                    {progreso.medidas_recientes.peso_actual?.toFixed(1)}kg
                  </Text>
                  <Text style={styles.progresoLabel}>Peso Actual</Text>
                  {progreso.medidas_recientes.progreso_peso && (
                    <Text style={[
                      styles.progresoCambio,
                      { color: progreso.medidas_recientes.progreso_peso < 0 ? '#10B981' : '#EF4444' }
                    ]}>
                      {progreso.medidas_recientes.progreso_peso > 0 ? '+' : ''}
                      {progreso.medidas_recientes.progreso_peso.toFixed(1)}kg
                    </Text>
                  )}
                </View>
                
                {progreso.medidas_recientes.progreso_grasa && (
                  <View style={styles.progresoItem}>
                    <Text style={styles.progresoValor}>
                      {Math.abs(progreso.medidas_recientes.progreso_grasa).toFixed(1)}%
                    </Text>
                    <Text style={styles.progresoLabel}>Grasa Perdida</Text>
                    <Text style={[styles.progresoCambio, { color: '#10B981' }]}>
                      Excelente
                    </Text>
                  </View>
                )}
                
                {progreso.medidas_recientes.progreso_musculo && (
                  <View style={styles.progresoItem}>
                    <Text style={styles.progresoValor}>
                      +{progreso.medidas_recientes.progreso_musculo.toFixed(1)}kg
                    </Text>
                    <Text style={styles.progresoLabel}>Músculo Ganado</Text>
                    <Text style={[styles.progresoCambio, { color: '#10B981' }]}>
                      Excelente
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Seguimiento */}
          <Text style={styles.sectionTitle}>Seguimiento</Text>
          <View style={styles.seguimientoSection}>
            <TouchableOpacity 
              style={styles.seguimientoItem}
              onPress={() => {
                console.log('📏 Navegando a medidas corporales...');
                router.push('/seguimiento/tallas');
              }}
            >
              <Ionicons name="resize" size={24} color="#fff" />
              <Text style={styles.seguimientoText}>Tallas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.seguimientoItem}
              onPress={() => {
                console.log('⚖️ Navegando a seguimiento de peso...');
                router.push('/seguimiento/peso');
              }}
            >
              <Ionicons name="scale" size={24} color="#fff" />
              <Text style={styles.seguimientoText}>Peso</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.seguimientoItem}
              onPress={() => {
                console.log('🏆 Navegando a marcas personales...');
                router.push('/seguimiento/marcas');
              }}
            >
              <Ionicons name="trophy" size={24} color="#fff" />
              <Text style={styles.seguimientoText}>Marcas</Text>
              {progreso.marcas_recientes?.marcas_este_mes && progreso.marcas_recientes.marcas_este_mes > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{progreso.marcas_recientes.marcas_este_mes}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Marcas Recientes */}
          {marcasRecientes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Marcas Recientes</Text>
              <View style={styles.marcasContainer}>
                {marcasRecientes.slice(0, 2).map((marca) => (
                  <View key={marca.id} style={styles.marcaCard}>
                    <View style={styles.marcaHeader}>
                      <Text style={styles.marcaEjercicio}>{marca.ejercicio.name}</Text>
                      {marca.es_record_personal && (
                        <View style={styles.recordBadge}>
                          <Text style={styles.recordText}>🏆 PR</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.marcaValor}>{marca.valor_principal}kg</Text>
                    <Text style={styles.marcaTipo}>{marca.tipo_marca.toUpperCase()}</Text>
                    <Text style={styles.marcaFecha}>
                      {new Date(marca.fecha_marca).toLocaleDateString('es-ES')}
                    </Text>
                    {!marca.validada && (
                      <Text style={styles.marcaPendiente}>Pendiente validación</Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Fotos del proceso */}
          <Text style={styles.sectionTitle}>Fotos del proceso</Text>
          <View style={styles.photosSection}>
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={32} color="#ccc" />
              <Text style={styles.photoText}>Agregar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={32} color="#ccc" />
              <Text style={styles.photoText}>Agregar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={32} color="#ccc" />
              <Text style={styles.photoText}>Agregar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Solicitar ubicación */}
          <TouchableOpacity
            style={styles.ubicacionButton}
            onPress={() =>
              router.push({
                pathname: './solicitar-ubicacion',
                params: { name, avatar },
              })
            }
          >
            <Ionicons name="location" size={16} color="#FF3B30" />
            <Text style={styles.ubicacionText}>Solicitar ubicación</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  objetivo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tiempoEntrenando: {
    fontSize: 12,
    color: '#999',
  },
  imcCard: {
    backgroundColor: '#FF6A3D',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  imcLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  imcValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  imcStatus: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  ultimaMedicion: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    opacity: 0.8,
  },
  progresoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progresoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresoItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  progresoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6A3D',
  },
  progresoLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  progresoCambio: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  seguimientoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  seguimientoItem: {
    backgroundColor: '#FF6A3D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  seguimientoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  marcasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  marcaCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  marcaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marcaEjercicio: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  recordBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recordText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  marcaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6A3D',
    marginBottom: 4,
  },
  marcaTipo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  marcaFecha: {
    fontSize: 10,
    color: '#999',
  },
  marcaPendiente: {
    fontSize: 10,
    color: '#FF8A00',
    fontStyle: 'italic',
    marginTop: 4,
  },
  photosSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  photoPlaceholder: {
    backgroundColor: '#fff',
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  photoText: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  ubicacionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  ubicacionText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
