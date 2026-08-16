// src/components/ResumenEstacionamiento.jsx
import React from "react";

export default function ResumenEstacionamiento({ resumen }) {
  const { total, libres, ocupados, porcentajeDisponible } = resumen;

  const tarjetas = [
    { etiqueta: "TOTAL", valor: total, sub: "espacios monitoreados", color: "#2f3a40" },
    {
      etiqueta: "DISPONIBLES",
      valor: libres,
      sub: `${porcentajeDisponible.toFixed(0)}% del parqueadero`,
      color: "#1e8f4e",
    },
    {
      etiqueta: "OCUPADOS",
      valor: ocupados,
      sub: `${(100 - porcentajeDisponible).toFixed(0)}% del parqueadero`,
      color: "#c0392b",
    },
    { etiqueta: "DISTRIBUCIÓN", valor: "4 × 20", sub: "columnas x espacios", color: "#2f3a40" },
  ];

  return (
    <div style={estilos.contenedor}>
      {tarjetas.map((t) => (
        <div key={t.etiqueta} style={estilos.tarjeta}>
          <span style={estilos.etiqueta}>{t.etiqueta}</span>
          <span style={{ ...estilos.valor, color: t.color }}>{t.valor}</span>
          <span style={estilos.sub}>{t.sub}</span>
        </div>
      ))}
    </div>
  );
}

const estilos = {
  contenedor: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  tarjeta: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "16px 18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  etiqueta: { fontSize: 11, fontWeight: 700, color: "#8a95a1", letterSpacing: 1 },
  valor: { fontSize: 30, fontWeight: 800 },
  sub: { fontSize: 12, color: "#8a95a1" },
};
