// app/settings.tsx

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from './context/AuthContext';

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)');
  };

  const settingsOptions = [
    {
      title: 'Cuenta',
      options: [
        { label: 'Editar mis datos', icon: 'person-outline', onPress: () => router.push('/editProfile') },
        { label: 'Mis documentos', icon: 'document-text-outline', onPress: () => console.log('Mis documentos') },
        { label: 'Cerrar sesión', icon: 'log-out-outline', onPress: handleLogout },
      ]
    },
    {
      title: 'Pagos',
      options: [
        { label: 'Historial de transacciones', icon: 'card-outline', onPress: () => console.log('Historial') },
        { label: 'Métodos de suscripciones', icon: 'refresh-outline', onPress: () => console.log('Suscripciones') },
      ]
    },
    {
      title: 'Privacidad y seguridad',
      options: [
        { label: 'Notificaciones', icon: 'notifications-outline', onPress: () => console.log('Notificaciones') },
        { label: 'Configurar botón SOS', icon: 'shield-outline', onPress: () => router.push('/sos-config') },
      ]
    },
    {
      title: 'Términos y condiciones',
      options: [
        { label: 'Términos y condiciones', icon: 'document-outline', onPress: () => console.log('Términos') },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={styles.optionItem}
                onPress={option.onPress}
              >
                <View style={styles.optionContent}>
                  <Ionicons name={option.icon as any} size={20} color="#666" style={styles.optionIcon} />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
