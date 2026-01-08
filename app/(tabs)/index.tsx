import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router'; // Para ocultar el header nativo
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAztecTime } from '../../src/hooks/useAztecTime';

export default function HomeScreen() {
  const { currentGlyph, solarPhase, nextEvent, loading } = useAztecTime();
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // ESTADOS DE LA BITACORA COMPLETA
  const [dayTitle, setDayTitle] = useState(''); // Título del día

  // 4 Preguntas Binarias (Los Cuatro Acuerdos)
  const [binaryPersonal, setBinaryPersonal] = useState<boolean | null>(null); // Personal
  const [binaryPulcro, setBinaryPulcro] = useState<boolean | null>(null);     // Pulcro
  const [binarySuposiciones, setBinarySuposiciones] = useState<boolean | null>(null); // Suposiciones
  const [binaryEsfuerzo, setBinaryEsfuerzo] = useState<boolean | null>(null);   // Esfuerzo

  // Preguntas Profundas (Ocultas)
  const [showMore, setShowMore] = useState(false);
  const [qProgramacion, setQProgramacion] = useState(''); // Niñez/Programación
  const [qCreacion, setQCreacion] = useState('');     // Relevancia Creativa

  const [saving, setSaving] = useState(false);

  // Función guardar en la Matriz
  const saveToMatrix = async () => {
    setSaving(true);
    try {
      // 1. Validación Flexible
      const hasContent = dayTitle || qProgramacion || qCreacion ||
        binaryPersonal !== null || binaryPulcro !== null || binarySuposiciones !== null || binaryEsfuerzo !== null;

      if (!hasContent) {
        alert("La bitácora está vacía. Escribe al menos un título o marca una opción.");
        setSaving(false);
        return;
      }

      // 2. BACKEND LOG (Tokens)
      const logPayload = {
        titulo_dia: dayTitle,
        check_personal: binaryPersonal,
        check_palabras: binaryPulcro,
        check_suposiciones: binarySuposiciones,
        check_esfuerzo: binaryEsfuerzo,
        q_programacion: qProgramacion,
        q_creacion: qCreacion,
        fecha: new Date().toISOString(), // O formato simple si prefiere
        glifo_nombre: currentGlyph.name,
        // Datos extra para contexto si el backend los aceptara, pero nos ceñimos a lo solicitado
      };

      const logResponse = await fetch('https://beta.mxwithme.com/wp-json/mxwm/v1/aztec-sync/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayload)
      });
      const logData = await logResponse.json();

      let tokensEarned = 0;
      let logMessage = '';

      if (logData.status === 'success') {
        tokensEarned = logData.tokens_ganados;
        logMessage = `¡Has ganado ${tokensEarned} Tokens!`;
      } else {
        console.warn("Log Error:", logData);
        // No bloqueamos la IA si falla el log, pero avisamos
        logMessage = '(Error guardando tokens)';
      }

      // 3. IA SYNTHESIS (Gemini)
      const aiPrompt = `
        CONTEXTO ORTOCRONOBIOLÓGICO:
        Glifo de hoy: ${currentGlyph.name} (${currentGlyph.meaning}).
        Fase Solar al registro: ${solarPhase}.
        
        REGISTRO DEL USUARIO:
        Título del Día: "${dayTitle}"
        
        AUTO-EVALUACIÓN (LOS CUATRO ACUERDOS):
        1. Tomó cosas personal: ${binaryPersonal === true ? 'SÍ' : (binaryPersonal === false ? 'NO' : '-')}
        2. Pulcro con palabras: ${binaryPulcro === true ? 'SÍ' : (binaryPulcro === false ? 'NO' : '-')}
        3. Hizo suposiciones: ${binarySuposiciones === true ? 'SÍ' : (binarySuposiciones === false ? 'NO' : '-')}
        4. Hizo su mejor esfuerzo: ${binaryEsfuerzo === true ? 'SÍ' : (binaryEsfuerzo === false ? 'NO' : '-')}

        REFLEXIONES PROFUNDAS:
        1. Programación/Niñez a transformar: ${qProgramacion || 'Sin registro'}
        2. Creación relevante del día: ${qCreacion || 'Sin registro'}

        SOLICITUD:
        Actúa como un Analista Ortocronobiológico Científico-Espiritual.
        Dame una síntesis profunda pero breve (máx 60 palabras) que conecte el GLIFO DE HOY con mis respuestas.
        Si mis respuestas a los acuerdos indican desequilibrio (ej. SÍ tomé personal, NO fui impecable, SÍ supuse, NO me esforcé), dame un consejo para transmutarlo bajo la energía de ${currentGlyph.name}.
        Mantén un tono serio, elevado y empático.
      `;

      const aiResponse = await fetch('https://beta.mxwithme.com/wp-json/mxwm/v1/aztec-sync/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const aiData = await aiResponse.json();

      if (aiData.status === 'success' && aiData.ai_response) {
        alert(`${logMessage}\n\nSÍNTESIS ORTOCRONOBIOLÓGICA:\n\n` + aiData.ai_response);

        // Limpiar formulario y cerrar
        setModalVisible(false);
        setDayTitle('');
        inputRef.current?.clear();
        setQProgramacion(''); setQCreacion(''); setShowMore(false);
        setBinaryPersonal(null); setBinaryPulcro(null); setBinarySuposiciones(null); setBinaryEsfuerzo(null);
      } else {
        console.log("Error Gemini:", aiData);
        alert(`${logMessage}\n\n(No se pudo generar la síntesis espiritual, pero tu bitácora fue guardada).`);
        setModalVisible(false); // Cerramos igual si se guardó el log
      }

    } catch (error) {
      console.error(error);
      alert("Error de Conexión. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  // Renderizado de Botones Sí/No con opción de desmarcar
  const BinaryOption = ({ label, value, setValue }: { label: string, value: boolean | null, setValue: (v: boolean | null) => void }) => (
    <View style={styles.binaryContainer}>
      <Text style={styles.binaryLabel}>{label}</Text>
      <View style={styles.binaryButtons}>
        <TouchableOpacity
          style={[styles.smallBtn, value === true && styles.btnYes]}
          onPress={() => setValue(value === true ? null : true)}
        >
          <Text style={[styles.btnText, value === true && { color: 'black' }]}>SÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallBtn, value === false && styles.btnNo]}
          onPress={() => setValue(value === false ? null : false)}
        >
          <Text style={[styles.btnText, value === false && { color: 'black' }]}>NO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color="#00F0FF" />
        <Text style={{ color: 'white', marginTop: 20 }}>Sincronizando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#000000', '#111']} locations={[0, 0.6, 1]} style={styles.container}>
      {/* Ocultar Barra blanca y configurara StatusBar transparente */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Contenido Principal (Scroll) */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            {/* 1. VISUALIZACIÓN DEL GLIFO */}
            <View style={styles.glyphContainer}>
              <Image
                source={currentGlyph.image}
                style={styles.glyphImage}
                resizeMode="contain"
              />
            </View>

            {/* 2. MONITOR SOLAR (Atalaya del Futuro) */}
            <View style={styles.solarContainer}>
              <Text style={styles.solarText}>{nextEvent}</Text>
            </View>

            {/* 3. INPUT TITULAR (Vinculado) */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.sacredInput}
                placeholder="Titula tu día... (5 tokens)"
                placeholderTextColor="#666"
                selectionColor="#00F0FF"
                onChangeText={setDayTitle}
                textAlign="center"
              />
            </View>

            {/* 4. BOTÓN PROFUNDIZAR */}
            <TouchableOpacity style={styles.deepButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.deepButtonText}>Profundizar Sincronización</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>

        {/* MODAL DE BITÁCORA COMPLETA */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Usamos View normal oscura en lugar de BlurView para rendimiento y estilo sólido */}
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Bitácora Profunda</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: '200' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalScrollContent}>

                <Text style={styles.sectionHeader}>AUTO-EVALUACIÓN</Text>

                <BinaryOption label="1. ¿Tomaste las cosas de manera personal? (2 tokens)" value={binaryPersonal} setValue={setBinaryPersonal} />
                <BinaryOption label="2. ¿Fuiste pulcro con tus palabras? (2 tokens)" value={binaryPulcro} setValue={setBinaryPulcro} />
                <BinaryOption label="3. ¿Hiciste suposiciones vagas? (2 tokens)" value={binarySuposiciones} setValue={setBinarySuposiciones} />
                <BinaryOption label="4. ¿Hiciste tu mejor esfuerzo? (2 tokens)" value={binaryEsfuerzo} setValue={setBinaryEsfuerzo} />

                <TouchableOpacity
                  style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10, padding: 10 }}
                  onPress={() => setShowMore(!showMore)}
                >
                  <Text style={{ color: '#666', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {showMore ? "Menos" : "Más"}
                  </Text>
                </TouchableOpacity>

                {showMore && (
                  <View>
                    <Text style={styles.label}>1. ¿Qué programación (niñez) consideras que puede ser transformada? (15 tokens)</Text>
                    <TextInput style={styles.textArea} multiline placeholderTextColor="#444" placeholder="..." value={qProgramacion} onChangeText={setQProgramacion} />

                    <Text style={styles.label}>2. ¿Qué hiciste hoy de relevancia por tus propias creaciones? (15 tokens)</Text>
                    <TextInput style={styles.textArea} multiline value={qCreacion} onChangeText={setQCreacion} />
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.btnSend, { opacity: saving ? 0.5 : 1 }]}
                  onPress={saveToMatrix}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="black" />
                  ) : (
                    <Text style={styles.btnSendText}>ENVIAR A LA MATRIZ</Text>
                  )}
                </TouchableOpacity>
                <View style={{ height: 80 }} />
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContainer: { alignItems: 'center', paddingBottom: 200, flexGrow: 1, justifyContent: 'space-evenly' },

  // Glifo
  glyphContainer: { alignItems: 'center', marginTop: 20 },
  glyphImage: { width: 360, height: 360 },

  // Solar (Texto Ajustado)
  solarContainer: { alignItems: 'center', marginVertical: 15 },
  solarText: { color: '#AAA', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, fontWeight: '600' },
  solarSubtext: { color: '#EEE', fontSize: 14, marginTop: 6, opacity: 0.5, fontWeight: '300' },

  // Input Título (Sin Borde)
  inputContainer: { width: '85%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, marginBottom: 30, marginTop: 20 },
  sacredInput: { width: '100%', color: 'white', fontSize: 22, textAlign: 'center', textAlignVertical: 'center', padding: 0, margin: 0, includeFontPadding: false, fontWeight: '300', fontStyle: 'italic' },

  // Botón Home (Neón Flotante)
  deepButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00F0FF', // Borde Cian
    // Sombra Neón
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8
  },
  deepButtonText: { color: '#00F0FF', fontWeight: '600', fontSize: 16, letterSpacing: 1, textShadowColor: 'rgba(0, 240, 255, 0.5)', textShadowRadius: 5 },

  // --- MODAL STYLES ---
  modalContainer: { flex: 1, backgroundColor: '#050505' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#222' },
  modalTitle: { color: '#00F0FF', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  modalScrollContent: { padding: 20 },

  sectionHeader: { color: '#666', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15, marginTop: 10 },
  label: { color: '#DDD', marginTop: 15, marginBottom: 8, fontSize: 15, fontWeight: '400', lineHeight: 22 },
  textArea: { backgroundColor: '#161616', color: 'white', borderRadius: 8, padding: 12, height: 80, borderColor: '#333', borderWidth: 1, textAlignVertical: 'top', fontSize: 15 },

  // Binary Options
  binaryContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingVertical: 5 },
  binaryLabel: { color: '#CCC', flex: 1, fontSize: 14 },
  binaryButtons: { flexDirection: 'row', gap: 10 },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#444' },
  btnYes: { backgroundColor: '#00F0FF', borderColor: '#00F0FF' },
  btnNo: { backgroundColor: '#FF4081', borderColor: '#FF4081' }, // Un toque rojizo para NO/ERROR
  btnText: { color: '#888', fontSize: 12, fontWeight: 'bold' },

  // Botón Enviar Final
  btnSend: { backgroundColor: '#00F0FF', borderRadius: 10, paddingVertical: 18, alignItems: 'center', marginTop: 40, shadowColor: '#00F0FF', shadowOpacity: 0.3, shadowRadius: 10 },
  btnSendText: { color: 'black', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
