import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

import { ButtonCustom } from '@/components/ButtonCustom';

// Definir el tipo para los ejercicios
type Ejercicio = {
  id: number;
  nombre: string;
  repeticiones?: string;
  series?: string;
  peso?: string;
  tiempo?: string;
  descanso?: string;
  notas?: string;
  ejercicio_catalogo_id?: number;
};

const categorias = [
  'Fuerza',
  'Cardio',
  'Movilidad',
  'Resistencia',
  'Calistenia',
  'Glúteos',
];


export default function NewRutina() {
  const { token } = useAuth();
  const router = useRouter();
  const { id: rutinaId } = useLocalSearchParams();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [comentarios, setComentarios] = useState('');
  // Ejercicios ya agregados a la rutina (desde la API)
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // Para agregar un nuevo ejercicio
  const [nuevoEjercicio, setNuevoEjercicio] = useState<Partial<Ejercicio>>({ nombre: '', repeticiones: '', series: '', peso: '', tiempo: '', descanso: '', notas: '' });
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<Ejercicio[]>([]);
  const [loadingEjercicios, setLoadingEjercicios] = useState(false);

  // Cargar ejercicios de la rutina (GET /rutinas/{id}/ejercicios)
  useEffect(() => {
    if (rutinaId && token) {
      fetch(`http://192.168.18.84:8000/api/rutinas/${rutinaId}/ejercicios`, {
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
  }, [rutinaId, modalVisible, token]); // recarga al cerrar modal

  // Cargar catálogo de ejercicios disponibles (GET /ejercicios) siempre al montar
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
      .catch(() => {
        setEjerciciosDisponibles([]);
      })
      .finally(() => setLoadingEjercicios(false));
  }, [token]);

  const handleGoBack = () => router.back();
  // Agregar ejercicio a la lista local
  const handleAddEjercicio = () => {
    if (!nuevoEjercicio.ejercicio_catalogo_id) {
      alert('Selecciona un ejercicio del catálogo');
      return;
    }
    setEjercicios(prev => [
      ...prev,
      {
        id: nuevoEjercicio.ejercicio_catalogo_id!,
        nombre: nuevoEjercicio.nombre || '',
        repeticiones: nuevoEjercicio.repeticiones,
        series: nuevoEjercicio.series,
        peso: nuevoEjercicio.peso,
        tiempo: nuevoEjercicio.tiempo,
        descanso: nuevoEjercicio.descanso,
        notas: nuevoEjercicio.notas,
        ejercicio_catalogo_id: nuevoEjercicio.ejercicio_catalogo_id
      }
    ]);
    setModalVisible(false);
    setNuevoEjercicio({ nombre: '', repeticiones: '', series: '', peso: '', tiempo: '', descanso: '', notas: '' });
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
          <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6, marginRight: 8 }} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Añadir rutina</Text>
        </View>

        {/* Título */}
        <TextInput
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 16 }}
          placeholder="Título"
          placeholderTextColor="#bdbdbd"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Categoría */}
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
          onPress={() => setShowCategorias(!showCategorias)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
          <Text style={{ color: categoria ? '#222' : '#bdbdbd', flex: 1 }}>{categoria || 'Categoría'}</Text>
          <Ionicons name={showCategorias ? 'chevron-up' : 'chevron-down'} size={18} color="#bdbdbd" />
        </TouchableOpacity>
        {showCategorias && (
          <View style={{ backgroundColor: '#F7F8F8', borderRadius: 8, marginBottom: 16, paddingVertical: 4 }}>
            {categorias.map((cat) => (
              <TouchableOpacity key={cat} onPress={() => { setCategoria(cat); setShowCategorias(false); }} style={{ padding: 12 }}>
                <Text style={{ color: '#222', fontSize: 15 }}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
                <Text style={{ color: '#222', fontSize: 15 }}>{ej.nombre}</Text>
                {ej.peso && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>{ej.peso}kg</Text>}
                {ej.tiempo && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>{ej.tiempo}s</Text>}
                {ej.descanso && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>Desc: {ej.descanso}s</Text>}
                {ej.notas && <Text style={{ color: '#888', fontSize: 14, marginLeft: 8 }}>Notas: {ej.notas}</Text>}
              </View>
            </View>
          ))
        )}


        {/* Catálogo de ejercicios eliminado, ahora solo se muestra en el modal */}

        {/* Botón agregar ejercicio (abre modal) */}
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 50, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 10 }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="#222" />
        </TouchableOpacity>

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
                      <Text style={{ color: '#222', fontSize: 15, marginRight: 8 }}>{ej.nombre}</Text>
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

        {/* Comentarios adicionales */}
        <Text style={{ color: '#222', fontWeight: '500', marginBottom: 8 }}>Comentarios adicionales</Text>
        <TextInput
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 32 }}
          placeholder="Comentarios"
          placeholderTextColor="#bdbdbd"
          value={comentarios}
          onChangeText={setComentarios}
          multiline
        />
      </ScrollView>
      {/* Guardar rutina */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' }}>
      <ButtonCustom
        text={"Guardar rutina"}
        icon={<Ionicons name="lock-closed" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />}
        onPress={async () => {
          if (!titulo || !categoria || comentarios.length < 10) {
            alert('Completa todos los campos y asegúrate de que la descripción tenga al menos 10 caracteres');
            return;
          }
          try {
            const res = await fetch('http://192.168.18.84:8000/api/rutinas', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                title: titulo,
                categoria,
                description: comentarios
              })
            });
            if (!res.ok) {
              const error = await res.json();
              alert(error?.message || 'Error al guardar rutina');
              return;
            }
            const data = await res.json();
            alert('Rutina creada. Ahora puedes agregar ejercicios.');
            // Redirigir a pantalla de detalle o agregar ejercicios
            router.replace({ pathname: '/rutinas/DetalleRutina', params: { id: data.id || data.data?.id } });
          } catch {
            alert('No se pudo guardar la rutina');
          }
        }}
        colors={["#E0E0E0", "#E0E0E0"]}
      />
      </View>
    </KeyboardAvoidingView>
  );
}
