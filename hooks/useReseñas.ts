import { useAuth } from '@/app/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';

// CONFIGURACIÓN: Cambiar a false cuando el servidor esté disponible
const USE_MOCK_DATA = true;

interface Reseña {
  id: number;
  cliente_id: number;
  cliente_nombre: string;
  cliente_avatar?: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

interface ReseñasResponse {
  reseñas: Reseña[];
  total: number;
  promedio: number;
}

const mockReseñas: Reseña[] = [
  {
    id: 1,
    cliente_id: 101,
    cliente_nombre: 'María González',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    calificacion: 5,
    comentario: 'Excelente entrenador, muy profesional y motivador. Los resultados han sido increíbles.',
    fecha: '2025-01-15'
  },
  {
    id: 2,
    cliente_id: 102,
    cliente_nombre: 'Carlos Ruiz',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    calificacion: 4,
    comentario: 'Muy buen trabajo, rutinas personalizadas y siempre puntual. Recomendado.',
    fecha: '2025-01-10'
  },
  {
    id: 3,
    cliente_id: 103,
    cliente_nombre: 'Ana Martín',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    calificacion: 5,
    comentario: 'El mejor entrenador que he tenido. Conoce perfectamente la técnica y es muy paciente.',
    fecha: '2025-01-08'
  },
  {
    id: 4,
    cliente_id: 104,
    cliente_nombre: 'Diego López',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    calificacion: 4,
    comentario: 'Entrenamientos efectivos y bien estructurados. He visto mejoras rápidamente.',
    fecha: '2025-01-05'
  },
  {
    id: 5,
    cliente_id: 105,
    cliente_nombre: 'Sofía Torres',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    calificacion: 5,
    comentario: 'Increíble profesional. Me ayudó a alcanzar mis objetivos de forma segura y efectiva.',
    fecha: '2025-01-03'
  },
  {
    id: 6,
    cliente_id: 106,
    cliente_nombre: 'Roberto Kim',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    calificacion: 5,
    comentario: 'Recomiendo 100%. Gran conocimiento y excelente trato humano.',
    fecha: '2024-12-28'
  },
  {
    id: 7,
    cliente_id: 107,
    cliente_nombre: 'Lucía Herrera',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    calificacion: 4,
    comentario: 'Muy profesional, me ha ayudado mucho con mi técnica de levantamiento.',
    fecha: '2024-12-25'
  },
  {
    id: 8,
    cliente_id: 108,
    cliente_nombre: 'Fernando Castro',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    calificacion: 5,
    comentario: 'Excelente seguimiento personalizado. Cambió completamente mi estilo de vida.',
    fecha: '2024-12-20'
  },
  {
    id: 9,
    cliente_id: 109,
    cliente_nombre: 'Valentina Rossi',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    calificacion: 4,
    comentario: 'Gran motivador y conoce bien lo que hace. Las rutinas son desafiantes pero efectivas.',
    fecha: '2024-12-18'
  },
  {
    id: 10,
    cliente_id: 110,
    cliente_nombre: 'Alejandro Vega',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    calificacion: 5,
    comentario: 'Definitivamente el mejor entrenador que he tenido. Resultados garantizados.',
    fecha: '2024-12-15'
  },
  {
    id: 11,
    cliente_id: 111,
    cliente_nombre: 'Isabella Moreno',
    cliente_avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
    calificacion: 4,
    comentario: 'Muy contenta con el progreso. Entrenamientos adaptados perfectamente a mis necesidades.',
    fecha: '2024-12-12'
  },
  {
    id: 12,
    cliente_id: 112,
    cliente_nombre: 'Mateo Silva',
    cliente_avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
    calificacion: 3,
    comentario: 'Buen entrenador en general, aunque a veces llega un poco tarde.',
    fecha: '2024-12-10'
  }
];

export const useReseñas = () => {
  const { user, token } = useAuth();
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReseñas = useCallback(async () => {
    if (!user || !token || user.role === 'cliente') {
      console.log('🔄 Saltando reseñas - Usuario cliente o sin datos');
      return; // Solo entrenadores y nutricionistas tienen reseñas
    }

    console.log('🔄 Iniciando carga de reseñas para:', user.role);
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      // TEMPORAL: Usar datos mock mientras se verifica la conectividad
      console.log('🔧 Usando reseñas mock temporalmente');
      setTimeout(() => {
        setReseñas(mockReseñas);
        setLoading(false);
      }, 800);
      return;
    }

    // CÓDIGO REAL PARA CONECTAR AL SERVIDOR
    try {
      const url = `https://coyoteapp.duckdns.org/api/calificaciones/reseñas`;
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

      const data: ReseñasResponse = await response.json();
      console.log('📊 Reseñas obtenidas:', data);
      setReseñas(data.reseñas || []);
    } catch (err) {
      console.error('❌ Error completo:', err);
      
      if (err instanceof TypeError && err.message === 'Network request failed') {
        console.log('🌐 Error de conexión - usando reseñas mock como fallback');
        setError('Servidor no disponible - mostrando datos de ejemplo');
        // Fallback a datos mock si el servidor no está disponible
        setReseñas(mockReseñas);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al cargar reseñas');
      }
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchReseñas();
  }, [fetchReseñas]);

  return {
    reseñas,
    loading,
    error,
    refetch: fetchReseñas,
  };
};
