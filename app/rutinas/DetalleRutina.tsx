import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ButtonCustom } from '../../components/ButtonCustom';
import { useRoutines } from '../../hooks/useRoutines';
import { useAuth } from '../context/AuthContext';

export default function DetalleRutina() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { savedRoutines, autoRoutines } = useRoutines();
  // deleteRoutine y updateRoutine se implementarán después

  // Buscar la rutina por id en ambas listas
  // id es string, r.id es number
  const numericId = Number(id);
  const routine =
    savedRoutines.find((r) => r.id === numericId) ||
    autoRoutines.find((r) => r.id === numericId);

  // Estado para edición y ejercicios
  const [title] = useState(routine?.title || '');
  const [categoria] = useState(routine?.categoria || '');
  const [comentarios] = useState(routine?.description || '');
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState<any>({ nombre: '', repeticiones: '', series: '', peso: '', tiempo: '', descanso: '', notas: '' });
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<any[]>([]);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);
  const { token } = useAuth();
  // Cargar ejercicios de la rutina (GET /rutinas/{id}/ejercicios)
  useEffect(() => {
    if (id && token) {
      fetch(`http://192.168.18.84:8000/api/rutinas/${id}/ejercicios`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          const arr = Array.isArray(data.data) ? data.data : data.data?.data || [];
          setEjercicios(arr);
        })
        .catch(() => setEjercicios([]));
    }
  }, [id, modalVisible, token]);

  // Cargar catálogo de ejercicios disponibles (GET /ejercicios)
  useEffect(() => {
    if (!token) return;
    setLoadingEjercicios(true);
    fetch('http://192.168.18.84:8000/api/ejercicios', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data.data) ? data.data : data.data?.data || [];
        setEjerciciosDisponibles(arr);
      })
      .catch(() => setEjerciciosDisponibles([]))
      .finally(() => setLoadingEjercicios(false));
  }, [token]);

  // Agregar ejercicio a la rutina (POST /rutinas/{id}/ejercicios)
  const handleAddEjercicio = async () => {
    if (!nuevoEjercicio.ejercicio_catalogo_id) {
      alert('Selecciona un ejercicio del catálogo');
      return;
    }
    try {
      const res = await fetch(`http://192.168.18.84:8000/api/rutinas/${id}/ejercicios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ejercicio_catalogo_id: nuevoEjercicio.ejercicio_catalogo_id,
          series: nuevoEjercicio.series,
          repeticiones: nuevoEjercicio.repeticiones,
          peso: nuevoEjercicio.peso,
          tiempo: nuevoEjercicio.tiempo,
          descanso: nuevoEjercicio.descanso,
          notas: nuevoEjercicio.notas,
        })
      });
      if (!res.ok) throw new Error('Error al agregar ejercicio');
      setModalVisible(false);
      setNuevoEjercicio({ nombre: '', repeticiones: '', series: '', peso: '', tiempo: '', descanso: '', notas: '' });
    } catch (e) {
      alert('No se pudo agregar el ejercicio');
    }
  };

  if (!routine) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#222', fontSize: 18 }}>Rutina no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, backgroundColor: '#F7F8F8', borderRadius: 8, padding: 10 }}>
          <Text style={{ color: '#222' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Validaciones de seguridad
  const isAutomatic = routine.is_automatic;
  const isOwner = routine.entrenador_id === user?.id;

  const handleDelete = () => {
    if (isAutomatic) {
      Alert.alert('Error', 'No puedes eliminar rutinas automáticas');
      return;
    }
    if (!isOwner) {
      Alert.alert('Error', 'No tienes permisos para eliminar esta rutina');
      return;
    }
    // Aquí iría la llamada a deleteRoutine cuando esté implementada
    Alert.alert('Eliminar rutina', '¿Estás seguro de eliminar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          // await deleteRoutine(routine.id);
          router.replace('/rutinas/misRutinas');
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (isAutomatic) {
      Alert.alert('Error', 'No puedes modificar rutinas automáticas');
      return;
    }
    if (!isOwner) {
      Alert.alert('Error', 'No tienes permisos para modificar esta rutina');
      return;
    }
    // Aquí iría la llamada a updateRoutine cuando esté implementada
    Alert.alert('Éxito', 'Rutina actualizada (simulado)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: Platform.OS === "ios" ? 50 : 35, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 24 }}>
          <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6, marginRight: 8 }} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Detalle de la rutina</Text>
        </View>

        {/* Título */}
        <Text style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Título</Text>
        <Text style={{ color: '#222', fontSize: 17, marginBottom: 12 }}>{title}</Text>

        {/* Categoría */}
        <Text style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Categoría</Text>
        <Text style={{ color: '#222', fontSize: 15, marginBottom: 12 }}>{categoria}</Text>

        {/* Descripción */}
        <Text style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>Descripción</Text>
        <Text style={{ color: '#222', fontSize: 15, marginBottom: 18 }}>{comentarios}</Text>

        {/* Ejercicios de la rutina */}
        <Text style={{ color: '#222', fontWeight: '500', marginBottom: 8 }}>Ejercicios de la rutina</Text>
        {ejercicios.length === 0 ? (
          <Text style={{ color: '#888', fontSize: 14, marginBottom: 10 }}>No hay ejercicios añadidos aún.</Text>
        ) : (
          ejercicios.map((ej, idx) => (
            <View key={ej.id || idx} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10, justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ backgroundColor: '#F7F8F8', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14, marginRight: 10 }}>
                  <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>{ej.series ? `${ej.series}x` : ''}{ej.repeticiones}</Text>
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{ej.nombre || ej.ejercicio_nombre}</Text>
                {ej.peso && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>{ej.peso}kg</Text>}
                {ej.tiempo && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>{ej.tiempo}s</Text>}
                {ej.descanso && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>Desc: {ej.descanso}s</Text>}
                {ej.notas && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>Notas: {ej.notas}</Text>}
              </View>
            </View>
          ))
        )}

        {/* Botón agregar ejercicio (abre modal) */}
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 50, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 10 }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="#222" />
        </TouchableOpacity>

        {/* Eliminar y guardar cambios */}
        <View style={{ flexDirection: 'row', marginTop: 10, gap: 16, alignItems: 'center' }}>
          {/* Botón de icono papelera para eliminar */}
          <TouchableOpacity
            onPress={handleDelete}
            style={{ backgroundColor: '#ffdddd', borderRadius: 50, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="trash" size={24} color="#c00" />
          </TouchableOpacity>
          {/* Botón guardar cambios usando ButtonCustom */}
          <View style={{ flex: 1 }}>
            <ButtonCustom
              title="Guardar cambios"
              onPress={handleSave}
              style={{ backgroundColor: '#d0f5e8' }}
              textStyle={{ color: '#088', fontWeight: 'bold' }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal para agregar ejercicio */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 0, width: 340, elevation: 5, overflow: 'hidden' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 22, paddingBottom: 12 }}>
              <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6, marginRight: 8 }} onPress={() => setModalVisible(false)}>
                <Ionicons name="chevron-back" size={22} color="#222" />
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Añadir ejercicio</Text>
            </View>
            {/* Listado de ejercicios de la rutina actual */}
            <Text style={{ color: '#222', fontWeight: '500', marginLeft: 18, marginBottom: 4 }}>Ejercicios de la rutina</Text>
            <View style={{ maxHeight: 100, marginHorizontal: 18, marginBottom: 8 }}>
              {ejercicios.length === 0 ? (
                <Text style={{ color: '#888', fontSize: 14 }}>No hay ejercicios añadidos aún.</Text>
              ) : (
                ejercicios.map((ej, idx) => (
                  <View key={ej.id || idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: '#222', fontSize: 15, marginRight: 8 }}>{ej.nombre || ej.ejercicio_nombre}</Text>
                    <Text style={{ color: '#888', fontSize: 14 }}>{ej.series ? `${ej.series}x` : ''}{ej.repeticiones}</Text>
                    {ej.peso && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>{ej.peso}kg</Text>}
                  </View>
                ))
              )}
            </View>
            {/* Input de búsqueda y selección de ejercicio */}
            <Text style={{ color: '#222', fontWeight: '500', marginLeft: 18, marginBottom: 6 }}>Ejercicio del catálogo</Text>
            <View style={{ marginHorizontal: 18, marginBottom: 10 }}>
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 6 }}
                placeholder="Buscar ejercicio..."
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.nombre || ''}
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, nombre: text })}
                autoFocus
              />
              <View style={{ maxHeight: 120 }}>
                {loadingEjercicios ? (
                  <Text style={{ color: '#888', textAlign: 'center', marginVertical: 10 }}>Cargando ejercicios...</Text>
                ) : ejerciciosDisponibles.length === 0 ? (
                  <Text style={{ color: '#888', textAlign: 'center', marginVertical: 10 }}>No hay ejercicios en el catálogo.</Text>
                ) : (
                  ejerciciosDisponibles
                    .filter(ej => ej.nombre.toLowerCase().includes((nuevoEjercicio.nombre || '').toLowerCase()))
                    .slice(0, 10)
                    .map((ej, idx) => (
                      <TouchableOpacity
                        key={ej.id || idx}
                        onPress={() => setNuevoEjercicio({ ...nuevoEjercicio, nombre: ej.nombre, ejercicio_catalogo_id: ej.id })}
                        style={{ paddingVertical: 8, paddingHorizontal: 8, backgroundColor: nuevoEjercicio.ejercicio_catalogo_id === ej.id ? '#E0E0E0' : 'transparent', borderRadius: 8 }}
                      >
                        <Text style={{ color: '#222', fontSize: 15 }}>{ej.nombre}</Text>
                      </TouchableOpacity>
                    ))
                )}
              </View>
            </View>
            {/* Inputs series y repeticiones */}
            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 18, marginBottom: 8 }}>
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Series"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.series || ''}
                keyboardType="numeric"
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, series: text })}
              />
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Repeticiones"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.repeticiones || ''}
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: text })}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 18, marginBottom: 8 }}>
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Peso (kg)"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.peso || ''}
                keyboardType="numeric"
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, peso: text })}
              />
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Tiempo (seg)"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.tiempo || ''}
                keyboardType="numeric"
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, tiempo: text })}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 18, marginBottom: 8 }}>
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Descanso (seg)"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.descanso || ''}
                keyboardType="numeric"
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, descanso: text })}
              />
              <TextInput
                style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                placeholder="Notas"
                placeholderTextColor="#bdbdbd"
                value={nuevoEjercicio.notas || ''}
                onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, notas: text })}
              />
            </View>
            {/* Botón añadir ejercicio */}
            <TouchableOpacity
              onPress={handleAddEjercicio}
              style={{ backgroundColor: '#222', borderRadius: 12, marginHorizontal: 18, marginBottom: 18, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Añadir ejercicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
