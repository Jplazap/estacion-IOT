// src/pages/DetalleEspacio.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db, RUTA_ESPACIOS } from "../services/firebase";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";
import HistorialEspacio from "../components/HistorialEspacio";
import { simularCambioManual } from "../hooks/useEspacios";

export default function DetalleEspacio() {
  const { id } = useParams();
  const [espacio, setEspacio] = React.useState(null);
  const { historial, cargando: cargandoHistorial } = useHistorialEspacio(id);

  React.useEffect(() => {
    const espacioRef = ref(db, `${RUTA_ESPACIOS}/${id}`);
    const unsubscribe = onValue(espacioRef, (snapshot) => {
      setEspacio(snapshot.val());
    });
    return () => unsubscribe();
  }, [id]);

  if (!espacio) return <div style={{ padding: 20, color: "#fff" }}>Cargando espacio...</div>;

  const bbox = espacio.ubicacion?.boundingBox || {};

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", color: "#e3e7ea" }}>
      <Link to="/estacionamiento" style={{ color: "#1e8f4e", textDecoration: "none", fontWeight: 600 }}>
        ← Volver al mapa
      </Link>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 15 }}>
        <h2>Espacio: {espacio.id}</h2>
        <button 
          onClick={() => simularCambioManual(espacio.id)}
          style={{ padding: "8px 16px", backgroundColor: "#1e8f4e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          Simular Lectura de Sensor
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div style={{ background: "#1b2228", padding: 16, borderRadius: 8 }}>
          <strong>Información General</strong>
          <p>Columna: {espacio.letraColumna || espacio.columna} | Número: {espacio.numero}</p>
          <p>Estado: <span style={{ color: espacio.estado === "libre" ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>{espacio.estado}</span></p>
          <p>Distancia: {espacio.distanciaDetectada} cm</p>
          <p>Ubicación: {espacio.ubicacion?.nombre || "Parqueadero UTEQ"}</p>
        </div>

        <div style={{ background: "#1b2228", padding: 16, borderRadius: 8 }}>
          <strong>Geolocalización & Bounding Box</strong>
          <p>Latitud: {espacio.ubicacion?.latitud}</p>
          <p>Longitud: {espacio.ubicacion?.longitud}</p>
          <p style={{ fontSize: 12, color: "#8a95a1", marginTop: 8 }}>
            Bounding Box: Norte: {bbox.norte} | Sur: {bbox.sur} | Este: {bbox.este} | Oeste: {bbox.oeste}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 30, background: "#1b2228", padding: 16, borderRadius: 8 }}>
        <h3>Historial de Sensor</h3>
        <HistorialEspacio historial={historial} cargando={cargandoHistorial} />
      </div>
    </div>
  );
}