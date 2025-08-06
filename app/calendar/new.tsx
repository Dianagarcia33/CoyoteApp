import { ButtonCustom } from '@/components/ButtonCustom';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const minutes = [0, 15, 30, 45];
const ampm = ['AM', 'PM'];


const NewCalendarEvent = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedDate] = useState('2025-08-14');
  const [selectedHour, setSelectedHour] = useState(3);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedAMPM, setSelectedAMPM] = useState('PM');
  const [selectedCliente, setSelectedCliente] = useState(params.cliente ? String(params.cliente) : '');

  const formatFecha = (dateStr: string) => {
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const d = new Date(dateStr);
    return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Para el efecto de selector tipo "picker" visual
  // Solo muestra el valor seleccionado y el anterior/siguiente (como un picker simple)
  const renderPickerColumn = (data: number[] | string[], selected: number | string, setSelected: (v: any) => void, width: number) => {
    const selectedIdx = data.findIndex((item) => item === selected);
    const visibleItems = [
      data[selectedIdx - 1],
      data[selectedIdx],
      data[selectedIdx + 1],
    ];
    return (
      <View style={{ width, alignItems: 'center', height: 70, justifyContent: 'center' }}>
        {visibleItems.map((item, idx) => {
          if (item === undefined) {
            return <Text key={idx} style={{ height: 28 }}></Text>;
          }
          const isSelected = item === selected;
          return (
            <Text
              key={item}
              style={{
                color: isSelected ? '#222' : '#bdbdbd',
                fontWeight: isSelected ? 'bold' : 'normal',
                fontSize: isSelected ? 24 : 18,
                opacity: isSelected ? 1 : 0.5,
                marginVertical: 2,
                height: 28,
              }}
              onPress={() => setSelected(item)}
            >
              {typeof item === 'number' && item < 10 ? `0${item}` : item}
            </Text>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: Platform.OS === "ios" ? 50 : 35, paddingBottom: 12 }}>
        <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6, marginRight: 8 }} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Añadir al calendario</Text>
      </View>
      {/* Fecha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18, marginBottom: 10 }}>
        <Ionicons name="calendar-outline" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
        <Text style={{ color: '#bdbdbd', fontSize: 15 }}>{formatFecha(selectedDate)}</Text>
      </View>
      {/* Selector de hora tipo reloj */}
      <Text style={{ color: '#222', fontWeight: '500', marginLeft: 18, marginBottom: 6 }}>Hora</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18, height: 70 }}>
        {/* Horas */}
        {renderPickerColumn(hours, selectedHour, setSelectedHour, 50)}
        {/* Separador */}
        <Text style={{ fontSize: 24, color: '#bdbdbd', marginHorizontal: 2 }}>:</Text>
        {/* Minutos */}
        {renderPickerColumn(minutes, selectedMinute, setSelectedMinute, 50)}
        {/* AM/PM */}
        {renderPickerColumn(ampm, selectedAMPM, setSelectedAMPM, 50)}
      </View>
      {/* Detalles del entreno */}
      <Text style={{ color: '#222', fontWeight: '500', marginLeft: 18, marginBottom: 6 }}>Detalles del entreno</Text>
      <View style={{ marginHorizontal: 18, marginBottom: 12 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}
          onPress={() => router.push('/clientes/lista')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-outline" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
            <Text style={{ color: selectedCliente ? '#222' : '#bdbdbd', fontSize: 15, fontWeight: selectedCliente ? 'bold' : 'normal' }}>
              {selectedCliente ? selectedCliente : 'Cliente'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#bdbdbd" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}
          onPress={() => router.push('/rutinas/lista')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="options-outline" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
            <Text style={{ color: '#bdbdbd', fontSize: 15 }}>Rutina</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#bdbdbd" />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={18} color="#bdbdbd" style={{ marginRight: 8 }} />
            <Text style={{ color: '#bdbdbd', fontSize: 15 }}>Ubicación</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#bdbdbd" />
        </TouchableOpacity>
      </View>
      {/* Botón agendar abajo */}
      <View style={styles.bottomButtonContainer}>
        <ButtonCustom
          text={"Agendar entreno"}
          onPress={() => {}}
          colors={["#FF6A3D", "#ED4F56"]}
          icon={null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NewCalendarEvent;
