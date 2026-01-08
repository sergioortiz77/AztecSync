// UBICACIÓN: src/hooks/useAztecTime.ts

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import SunCalc from 'suncalc';
import { AZTEC_GLYPHS } from '../data/glyphs';

// URL DE TU WORDPRESS (BACKEND)
const API_URL = 'https://beta.mxwithme.com/wp-json/mxwm/v1/aztec-sync/hoy';

// Definición de las 7 Fases Astronómicas Clave (Orden Cronológico)
// 1. Amanecer (dawn) -> Luz antes de salir el sol
// 2. Salida del Sol (sunrise) -> El sol cruza el horizonte
// 3. Mañana (Abre el día)
// 4. Medio Día (solarNoon) -> Cenit
// 5. Tarde (Cae el sol)
// 6. Puesta de Sol (sunset) -> Cambio de Día Azteca
// 7. Anochecer/Noche (nadir - medianoche técnica)

type AztecEvent = {
  name: string;
  time: Date;
  label: string;
};

export const useAztecTime = () => {
  const [dayIndex, setDayIndex] = useState<number>(0); // 0 a 19
  const [loading, setLoading] = useState(true);
  const [solarPhase, setSolarPhase] = useState<string>('Calculando...');
  const [nextEvent, setNextEvent] = useState<string>('');

  useEffect(() => {
    calculateAztecDay();
    // Actualizar cada minuto para mantener la precisión astronómica
    const interval = setInterval(calculateAztecDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateAztecDay = async () => {
    try {
      // 1. Coordenadas (GPS o Tenochtitlan)
      let coords = { latitude: 19.4326, longitude: -99.1332 };

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          coords = location.coords;
        }
      } catch (e) {
        // Fallback
      }

      const { latitude, longitude } = coords;
      const now = new Date();

      // 2. Calcular Eventos Solares (HOY y MAÑANA)
      const timesToday = SunCalc.getTimes(now, latitude, longitude);

      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const timesTomorrow = SunCalc.getTimes(tomorrow, latitude, longitude);

      // Lista maestra de eventos próximos (Horizonte de eventos completo)
      const candidates: AztecEvent[] = [
        // --- HOY ---
        { name: 'nauticalDawn', time: timesToday.nauticalDawn, label: 'Amanecer' },
        { name: 'sunrise', time: timesToday.sunrise, label: 'Salida del sol' },
        { name: 'solarNoon', time: timesToday.solarNoon, label: 'Medio día' },
        { name: 'sunset', time: timesToday.sunset, label: 'Puesta del sol' },
        { name: 'dusk', time: timesToday.dusk, label: 'Crepúsculo' },
        { name: 'nauticalDusk', time: timesToday.nauticalDusk, label: 'Anochecer' },
        { name: 'nadir', time: timesToday.nadir, label: 'Media noche' },

        // --- MAÑANA (Ciclo Completo) ---
        { name: 'nadir', time: timesTomorrow.nadir, label: 'Media noche' },
        { name: 'nauticalDawn', time: timesTomorrow.nauticalDawn, label: 'Amanecer' },
        { name: 'sunrise', time: timesTomorrow.sunrise, label: 'Salida del sol' },
        { name: 'solarNoon', time: timesTomorrow.solarNoon, label: 'Medio día' },
        { name: 'sunset', time: timesTomorrow.sunset, label: 'Puesta del sol' },
        { name: 'dusk', time: timesTomorrow.dusk, label: 'Crepúsculo' },
        { name: 'nauticalDusk', time: timesTomorrow.nauticalDusk, label: 'Anochecer' }
      ];

      // Ordenar cronológicamente
      candidates.sort((a, b) => a.time.getTime() - b.time.getTime());

      // 3. Determinar Siguiente Evento y Fase Actual
      // Buscamos el primero que sea > ahora
      const nextIdx = candidates.findIndex(e => e.time > now);

      let nextEventObj: AztecEvent | null = null;
      let prevEventObj: AztecEvent | null = null;
      let currentPhaseLabel = 'Noche Profunda'; // Default

      if (nextIdx !== -1) {
        nextEventObj = candidates[nextIdx];
        // El evento previo es el que acaba de pasar. Si nextIdx es 0, significa que estamos antes del primer evento de la lista,
        // por lo que el evento "previo" sería el último evento del ciclo anterior (el último de la lista ordenada).
        prevEventObj = candidates[nextIdx - 1] || candidates[candidates.length - 1];

        // Etiquetar la fase actual basada en el evento previo
        if (prevEventObj) {
          if (prevEventObj.name === 'nauticalDawn') currentPhaseLabel = 'Amanecer';
          else if (prevEventObj.name === 'sunrise') currentPhaseLabel = 'Mañana';
          else if (prevEventObj.name === 'solarNoon') currentPhaseLabel = 'Tarde';
          else if (prevEventObj.name === 'sunset') currentPhaseLabel = 'Crepúsculo';
          else if (prevEventObj.name === 'dusk') currentPhaseLabel = 'Anochecer';
          else if (prevEventObj.name === 'nauticalDusk') currentPhaseLabel = 'Noche';
          else if (prevEventObj.name === 'nadir') currentPhaseLabel = 'Madrugada';
        }
      } else {
        // Si no se encontró ningún evento futuro en la lista (todos pasaron),
        // esto debería ser raro con los eventos de mañana incluidos, pero como fallback,
        // asumimos que el siguiente evento es el amanecer de mañana.
        nextEventObj = { name: 'nauticalDawn', time: timesTomorrow.nauticalDawn, label: 'Amanecer' };
        currentPhaseLabel = 'Noche Profunda';
      }

      setNextEvent(`${nextEventObj?.label.toUpperCase()}: ${formatTime(nextEventObj!.time)}`);
      setSolarPhase(currentPhaseLabel);

      // 4. Calcular Glifo (Cálculo 100% Local y Seguro)
      // Regla: Día cambia en Sunset.
      // Ancla: 31 Dic 2025 (Mediodía) = Index 17 (Tecpatl).
      // Si ya pasó el sunset hoy, es 18 (Quiahuitl).

      const isAfterSunset = now > timesToday.sunset;

      const anchorDate = new Date('2025-12-31T12:00:00');
      const anchorIndex = 17; // Tecpatl

      const msPerDay = 1000 * 60 * 60 * 24;
      const currentCivilDay = new Date(now);
      currentCivilDay.setHours(12, 0, 0, 0);

      const diffTime = currentCivilDay.getTime() - anchorDate.getTime();
      const diffDays = Math.round(diffTime / msPerDay);

      let calculatedIndex = (anchorIndex + diffDays) % 20;
      if (calculatedIndex < 0) calculatedIndex += 20;

      if (isAfterSunset) {
        calculatedIndex = (calculatedIndex + 1) % 20;
      }

      setDayIndex(calculatedIndex);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return {
    dayIndex,
    currentGlyph: AZTEC_GLYPHS[dayIndex] || AZTEC_GLYPHS[0],
    solarPhase,
    nextEvent,
    loading
  };
};