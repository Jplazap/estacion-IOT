// src/pages/DetalleEspacio.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db, RUTA_ESPACIOS } from "../services/firebase";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";
import HistorialEspacio from "../components/HistorialEspacio";
import { simularCambioManual } from "../hooks/useEspacios";

export default function DetalleEspacio() {
  const { id } = useParams();
  const [espacio, setEspacio] = useState(null);
  const { historial, cargando: cargandoHistorial } = useHistorialEspacio(id);

  useEffect(() => {
    const espacioRef = ref(db, `${RUTA_ESPACIOS}/${id}`);
    const unsubscribe = onValue(espacioRef, (snapshot) => {
      setEspacio(snapshot.val());
    });
    return () => unsubscribe();
  }, [id]);

  if (!espacio) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#9ca3af", background: "#111827", minHeight: "100vh" }}>
        Cargando datos del espacio {id}...
      </div>
    );
  }

  const esLibre = espacio.estado === "libre" || espacio.estado === "Disponible";
  const colorEstado = esLibre ? "#10b981" : "#f87171";
  const bbox = espacio.ubicacion?.boundingBox || { norte: -1.0124, sur: -1.0126, este: -79.4687, oeste: -79.4689 };

  return (
    <div style={{ background: "#111827", minHeight: "100vh", color: "#e5e7eb", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* Navegación y Encabezado */}
        <div>
          <Link to="/estacionamiento" style={{ color: "#10b981", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            ← Volver a Vista Operativa
          </Link>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div>
              <span style={{ fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px" }}>
                Identificación de Sensor
              </span>
              <h1 style={{ margin: 0, fontSize: 32, color: "#ffffff" }}>Espacio {espacio.id}</h1>
              <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: 14 }}>
                {espacio.ubicacion?.nombre || "Parqueadero UTEQ — Campus Quevedo"}
              </p>
            </div>

            <button 
              onClick={() => simularCambioManual(espacio.id)}
              style={{
                padding: "10px 18px",
                backgroundColor: "#10b981",
                color: "#0d131a",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Simular Lectura
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div style={{ background: "#1b2228", padding: 16, borderRadius: 10, border: "1px solid #2d3748" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" }}>Ubicación Física</span>
            <p style={{ margin: "6px 0 0 0", fontSize: 18, fontWeight: "bold" }}>
              Columna {espacio.letraColumna || espacio.columna} — N° {espacio.numero}
            </p>
          </div>

          <div style={{ background: "#1b2228", padding: 16, borderRadius: 10, border: "1px solid #2d3748" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" }}>Estado Actual</span>
            <p style={{ margin: "6px 0 0 0", fontSize: 18, fontWeight: "bold", color: colorEstado }}>
              ● {espacio.estado?.toUpperCase()}
            </p>
          </div>

          <div style={{ background: "#1b2228", padding: 16, borderRadius: 10, border: "1px solid #2d3748" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" }}>Distancia Detectada</span>
            <p style={{ margin: "6px 0 0 0", fontSize: 18, fontWeight: "bold", color: "#60a5fa" }}>
              {espacio.distanciaDetectada} cm
            </p>
          </div>

          <div style={{ background: "#1b2228", padding: 16, borderRadius: 10, border: "1px solid #2d3748" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" }}>Última Actualización</span>
            <p style={{ margin: "6px 0 0 0", fontSize: 14, fontWeight: 500, color: "#d1d5db" }}>
              {espacio.fechaActualizacion ? new Date(espacio.fechaActualizacion).toLocaleTimeString() : "En vivo"}
            </p>
          </div>
        </div>

        {/* Coordenadas y Bounding Box */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#1b2228", padding: 20, borderRadius: 10, border: "1px solid #2d3748" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16, color: "#f3f4f6" }}>Geolocalización</h3>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#9ca3af" }}>
              Latitud: <span style={{ color: "#e5e7eb", fontFamily: "monospace" }}>{espacio.ubicacion?.latitud || -1.012269}</span>
            </p>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#9ca3af" }}>
              Longitud: <span style={{ color: "#e5e7eb", fontFamily: "monospace" }}>{espacio.ubicacion?.longitud || -79.468195}</span>
            </p>
          </div>

          <div style={{ background: "#1b2228", padding: 20, borderRadius: 10, border: "1px solid #2d3748" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16, color: "#f3f4f6" }}>Bounding Box (Límites)</h3>
            <div style={{ fontFamily: "monospace", fontSize: 12, background: "#111827", padding: 10, borderRadius: 6, color: "#10b981" }}>
              Norte: {bbox.norte} | Sur: {bbox.sur}<br />
              Este: {bbox.este} | Oeste: {bbox.oeste}
            </div>
          </div>
        </div>

        {/* Historial de Lecturas */}
        <div style={{ background: "#1b2228", padding: 20, borderRadius: 10, border: "1px solid #2d3748" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: "#f3f4f6" }}>Historial de Eventos del Sensor</h3>
          <HistorialEspacio historial={historial} cargando={cargandoHistorial} />
        </div>

      </div>
    </div>
  );
}