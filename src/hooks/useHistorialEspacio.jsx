// src/hooks/useHistorialEspacio.jsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db, RUTA_HISTORIAL } from "../services/firebase";

export function useHistorialEspacio(id) {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    const historialRef = ref(db, `${RUTA_HISTORIAL}/${id}`);

    const unsubscribe = onValue(historialRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setHistorial([]);
      } else {
        const lista = Object.values(data).sort((a, b) => b.fechaHora - a.fechaHora);
        setHistorial(lista);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [id]);

  return { historial, cargando };
}