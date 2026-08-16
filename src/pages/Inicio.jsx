
// src/pages/Inicio.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <div style={estilos.contenedor}>
      <p style={estilos.kicker}>CAMPUS UTEQ · QUEVEDO</p>
      <h1 style={estilos.titulo}>Parqueadero inteligente</h1>
      <p style={estilos.descripcion}>
        Simulación de 80 sensores ultrasónicos organizados en cuatro columnas.
        Cada cuadro representa una plaza y se actualiza como si recibiera
        eventos en tiempo real desde Firebase Realtime Database. La
        aplicación calcula automáticamente el estado (libre u ocupado) según
        la distancia detectada por cada sensor, y permite consultar
        estadísticas globales, el historial de cada espacio y su ubicación
        real dentro del campus.
      </p>

      <div style={estilos.datos}>
        <Dato titulo="80" subtitulo="espacios monitoreados" />
        <Dato titulo="4 × 20" subtitulo="columnas x espacios" />
        <Dato titulo="RTDB" subtitulo="Firebase Realtime Database" />
      </div>

      <Link to="/estacionamiento" style={estilos.boton}>
        Ir al estacionamiento →
      </Link>
    </div>
  );
}

function Dato({ titulo, subtitulo }) {
  return (
    <div style={estilos.dato}>
      <span style={estilos.datoTitulo}>{titulo}</span>
      <span style={estilos.datoSub}>{subtitulo}</span>
    </div>
  );
}

const estilos = {
  contenedor: { maxWidth: 760, margin: "40px auto", padding: "0 20px" },
  kicker: {
    color: "#1e8f4e",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: { fontSize: 40, margin: "0 0 16px", color: "#1b1f24" },
  descripcion: { fontSize: 16, lineHeight: 1.6, color: "#4a545c", marginBottom: 32 },
  datos: { display: "flex", gap: 32, marginBottom: 32 },
  dato: { display: "flex", flexDirection: "column" },
  datoTitulo: { fontSize: 26, fontWeight: 800, color: "#1b1f24" },
  datoSub: { fontSize: 12, color: "#8a95a1" },
  boton: {
    display: "inline-block",
    backgroundColor: "#1e8f4e",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
  },
};
