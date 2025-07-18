import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ButtonCustom } from '@/components/ButtonCustom';

// Definir el tipo para los ejercicios
type Ejercicio = { repeticiones: string; nombre: string };

const categorias = [
  'Fuerza',
  'Cardio',
  'Movilidad',
  'Resistencia',
  'Calistenia',
  'Glúteos',
];

export default function NewRutina() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [comentarios, setComentarios] = useState('');
  // Usar el tipo Ejercicio en el estado
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [showCategorias, setShowCategorias] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEjercicio, setNuevoEjercicio] = useState<Ejercicio>({ repeticiones: '', nombre: '' });

  const handleGoBack = () => router.back();
  const handleAddEjercicio = () => {
    if (nuevoEjercicio.repeticiones && nuevoEjercicio.nombre) {
      setEjercicios([...ejercicios, nuevoEjercicio]);
      setNuevoEjercicio({ repeticiones: '', nombre: '' });
      setModalVisible(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20 }}
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

        {/* Ejercicios */}
        <Text style={{ color: '#222', fontWeight: '500', marginBottom: 8 }}>Ejercicios</Text>

        {/* Lista de ejercicios */}
        {ejercicios.map((ej, idx) => (
          <View key={idx} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ backgroundColor: '#F7F8F8', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14, marginRight: 10 }}>
                <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>{ej.repeticiones}</Text>
              </View>
              <Text style={{ color: '#222', fontSize: 15 }}>{ej.nombre}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#bdbdbd" />
          </View>
        ))}

        {/* Botón agregar ejercicio */}
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 50, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
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
              {/* Buscador */}
              <Text style={{ color: '#222', fontWeight: '500', marginLeft: 18, marginBottom: 6 }}>Listado de ejercicios</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8F8', borderRadius: 8, marginHorizontal: 18, marginBottom: 10, paddingHorizontal: 10 }}>
                <Ionicons name="search" size={16} color="#bdbdbd" style={{ marginRight: 6 }} />
                <TextInput
                  style={{ flex: 1, height: 38, fontSize: 15, color: '#222' }}
                  placeholder="Buscar"
                  placeholderTextColor="#bdbdbd"
                  value={nuevoEjercicio.nombre}
                  onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, nombre: text })}
                  autoFocus
                />
              </View>
              {/* Lista de sugerencias */}
              <View style={{ maxHeight: 200, marginBottom: 10 }}>
                {['Dominadas','Elevación de Gemelos','Elevación de Piernas Colgado','Flexiones','Fondos en Paralelas','Hip Thrust','Jumping Jacks','Lunge','Mountain Climbers','Peso Muerto'].filter(ej => ej.toLowerCase().includes(nuevoEjercicio.nombre.toLowerCase())).map((ej, idx) => (
                  <TouchableOpacity key={ej+idx} onPress={() => setNuevoEjercicio({ ...nuevoEjercicio, nombre: ej })} style={{ paddingVertical: 8, paddingHorizontal: 18 }}>
                    <Text style={{ color: '#222', fontSize: 15 }}>{ej}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Inputs series y repeticiones */}
              <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 18, marginBottom: 18 }}>
                <TextInput
                  style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                  placeholder="Series"
                  placeholderTextColor="#bdbdbd"
                  value={nuevoEjercicio.repeticiones.split('x')[0] || ''}
                  keyboardType="numeric"
                  onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: text + 'x' + (nuevoEjercicio.repeticiones.split('x')[1] || '') })}
                />
                <TextInput
                  style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 12, fontSize: 15, flex: 1 }}
                  placeholder="Repeticiones"
                  placeholderTextColor="#bdbdbd"
                  value={nuevoEjercicio.repeticiones.split('x')[1] || ''}
                  keyboardType="numeric"
                  onChangeText={text => setNuevoEjercicio({ ...nuevoEjercicio, repeticiones: (nuevoEjercicio.repeticiones.split('x')[0] || '') + 'x' + text })}
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
          onPress={() => {}}
          colors={["#E0E0E0", "#E0E0E0"]}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
