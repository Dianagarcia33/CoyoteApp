// app/sos-config.tsx

import { ButtonCustom } from '@/components/ButtonCustom';
import { InputCustom } from '@/components/InputCustom';
import { SelectDropdownCustom } from '@/components/SelectCustom';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from './context/AuthContext';

export default function SOSConfigScreen() {
  const { user, token, login } = useAuth();
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [relacion, setRelacion] = useState('');
  const [loading, setLoading] = useState(false);

  const relacionesOptions = [
    { label: 'Familiar', value: 'familiar' },
    { label: 'Amigo/a', value: 'amigo' },
    { label: 'Pareja', value: 'pareja' },
    { label: 'Padre/Madre', value: 'padre' },
    { label: 'Hermano/a', value: 'hermano' },
    { label: 'Hijo/a', value: 'hijo' },
    { label: 'Otro', value: 'otro' },
  ];

  useEffect(() => {
    if (user) {
      setNombre(user.contacto_emergencia_nombre || '');
      setTelefono(user.contacto_emergencia_telefono || '');
      setRelacion(user.contacto_emergencia_relacion || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre del contacto es requerido');
      return;
    }
    
    if (!telefono.trim()) {
      Alert.alert('Error', 'El teléfono del contacto es requerido');
      return;
    }
    
    if (!relacion) {
      Alert.alert('Error', 'La relación con el contacto es requerida');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://192.168.18.84:8000/api/update-emergency-contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contacto_emergencia_nombre: nombre,
          contacto_emergencia_telefono: telefono,
          contacto_emergencia_relacion: relacion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el contacto de emergencia');
      }

      // Actualizar el contexto con los nuevos datos
      await login(data.user, token!);
      
      Alert.alert(
        'Éxito', 
        'Contacto de emergencia actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Error al actualizar el contacto de emergencia'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurar botón SOS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#FF6A3D" />
            <Text style={styles.infoTitle}>Contacto de emergencia</Text>
          </View>
          <Text style={styles.infoText}>
            En caso de emergencia durante tu entrenamiento, el botón SOS enviará tu ubicación y 
            datos a este contacto de confianza.
          </Text>
        </View>

        <View style={styles.formSection}>
          <InputCustom
            label="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del contacto de emergencia"
            icon={
              <Ionicons name="person-outline" size={16} color="#6B7280" />
            }
          />

          <InputCustom
            label="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholder="+57 300 123 4567"
            keyboardType="phone-pad"
            icon={
              <Ionicons name="call-outline" size={16} color="#6B7280" />
            }
          />

          <SelectDropdownCustom
            value={relacion}
            setValue={setRelacion}
            options={relacionesOptions}
            placeholder="Selecciona la relación"
            icon={
              <Ionicons name="people-outline" size={16} color="#6B7280" />
            }
          />
        </View>

        <View style={styles.testSection}>
          <Text style={styles.testTitle}>¿Cómo funciona el SOS?</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Mantén presionado el botón SOS por 3 segundos</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Se enviará un SMS con tu ubicación actual</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Tu contacto recibirá la alerta inmediatamente</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ButtonCustom
            text={loading ? "Guardando..." : "Guardar configuración"}
            onPress={handleSave}
            height={50}
          />
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6A3D',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  formSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  testSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6A3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
});
