// app/solicitar-ubicacion.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, {
    LatLng,
    Marker,
    Polyline,
    PROVIDER_GOOGLE,
} from 'react-native-maps';

function distanceInMeters(a: LatLng, b: LatLng) {
  const R = 6371e3;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function SolicitarUbicacionScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const mapRef = useRef<MapView>(null);

  // ---- SIMULACIÓN ----
  // Punto base (ej. Bogotá centro)
  const myLocation = useMemo<LatLng>(
    () => ({ latitude: 4.7110, longitude: -74.0721 }),
    []
  );
  // Cliente cerca (pequeño offset ~150m)
  const clientLocation = useMemo<LatLng>(
    () => ({ latitude: myLocation.latitude + 0.001, longitude: myLocation.longitude + 0.001 }),
    [myLocation]
  );
  // ---------------------

  const distance = Math.round(distanceInMeters(myLocation, clientLocation));

  const fitBoth = () => {
    mapRef.current?.fitToCoordinates([myLocation, clientLocation], {
      animated: true,
      edgePadding: { top: 80, bottom: 160, left: 80, right: 80 },
    });
  };

  const initialRegion = useMemo(() => ({
    latitude: (myLocation.latitude + clientLocation.latitude) / 2,
    longitude: (myLocation.longitude + clientLocation.longitude) / 2,
    latitudeDelta: Math.abs(myLocation.latitude - clientLocation.latitude) * 4 || 0.01,
    longitudeDelta: Math.abs(myLocation.longitude - clientLocation.longitude) * 4 || 0.01,
  }), [myLocation, clientLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onMapReady={fitBoth}
      >
        <Marker
          coordinate={myLocation}
          title="Tú"
          description="Tu ubicación simulada"
          pinColor="#2E86DE"
        />
        <Marker
          coordinate={clientLocation}
          title={name ?? 'Cliente'}
          description="Ubicación del cliente (simulada)"
          pinColor="#E74C3C"
        />
        <Polyline
          coordinates={[myLocation, clientLocation]}
          strokeWidth={3}
          strokeColor="#666"
        />
      </MapView>

      {/* Barra inferior */}
      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Ubicaciones simuladas</Text>
        <Text style={styles.desc}>
          Distancia aproximada: <Text style={styles.bold}>{distance} m</Text>
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmBtn} onPress={fitBoth}>
            <Text style={styles.confirmText}>Centrar ambos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  bottomSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555', marginBottom: 12 },
  bold: { fontWeight: '700', color: '#111' },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: { color: '#333', fontWeight: '600' },
  confirmBtn: {
    flex: 1.4,
    backgroundColor: '#25D366',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700' },
});
