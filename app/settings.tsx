import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const [dailyReminder, setDailyReminder] = useState(false);
    const [minutesBeforeSunset, setMinutesBeforeSunset] = useState(60); // Default 60 mins before

    // Placeholder user info (In real app, fetch from Context/Backend)
    const userInfo = {
        username: 'ViajeroDelTiempo',
        email: 'viajero@mxwithme.com',
        level: 'Nivel 1: Explorador'
    };

    const openPrivacy = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://beta.mxwithme.com/aviso-de-privacidad/');
        } catch (e) {
            Alert.alert("Error", "No se pudo abrir el enlace.");
        }
    };

    return (
        <LinearGradient colors={['#000000', '#111']} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>AJUSTES</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* 1. PERFIL (Solo Lectura) */}
                    <Text style={styles.sectionHeader}>PERFIL</Text>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{userInfo.username.charAt(0)}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.label}>Usuario</Text>
                            <Text style={styles.value}>{userInfo.username}</Text>

                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{userInfo.email}</Text>

                            <Text style={styles.label}>Nivel</Text>
                            <Text style={[styles.value, { color: '#00F0FF' }]}>{userInfo.level}</Text>
                        </View>
                    </View>

                    {/* 2. NOTIFICACIONES */}
                    <Text style={styles.sectionHeader}>NOTIFICACIONES</Text>
                    <View style={styles.settingsGroup}>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Recordatorio Diario</Text>
                            <Switch
                                value={dailyReminder}
                                onValueChange={setDailyReminder}
                                trackColor={{ false: "#333", true: "#00F0FF" }}
                                thumbColor={dailyReminder ? "white" : "#666"}
                            />
                        </View>

                        {dailyReminder && (
                            <View style={styles.subSetting}>
                                <Text style={styles.subLabel}>
                                    Anticipación al Atardecer: <Text style={{ color: 'white' }}>{minutesBeforeSunset} min</Text>
                                </Text>
                                {/* Simulación de Selector +/- por simplicidad UI */}
                                <View style={styles.selectorRow}>
                                    <TouchableOpacity
                                        style={styles.btnAdjust}
                                        onPress={() => setMinutesBeforeSunset(Math.max(10, minutesBeforeSunset - 10))}
                                    >
                                        <Text style={styles.btnAdjustText}>-</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.timeSimulation}>(Aprox 18:00 hrs)</Text>

                                    <TouchableOpacity
                                        style={styles.btnAdjust}
                                        onPress={() => setMinutesBeforeSunset(Math.min(180, minutesBeforeSunset + 10))}
                                    >
                                        <Text style={styles.btnAdjustText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                    </View>

                    {/* 3. PRIVACIDAD */}
                    <Text style={styles.sectionHeader}>LEGAL</Text>
                    <TouchableOpacity style={styles.linkButton} onPress={openPrivacy}>
                        <Text style={styles.linkText}>Términos y Aviso de Privacidad</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222', backgroundColor: '#050505' },
    backButton: { paddingRight: 20 },
    backText: { color: '#00F0FF', fontSize: 16 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

    scrollContent: { padding: 20 },
    sectionHeader: { color: '#666', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15, marginTop: 10 },

    // Profile
    profileCard: { flexDirection: 'row', backgroundColor: '#111', padding: 20, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
    avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', marginRight: 20, borderWidth: 1, borderColor: '#444' },
    avatarText: { color: '#00F0FF', fontSize: 24, fontWeight: 'bold' },
    infoContainer: { flex: 1 },
    label: { color: '#666', fontSize: 10, textTransform: 'uppercase', marginBottom: 2 },
    value: { color: 'white', fontSize: 15, marginBottom: 10, fontWeight: '500' },

    // Settings Group
    settingsGroup: { backgroundColor: '#111', borderRadius: 15, padding: 10, marginBottom: 20 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
    settingLabel: { color: 'white', fontSize: 16 },

    subSetting: { paddingHorizontal: 15, paddingBottom: 15, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 15 },
    subLabel: { color: '#CCC', fontSize: 14, marginBottom: 10 },
    selectorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    btnAdjust: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#444' },
    btnAdjustText: { color: '#00F0FF', fontSize: 20, fontWeight: 'bold' },
    timeSimulation: { color: '#666', fontSize: 12, fontStyle: 'italic' },

    // Legal
    linkButton: { backgroundColor: '#111', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    linkText: { color: 'white', fontSize: 15 },
    arrow: { color: '#666', fontSize: 20, fontWeight: 'bold' }
});
