import { useEffect, useState } from 'react';
import { useAuth } from '../app/context/AuthContext';

export type Routine = {
  id: number;
  title: string;
  description?: string;
  is_automatic: boolean;
  entrenador_id: number | null;
};

export function useRoutines() {
  const { user, token } = useAuth();
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [autoRoutines, setAutoRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !user) return;
    const fetchRoutines = async () => {
      setLoading(true);
      try {
        let url = '';
        // Usar los roles reales de la base de datos: 'entrenador', 'cliente', 'gimnasio', 'admin'
        if (user.role === 'entrenador') {
          url = 'http://192.168.18.84:8000/api/entrenador/rutinas';
        } else if (user.role === 'cliente') {
          url = 'http://192.168.18.84:8000/api/client/rutinas';
        } else if (user.role === 'admin') {
          url = 'http://192.168.18.84:8000/api/admin/rutinas';
        } else if (user.role === 'gimnasio') {
          url = 'http://192.168.18.84:8000/api/gym/rutinas';
        }
        if (!url) return;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        // Soporta paginación y sin paginación
        const routinesArr = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : [];
        const routines = routinesArr.map((r: any) => ({
          ...r,
          entrenador_id: r.entrenador_id ?? r.professional_id ?? null,
        }));
        if (user.role === 'entrenador') {
          setSavedRoutines(routines.filter((r: Routine) => !r.is_automatic && (r.entrenador_id === user.id)));
          setAutoRoutines(routines.filter((r: Routine) => r.is_automatic && (r.entrenador_id === user.id || r.entrenador_id === null)));
        } else if (user.role === 'cliente') {
          setSavedRoutines(routines);
          setAutoRoutines([]);
        } else if (user.role === 'admin' || user.role === 'gimnasio') {
          setSavedRoutines(routines.filter((r: Routine) => !r.is_automatic));
          setAutoRoutines(routines.filter((r: Routine) => r.is_automatic));
        } else {
          setSavedRoutines([]);
          setAutoRoutines([]);
        }
      } catch {
        // Opcional: mostrar error
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, [token, user]);
  // Eliminar rutina
  const deleteRoutine = async (id: number) => {
    if (!token) return;
    await fetch(`http://192.168.18.84:8000/api/rutinas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    setSavedRoutines((prev) => prev.filter((r) => r.id !== id));
    setAutoRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  // Actualizar rutina
  const updateRoutine = async (routine: Routine) => {
    if (!token) return;
    await fetch(`http://192.168.18.84:8000/api/rutinas/${routine.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routine),
    });
    setSavedRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
  };

  return { savedRoutines, autoRoutines, loading, deleteRoutine, updateRoutine };
}
