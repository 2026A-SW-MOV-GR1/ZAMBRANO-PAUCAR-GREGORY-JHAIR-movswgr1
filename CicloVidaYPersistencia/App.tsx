import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  AppState, 
  AppStateStatus, 
  ScrollView,
  StatusBar,
  useWindowDimensions
} from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const addLog = (message: string) => {
    setLogs(prev => {
      const time = new Date().toLocaleTimeString();
      return [`[${time}] ${message}`, ...prev];
    });
  };

  useEffect(() => {
    addLog('🟢 Componente Montado (App.tsx)');

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        addLog('☀️ App en Primer Plano (Active)');
      } else if (nextAppState === 'background') {
        addLog('🌙 App en Segundo Plano (Background)');
      } else if (nextAppState === 'inactive') {
        addLog('⏸️ App Inactiva (Transición)');
      }
    });

    return () => {
      addLog('🔴 Componente Desmontado');
      subscription.remove();
    };
  }, []);

  const handleAdd = () => {
    setCount(prev => prev + 1);
    addLog(`➕ Se sumó +1 al contador (Total: ${count + 1})`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ciclo de Vida & Estado</Text>
        <Text style={styles.headerSubtitle}>Taller Interactivo</Text>
      </View>

      <View style={[styles.content, isLandscape && styles.contentLandscape]}>
        {/* Counter Section */}
        <View style={[styles.card, isLandscape && styles.cardLandscape]}>
          <Text style={styles.cardTitle}>Contador Persistente</Text>
          <Text style={styles.countText}>{count}</Text>
          <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleAdd}
          >
            <Text style={styles.buttonText}>Sumar +1</Text>
          </TouchableOpacity>
        </View>

        {/* Terminal / Logs Section */}
        <View style={[styles.card, styles.terminalCard, isLandscape && styles.terminalCardLandscape]}>
          <View style={styles.terminalHeader}>
            <View style={styles.dotRed} />
            <View style={styles.dotYellow} />
            <View style={styles.dotGreen} />
            <Text style={styles.terminalTitle}>App Logs (En Vivo)</Text>
          </View>
          <ScrollView 
            style={styles.logsContainer}
            showsVerticalScrollIndicator={false}
          >
            {logs.length === 0 ? (
              <Text style={styles.logTextEmpty}>Esperando eventos...</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logText}>{log}</Text>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate 900
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentLandscape: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  card: {
    backgroundColor: '#1e293b', // Slate 800
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    // Sombra para Android
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardLandscape: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 5,
  },
  countText: {
    fontSize: 80,
    fontWeight: '900',
    color: '#38bdf8', // Light Blue 400
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#3b82f6', // Blue 500
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  terminalCard: {
    flex: 1,
    padding: 0,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  terminalCardLandscape: {
    flex: 1,
    marginBottom: 0,
    marginLeft: 10,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a', // Slate 900
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444', marginRight: 8 },
  dotYellow: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#eab308', marginRight: 8 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e', marginRight: 12 },
  terminalTitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  logsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e293b', // Slate 800
  },
  logText: {
    fontFamily: 'monospace',
    color: '#a7f3d0', // Emerald 200
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 20,
  },
  logTextEmpty: {
    fontFamily: 'monospace',
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
  }
});

export default App;
