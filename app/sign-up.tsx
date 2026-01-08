import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Campos incompletos", "Por favor llena todos los datos para iniciar tu viaje.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://beta.mxwithme.com/wp-json/mxwm/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.status === 201 || data.status === 'success') {
                Alert.alert("¡Bienvenido, Viajero!", "Tu registro en la Matriz ha sido exitoso.");
                // Navegar a la App principal
                router.replace('/(tabs)');
            } else {
                Alert.alert("Error de Registro", data.message || "Algo salió mal.");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#000000', '#1A0505', '#220000']} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >

                    <View style={styles.header}>
                        <Text style={styles.title}>AZTEC SYNC</Text>
                        <Text style={styles.subtitle}>Inicia tu Sincronización</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Nombre de Usuario</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. JaguarSolar"
                            placeholderTextColor="#555"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#555"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#555"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            style={styles.btnRegister}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="black" />
                            ) : (
                                <Text style={styles.btnText}>REGISTRARSE</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(tabs)')}>
                            <Text style={styles.loginText}>¿Ya tienes cuenta? <Text style={{ color: '#00F0FF' }}>Ingresar</Text></Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },

    header: { alignItems: 'center', marginBottom: 50 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#00F0FF', letterSpacing: 3, textShadowColor: '#00F0FF', textShadowRadius: 10 },
    subtitle: { color: '#888', marginTop: 10, letterSpacing: 1, textTransform: 'uppercase', fontSize: 12 },

    formContainer: { backgroundColor: 'rgba(20, 20, 20, 0.8)', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
    label: { color: '#CCC', fontSize: 12, marginBottom: 8, letterSpacing: 1, fontWeight: 'bold' },
    input: { backgroundColor: '#050505', color: 'white', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#333' },

    btnRegister: { backgroundColor: '#00F0FF', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10, shadowColor: '#00F0FF', shadowOpacity: 0.4, shadowRadius: 10 },
    btnText: { color: 'black', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

    loginLink: { marginTop: 20, alignItems: 'center' },
    loginText: { color: '#666', fontSize: 14 }
});
