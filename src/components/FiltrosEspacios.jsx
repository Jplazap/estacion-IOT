// src/components/FiltrosEspacios.jsx
import React from "react";

export default function FiltrosEspacios({ filtroEstado, setFiltroEstado, filtroColumna, setFiltroColumna }) {
  return (
    <div style={estilos.contenedor}>
      <div style={estilos.grupo}>
        <span style={estilos.label}>Estado:</span>
        {["todos", "libre", "ocupado"].map((est) => (
          <button
            key={est}
            onClick={() => setFiltroEstado(est)}
            style={{
              ...estilos.btn,
              ...(filtroEstado === est ? estilos.btnActivo : {}),
            }}
          >
            {est.charAt(0).toUpperCase() + est.slice(1)}
          </button>
        ))}
      </div>

      <div style={estilos.grupo}>
        <span style={estilos.label}>Columna:</span>
        {["todas", "1", "2", "3", "4"].map((col) => (
          <button
            key={col}
            onClick={() => setFiltroColumna(col)}
            style={{
              ...estilos.btn,
              ...(filtroColumna === col ? estilos.btnActivo : {}),
            }}
          >
            {col === "todas" ? "Todas" : `Columna ${["A", "B", "C", "D"][Number(col) - 1]}`}
          </button>
        ))}
      </div>
    </div>
  );
}

const estilos = {
  contenedor: { display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 15, alignItems: "center" },
  grupo: { display: "flex", gap: 6, alignItems: "center" },
  label: { fontSize: 13, color: "#8a95a1", fontWeight: 600 },
  btn: {
    padding: "5px 12px",
    borderRadius: 16,
    border: "1px solid #333d47",
    backgroundColor: "#1b2228",
    color: "#abb2bf",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  },
  btnActivo: {
    backgroundColor: "#1e8f4e",
    color: "#fff",
    borderColor: "#1e8f4e",
  },
};