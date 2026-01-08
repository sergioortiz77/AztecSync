import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {

    const openTutorials = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://mxwithme.com/tutoriales-ashkan-app/');
        } catch (error) {
            Alert.alert("Error", "No se pudo abrir el navegador.");
        }
    };

    return (
        <LinearGradient colors={['#000000', '#111']} style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backText}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>AYUDA</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.mainTitle}>MANUAL DE OPERACIONES: PIEDRA DEL SOL</Text>

                    <Text style={styles.paragraph}>
                        Esta aplicación no es un diario común; es, muy posiblemente, la herramienta de ortocronobiología más sofisticada en el planeta: la Piedra del Sol.
                    </Text>

                    <Text style={styles.sectionTitle}>1. El Ciclo de 20 Días (La Base Científica)</Text>
                    <Text style={styles.paragraph}>
                        Tu biología no solo responde al ciclo circadiano (24h), sino a un ritmo mayor: el ciclo Circa Vigesimal (20 días). Cada día posee una naturaleza (personal) específica que se repite cíclicamente.
                    </Text>
                    <Text style={styles.subHeader}>El Objetivo:</Text>
                    <Text style={styles.paragraph}>Usar el Glifo (la imagen del día) como un ancla mnemotécnica.</Text>
                    <Text style={styles.subHeader}>El Mecanismo:</Text>
                    <Text style={styles.paragraph}>Al registrar tu día hoy, estás entrenando a tu cerebro. Cuando este Glifo aparezca de nuevo en 20 días, reconocerás el patrón y sabrás cómo navegar el día con ventaja.</Text>
                    <Text style={styles.subHeader}>Tu Misión:</Text>
                    <Text style={styles.paragraph}>Observa el Glifo de hoy en tu tablero para ir relacionándolo mnemotécticamente al día actual.</Text>

                    <Text style={styles.sectionTitle}>2. Posición en la Rueda</Text>
                    <Text style={styles.paragraph}>
                        Abre la Posición en la Rueda de los 20 glifos para saber en qué fase de los 20 días estás. Esto te ayuda a sincronizar tu biología nuevamente con un ciclo más armónico con tu naturaleza.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Bitácora y Tokens</Text>
                    <Text style={styles.paragraph}>
                        La introspección tiene recompensa. Gana MXWM Tokens cada vez que registras tu verdad:
                    </Text>
                    <Text style={styles.listItem}>• <Text style={styles.bold}>Titula tu día (5 Tokens):</Text> Describe tu día en una sola frase (como si titularas una novela).</Text>
                    <Text style={styles.listItem}>• <Text style={styles.bold}>Preguntas de Poder (2 Tokens):</Text> Un check rápido para ayudarte a refinar tus procesos.</Text>
                    <Text style={styles.listItem}>• <Text style={styles.bold}>Profundidad (15 Tokens):</Text> Escribe y libera tu mente.</Text>
                    <Text style={styles.paragraph}>
                        De esta manera irás nutriendo de información a la IA para que con el tiempo logre mostrarte la naturaleza predominante de cada uno de los 20 días y puedas avanzar mejor en tu vida.
                    </Text>
                    <Text style={styles.paragraph}>
                        Tus tokens son tu moneda de cambio para futuros beneficios en la comunidad.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Los 4 Acuerdos</Text>
                    <Text style={styles.paragraph}>Antes de cerrar el día, pregúntate:</Text>
                    <Text style={styles.listItem}>- ¿Fui impecable con mis palabras?</Text>
                    <Text style={styles.listItem}>- ¿Me tomé algo personal?</Text>
                    <Text style={styles.listItem}>- ¿Hice suposiciones?</Text>
                    <Text style={styles.listItem}>- ¿Hice mi máximo esfuerzo?</Text>

                    <TouchableOpacity style={styles.videoButton} onPress={openTutorials}>
                        <Text style={styles.videoButtonText}>Ver Video Tutoriales</Text>
                    </TouchableOpacity>

                    <View style={{ height: 50 }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
    backButton: { paddingRight: 20 },
    backText: { color: '#00F0FF', fontSize: 16 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    mainTitle: { color: '#00F0FF', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', letterSpacing: 1 },
    sectionTitle: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 10, letterSpacing: 0.5 },
    subHeader: { color: '#DDD', fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    paragraph: { color: '#CCC', fontSize: 15, lineHeight: 24, marginBottom: 10 },
    listItem: { color: '#CCC', fontSize: 15, lineHeight: 24, marginBottom: 5, paddingLeft: 10 },
    bold: { fontWeight: 'bold', color: 'white' },
    videoButton: { backgroundColor: '#FF0055', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 20 },
    videoButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }
});
