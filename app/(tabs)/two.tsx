import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar saldo cada vez que la pantalla gana foco (por si ganó tokens en la Tab 1)
  useFocusEffect(
    useCallback(() => {
      fetchBalance();
    }, [])
  );

  const fetchBalance = async () => {
    try {
      const response = await fetch('https://beta.mxwithme.com/wp-json/mxwm/v1/aztec-sync/balance');
      const data = await response.json();
      if (response.ok && data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (e) {
      console.error("Error fetching balance", e);
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      "¿Eliminar cuenta permanentemente?",
      "Esta acción no se puede deshacer. Perderás todos tus tokens y registros.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "ELIMINAR",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch('https://beta.mxwithme.com/wp-json/mxwm/v1/auth/delete', {
                method: 'DELETE' // Requiere autenticación (cookies/session)
              });
              const data = await response.json();
              if (data.status === 'success') {
                Alert.alert("Cuenta Eliminada", "Tu cuenta ha sido borrada exitosamente.");
                // Aquí se debería redirigir al Login/Signup
                router.replace('/sign-up');
              } else {
                Alert.alert("Error", data.message || "No se pudo eliminar la cuenta.");
              }
            } catch (e) {
              Alert.alert("Error", "Fallo de conexión.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    // Simular logout y enviar a registro/login
    router.replace('/sign-up');
  };

  return (
    <LinearGradient colors={['#000000', '#111111']} style={styles.container}>
      {/* Ocultar Header Nativo */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* HEADER PERFIL */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <Text style={styles.userName}>Viajero del Tiempo</Text>
            <Text style={styles.userRole}>Sincronizador Activo</Text>
          </View>

          {/* ESTADÍSTICAS */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Ciclo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Días</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#00F0FF' }]}>
                {balance !== null ? balance : '-'}
              </Text>
              <Text style={styles.statLabel}>TOKENS</Text>
            </View>
          </View>

          {/* HISTORIAL */}
          <Text style={styles.sectionTitle}>TU HISTORIAL</Text>

          <View style={styles.historyPlaceholder}>
            <Text style={styles.placeholderText}>
              Aún no hay suficientes datos para establecer patrones.
            </Text>
            <Text style={styles.placeholderSubtext}>
              Se requieren al menos 2 ciclos de 20 días para revelar tu ortocronobiología personal.
            </Text>
            <View style={styles.timelineLine} />

            {/* Ejemplo visual de tarjeta */}
            <View style={styles.card}>
              <Text style={styles.cardDate}>HOY</Text>
              <Text style={styles.cardTitle}>Inicio del Viaje</Text>
              <Text style={styles.cardStatus}>Sincronizado</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/settings')}>
            <Text style={styles.actionText}>Configuración</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.actionText, { color: '#FF4081' }]}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Botón Eliminar Cuenta (Requisito Play Store) */}
          <TouchableOpacity style={styles.deleteLink} onPress={deleteAccount}>
            <Text style={styles.deleteLinkText}>Eliminar mi cuenta</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#FF4081" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingTop: 20, paddingBottom: 200, alignItems: 'center' }, // Ajustado padding superior

  // Perfil
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00F0FF', marginBottom: 15 },
  avatarText: { color: '#00F0FF', fontSize: 40, fontWeight: 'bold' },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 },
  userRole: { color: '#888', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginTop: 5 },

  // Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '90%', backgroundColor: '#111', borderRadius: 15, padding: 20, marginBottom: 30 },
  statItem: { alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#555', fontSize: 10, marginTop: 5, letterSpacing: 1 },

  // Historial
  sectionTitle: { color: '#00F0FF', fontSize: 16, fontWeight: 'bold', letterSpacing: 2, alignSelf: 'flex-start', marginLeft: '5%', marginBottom: 15 },
  historyPlaceholder: { width: '90%', padding: 20, borderLeftWidth: 1, borderLeftColor: '#333' },
  placeholderText: { color: '#CCC', fontSize: 15, fontStyle: 'italic', marginBottom: 10 },
  placeholderSubtext: { color: '#666', fontSize: 13, lineHeight: 20 },
  timelineLine: { height: 20 },

  card: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 10, marginTop: 15, borderLeftWidth: 3, borderLeftColor: '#00F0FF' },
  cardDate: { color: '#666', fontSize: 10, marginBottom: 5 },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cardStatus: { color: '#00F0FF', fontSize: 10, alignSelf: 'flex-end', marginTop: 5 },

  // Botones
  actionButton: { width: '90%', padding: 15, backgroundColor: '#111', borderRadius: 10, alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: '#333' },
  logoutButton: { borderColor: '#401111', backgroundColor: 'rgba(255, 64, 129, 0.1)' },
  actionText: { color: '#CCC', fontSize: 14, fontWeight: '600' },

  // Link Eliminar
  deleteLink: { marginTop: 30, padding: 10 },
  deleteLinkText: { color: '#444', fontSize: 12, textDecorationLine: 'underline' },

  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }
});
