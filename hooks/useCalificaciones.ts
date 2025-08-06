import { useAuth } from '@/app/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';

// CONFIGURACIÓN: Cambiar a false cuando el servidor esté disponible
const USE_MOCK_DATA = true;

interface CalificacionStats {
  promedio: number;
  total_calificaciones: number;
  distribucion: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export const useCalificaciones = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<CalificacionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalificaciones = useCallback(async () => {
    if (!user || !token || user.role === 'cliente') {
      console.log('🔄 Saltando calificaciones - Usuario cliente o sin datos');
      return; // Solo entrenadores y nutricionistas tienen calificaciones
    }

    console.log('🔄 Iniciando carga de calificaciones para:', user.role);
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      // TEMPORAL: Usar datos mock mientras se verifica la conectividad
      console.log('🔧 Usando datos mock temporalmente');
      setTimeout(() => {
        setStats({
          promedio: 4.5,
          total_calificaciones: 12,
          distribucion: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 6 }
        });
        setLoading(false);
      }, 1000);
      return;
    }

    // CÓDIGO REAL PARA CONECTAR AL SERVIDOR
    try {
      const url = `https://coyoteapp.duckdns.org/api/calificaciones/dashboard`;
      console.log('📡 Haciendo request a:', url);
      console.log('🔑 Token length:', token.length);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Calificaciones obtenidas:', data);
      setStats(data);
    } catch (err) {
      console.error('❌ Error completo:', err);
      
      if (err instanceof TypeError && err.message === 'Network request failed') {
        console.log('🌐 Error de conexión - usando datos mock como fallback');
        setError('Servidor no disponible - mostrando datos de ejemplo');
        // Fallback a datos mock si el servidor no está disponible
        setStats({
          promedio: 4.5,
          total_calificaciones: 12,
          distribucion: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 6 }
        });
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al cargar calificaciones');
      }
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchCalificaciones();
  }, [fetchCalificaciones]);

  return {
    stats,
    loading,
    error,
    refetch: fetchCalificaciones,
  };
};
