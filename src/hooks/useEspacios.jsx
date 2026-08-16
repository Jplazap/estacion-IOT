// src/hooks/useEspacios.jsx
import { useEffect, useState } from "react";
import { ref, onValue, set, update } from "firebase/database";
import { db, RUTA_ESPACIOS, RUTA_HISTORIAL } from "../services/firebase";
import { generar80EspaciosIniciales } from "../utils/geo";

export async function simularCambioManual(id) {
  if (!id) return;
  const nuevaDistancia = Math.floor(Math.random() * 160) + 10;
  const nuevoEstado = nuevaDistancia <= 50 ? "ocupado" : "libre";
  const now = Date.now();

  const updates = {};
  updates[`${RUTA_ESPACIOS}/${id}/distanciaDetectada`] = nuevaDistancia;
  updates[`${RUTA_ESPACIOS}/${id}/estado`] = nuevoEstado;
  updates[`${RUTA_ESPACIOS}/${id}/fechaHora`] = now;

  updates[`${RUTA_HISTORIAL}/${id}/${now}`] = {
    distanciaDetectada: nuevaDistancia,
    estado: nuevoEstado,
    fechaHora: now,
  };

  await update(ref(db), updates);
}

export function useEspacios({ simular = true } = {}) {
  const [espacios, setEspacios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const espaciosRef = ref(db, RUTA_ESPACIOS);

    const unsubscribe = onValue(
      espaciosRef,
      (snapshot) => {
        const data = snapshot.val();

        // Si la base de datos está vacía o tiene menos de 80 espacios, se reescribe con la estructura completa
        if (!data || Object.keys(data).length < 80) {
          const iniciales = generar80EspaciosIniciales();
          set(ref(db, RUTA_ESPACIOS), iniciales);
          return;
        }

        const lista = Object.values(data).sort((a, b) => {
          if (a.columna !== b.columna) return a.columna - b.columna;
          return a.numero - b.numero;
        });

        setEspacios(lista);
        setCargando(false);
      },
      (err) => {
        setError(err);
        setCargando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Simulación en vivo cada 4 segundos
  useEffect(() => {
    if (!simular || espacios.length === 0) return;

    const interval = setInterval(() => {
      const indexAleatorio = Math.floor(Math.random() * espacios.length);
      const espacioTarget = espacios[indexAleatorio];

      if (!espacioTarget) return;

      simularCambioManual(espacioTarget.id);
    }, 4000);

    return () => clearInterval(interval);
  }, [simular, espacios]);

  const total = espacios.length;
  const libres = espacios.filter((e) => e.estado === "libre").length;
  const ocupados = espacios.filter((e) => e.estado === "ocupado").length;
  const porcentajeDisponible = total > 0 ? (libres / total) * 100 : 0;

  return {
    espacios,
    cargando,
    error,
    resumen: { total, libres, ocupados, porcentajeDisponible },
  };
}