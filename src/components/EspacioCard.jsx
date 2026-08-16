// src/components/EspacioCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function EspacioCard({ espacio }) {
  const esLibre = espacio.estado === "libre";
  const colorFondo = esLibre ? "#1e8f4e" : "#c0392b";

  const horaFormateada = espacio.fechaHora
    ? new Date(espacio.fechaHora).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <Link to={`/espacios/${espacio.id}`} style={{ textDecoration: "none" }}>
      <div style={{ ...estilos.card, backgroundColor: colorFondo }}>
        <div style={estilos.idText}>{espacio.id}</div>
        <div style={estilos.colNum}>Col {espacio.letraColumna || espacio.columna} - N°{String(espacio.numero).padStart(2, '0')}</div>
        <div style={estilos.distancia}>{espacio.distanciaDetectada} cm</div>
        <div style={estilos.estadoBadge}>{espacio.estado}</div>
        <div style={estilos.hora}>Actualizado: {horaFormateada}</div>
      </div>
    </Link>
  );
}

const estilos = {
  card: {
    borderRadius: 8,
    padding: 8,
    color: "#fff",
    textAlign: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  idText: { fontSize: 13, fontWeight: "bold" },
  colNum: { fontSize: 10, opacity: 0.9 },
  distancia: { fontSize: 13, fontWeight: "700", margin: "2px 0" },
  estadoBadge: { fontSize: 10, textTransform: "uppercase", fontWeight: "bold" },
  hora: { fontSize: 9, opacity: 0.85 },
};