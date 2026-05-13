import React, { useEffect, useState } from 'react';
import { View, Text, NativeModules, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const { ResourceBridge } = NativeModules;

const App = () => {
  const [uiState, setUiState] = useState({
    texto: 'Cargando recursos nativos...',
    colorTexto: '#000000',
    colorFondo: '#FFFFFF',
  });

  const fetchResources = async () => {
    try {
      const resources = await ResourceBridge.getDynamicResources();
      setUiState(resources);
    } catch (error) {
      console.error("Error al cruzar el puente:", error);
    }
  };

  useEffect(() => {
    fetchResources();
    const subscription = Dimensions.addEventListener('change', () => {
      fetchResources();
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: uiState.colorFondo }]}>

      {/* SECCIÓN 1: UI Creada puramente en React Native */}
      <View style={styles.reactNativeSection}>
        <Text style={styles.titleText}>⚛️ Capa React Native</Text>
        <Text style={styles.subtitleText}>
          Toda esta interfaz gráfica, botones y alertas están creados con JavaScript/React.
        </Text>

        <TouchableOpacity
          style={styles.reactButton}
          onPress={() => Alert.alert('¡Hola desde React Native!', 'Este botón y esta alerta son 100% de la capa de React.')}
        >
          <Text style={styles.buttonText}>Presionar Botón React</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN 2: Datos que vienen desde Android Nativo mediante el Puente */}
      <View style={styles.nativeSection}>
        <Text style={styles.titleText}>🤖 Datos del Puente Android</Text>
        <Text style={styles.subtitleText}>
          El color de fondo y el texto de abajo vienen de colors.xml y strings.xml en Android Studio.
        </Text>

        <View style={styles.nativeDataBox}>
          <Text style={[styles.nativeText, { color: uiState.colorTexto }]}>
            {uiState.texto}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bridgeButton}
          onPress={() => {
            fetchResources();
            Alert.alert('Puente', 'Se han vuelto a pedir los datos a Android.');
          }}
        >
          <Text style={styles.buttonText}>Actualizar Datos del Puente</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  reactNativeSection: {
    backgroundColor: '#20232a',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  nativeSection: {
    backgroundColor: '#3DDC84', // Android Green
    padding: 20,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitleText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 15,
    textAlign: 'center'
  },
  reactButton: {
    backgroundColor: '#61dafb', // React Blue
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  bridgeButton: {
    backgroundColor: '#073042', // Dark Android Blue
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  nativeDataBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center'
  },
  nativeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default App;