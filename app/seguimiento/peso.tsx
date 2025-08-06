import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  porcentaje_agua?: number;
  tipo_medicion: string;
  notas?: string;
  created_at: string;
}

interface ProgresoData {
  peso?: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentaje_cambio: number;
  };
  imc?: {
    actual: number;
    anterior: number;
    cambio: number;
    categoria_actual: string;
  };
  tendencias?: {
    peso: string;
    masa_muscular: string;
    porcentaje_grasa: string;
  };
}

interface StatsData {
  total_mediciones: number;
  peso_inicial: number;
  peso_actual: number;
  perdida_total: number;
  tiempo_seguimiento_dias: number;
}

export default function PesoScreen() {
  const { clienteId, clienteNombre } = useLocalSearchParams<{ 
    clienteId?: string; 
    clienteNombre?: string;
  }>();

  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [progreso, setProgreso] = useState<ProgresoData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  const obtenerDatosPeso = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Si tenemos clienteId, usamos la API del entrenador, sino la API del cliente
      const url = clienteId 
        ? `http://192.168.18.84:8000/api/entrenador/clientes/${clienteId}/medidas`
        : `http://192.168.18.84:8000/api/medidas-corporales`;

      console.log('📊 Obteniendo datos de peso desde:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('⚖️ Datos de peso obtenidos:', data);
        
        if (data.success && data.data?.data) {
          setMedidas(data.data.data);
          
          // Guardar datos de progreso y estadísticas si están disponibles
          if (data.progreso) {
            setProgreso(data.progreso);
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } else {
        console.error('❌ Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos de peso:', error);
    } finally {
      setLoading(false);
    }
  }, [token, clienteId]);

  useEffect(() => {
    obtenerDatosPeso();
  }, [obtenerDatosPeso]);

  const getIMCColor = (imc: number) => {
    if (imc < 18.5) return '#3B82F6'; // Bajo peso - Azul
    if (imc < 25) return '#10B981'; // Normal - Verde
    if (imc < 30) return '#F59E0B'; // Sobrepeso - Amarillo
    return '#EF4444'; // Obesidad - Rojo
  };

  const getIMCLabel = (interpretacion: string) => {
    return interpretacion || 'Normal';
  };

  const calcularCambioPeso = (actual: number, anterior: number) => {
    const cambio = actual - anterior;
    return {
      valor: cambio,
      texto: cambio > 0 ? `+${cambio.toFixed(1)}kg` : `${cambio.toFixed(1)}kg`,
      color: cambio < 0 ? '#10B981' : '#EF4444' // Verde si bajó, rojo si subió
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {clienteNombre ? `Peso - ${clienteNombre}` : 'Mi Peso'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A3D" />
          <Text style={styles.loadingText}>Cargando datos de peso...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Estadísticas generales */}
          {stats && (
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Resumen General</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.total_mediciones}</Text>
                  <Text style={styles.statLabel}>Mediciones</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.peso_inicial}kg</Text>
                  <Text style={styles.statLabel}>Peso Inicial</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.peso_actual}kg</Text>
                  <Text style={styles.statLabel}>Peso Actual</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[
                    styles.statValue,
                    { color: stats.perdida_total < 0 ? '#10B981' : '#EF4444' }
                  ]}>
                    {stats.perdida_total > 0 ? '+' : ''}{stats.perdida_total}kg
                  </Text>
                  <Text style={styles.statLabel}>Cambio Total</Text>
                </View>
              </View>
              <Text style={styles.statsTime}>
                📅 {stats.tiempo_seguimiento_dias} días de seguimiento
              </Text>
            </View>
          )}

          {/* Progreso reciente */}
          {progreso && (
            <View style={styles.progresoCard}>
              <Text style={styles.sectionTitle}>Progreso Reciente</Text>
              <View style={styles.progresoGrid}>
                {progreso.peso && (
                  <View style={styles.progresoItem}>
                    <Text style={styles.progresoValor}>{progreso.peso.actual}kg</Text>
                    <Text style={styles.progresoLabel}>Peso Actual</Text>
                    <Text style={[
                      styles.progresoCambio,
                      { color: progreso.peso.cambio < 0 ? '#10B981' : '#EF4444' }
                    ]}>
                      {progreso.peso.cambio > 0 ? '+' : ''}{progreso.peso.cambio.toFixed(1)}kg
                    </Text>
                  </View>
                )}
                
                {progreso.imc && (
                  <View style={styles.progresoItem}>
                    <Text style={[
                      styles.progresoValor,
                      { color: getIMCColor(progreso.imc.actual) }
                    ]}>
                      {progreso.imc.actual.toFixed(1)}
                    </Text>
                    <Text style={styles.progresoLabel}>IMC</Text>
                    <Text style={styles.progresoCambio}>
                      {progreso.imc.categoria_actual}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Historial de mediciones */}
          <Text style={styles.sectionTitle}>Historial de Peso</Text>
          {medidas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="scale-outline" size={48} color="#C4C4C4" />
              <Text style={styles.emptyTitle}>Sin mediciones</Text>
              <Text style={styles.emptySubtitle}>
                No hay mediciones de peso registradas
              </Text>
            </View>
          ) : (
            <View style={styles.medidasContainer}>
              {medidas.map((medida, index) => {
                const medidaAnterior = medidas[index + 1];
                const cambio = medidaAnterior 
                  ? calcularCambioPeso(medida.peso, medidaAnterior.peso)
                  : null;

                return (
                  <View key={medida.id} style={styles.medidaCard}>
                    <View style={styles.medidaHeader}>
                      <View style={styles.medidaFecha}>
                        <Text style={styles.fechaText}>
                          {new Date(medida.fecha_medicion).toLocaleDateString('es-ES')}
                        </Text>
                        <Text style={styles.tipoText}>{medida.tipo_medicion}</Text>
                      </View>
                      {index === 0 && (
                        <View style={styles.recentBadge}>
                          <Text style={styles.recentText}>Reciente</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.medidaContent}>
                      <View style={styles.pesoSection}>
                        <Text style={styles.pesoValor}>{medida.peso}kg</Text>
                        {cambio && (
                          <Text style={[styles.cambioText, { color: cambio.color }]}>
                            {cambio.texto}
                          </Text>
                        )}
                      </View>

                      <View style={styles.imcSection}>
                        <Text style={styles.imcLabel}>IMC</Text>
                        <Text style={[
                          styles.imcValor,
                          { color: getIMCColor(medida.imc) }
                        ]}>
                          {medida.imc.toFixed(1)}
                        </Text>
                        <Text style={styles.imcStatus}>
                          {getIMCLabel(medida.interpretacion_imc)}
                        </Text>
                      </View>
                    </View>

                    {/* Datos adicionales */}
                    {(medida.porcentaje_grasa || medida.masa_muscular || medida.porcentaje_agua) && (
                      <View style={styles.additionalData}>
                        {medida.porcentaje_grasa && (
                          <View style={styles.dataItem}>
                            <Text style={styles.dataLabel}>Grasa</Text>
                            <Text style={styles.dataValue}>{medida.porcentaje_grasa}%</Text>
                          </View>
                        )}
                        {medida.masa_muscular && (
                          <View style={styles.dataItem}>
                            <Text style={styles.dataLabel}>Músculo</Text>
                            <Text style={styles.dataValue}>{medida.masa_muscular}kg</Text>
                          </View>
                        )}
                        {medida.porcentaje_agua && (
                          <View style={styles.dataItem}>
                            <Text style={styles.dataLabel}>Agua</Text>
                            <Text style={styles.dataValue}>{medida.porcentaje_agua}%</Text>
                          </View>
                        )}
                      </View>
                    )}

                    {medida.notas && (
                      <View style={styles.notasSection}>
                        <Text style={styles.notasLabel}>Notas:</Text>
                        <Text style={styles.notasText}>{medida.notas}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Tendencias */}
          {progreso?.tendencias && (
            <View style={styles.tendenciasCard}>
              <Text style={styles.sectionTitle}>Tendencias</Text>
              <View style={styles.tendenciasList}>
                <View style={styles.tendenciaItem}>
                  <Ionicons 
                    name={progreso.tendencias.peso === 'descendente' ? 'trending-down' : 'trending-up'} 
                    size={20} 
                    color={progreso.tendencias.peso === 'descendente' ? '#10B981' : '#EF4444'} 
                  />
                  <Text style={styles.tendenciaLabel}>Peso: {progreso.tendencias.peso}</Text>
                </View>
                
                {progreso.tendencias.masa_muscular && (
                  <View style={styles.tendenciaItem}>
                    <Ionicons 
                      name={progreso.tendencias.masa_muscular === 'ascendente' ? 'trending-up' : 'trending-down'} 
                      size={20} 
                      color={progreso.tendencias.masa_muscular === 'ascendente' ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={styles.tendenciaLabel}>Músculo: {progreso.tendencias.masa_muscular}</Text>
                  </View>
                )}
                
                {progreso.tendencias.porcentaje_grasa && (
                  <View style={styles.tendenciaItem}>
                    <Ionicons 
                      name={progreso.tendencias.porcentaje_grasa === 'descendente' ? 'trending-down' : 'trending-up'} 
                      size={20} 
                      color={progreso.tendencias.porcentaje_grasa === 'descendente' ? '#10B981' : '#EF4444'} 
                    />
                    <Text style={styles.tendenciaLabel}>Grasa: {progreso.tendencias.porcentaje_grasa}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
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
    paddingTop: Platform.OS === "ios" ? 50 : 35,
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
  statsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6A3D',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statsTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#C4C4C4',
    textAlign: 'center',
  },
  medidasContainer: {
    gap: 12,
  },
  medidaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  medidaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medidaFecha: {
    flex: 1,
  },
  fechaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  tipoText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  recentBadge: {
    backgroundColor: '#FF6A3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  medidaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pesoSection: {
    flex: 1,
  },
  pesoValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6A3D',
  },
  cambioText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  imcSection: {
    alignItems: 'center',
  },
  imcLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  imcValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imcStatus: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  additionalData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dataItem: {
    alignItems: 'center',
    flex: 1,
  },
  dataLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6A3D',
  },
  notasSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notasLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  notasText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  tendenciasCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tendenciasList: {
    gap: 8,
  },
  tendenciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tendenciaLabel: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
});