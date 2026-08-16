// src/components/HistorialEspacio.jsx
import React from "react";

function formatearFecha(timestamp) {
  if (!timestamp) return "—";
  const fecha = new Date(timestamp);
  return fecha.toLocaleString("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function HistorialEspacio({ historial, cargando }) {
  if (cargando) {
    return <p style={{ color: "#8a95a1" }}>Cargando historial…</p>;
  }

  if (!historial || historial.length === 0) {
    return <p style={{ color: "#8a95a1" }}>Aún no hay eventos registrados para este espacio.</p>;
  }

  return (
    <div>
      <p style={estilos.contador}>{historial.length} eventos</p>
      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.th}>Estado</th>
            <th style={estilos.th}>Distancia</th>
            <th style={estilos.th}>Fecha y hora</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((evento) => (
            <tr key={evento.timestamp || evento.fechaHora}>
              <td style={estilos.td}>
                <span
                  style={{
                    ...estilos.badge,
                    backgroundColor: evento.estado === "libre" ? "#1e8f4e" : "#c0392b",
                  }}
                >
                  {evento.estado}
                </span>
              </td>
              <td style={estilos.td}>{evento.distanciaDetectada} cm</td>
              <td style={estilos.td}>{formatearFecha(evento.fechaHora)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const estilos = {
  contador: { fontSize: 12, color: "#8a95a1", marginBottom: 8 },
  tabla: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    padding: "8px 10px",
    borderBottom: "2px solid #e3e7ea",
    color: "#5b6670",
  },
  td: { padding: "8px 10px", borderBottom: "1px solid #eef1f3" },
  badge: {
    color: "#fff",
    borderRadius: 12,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
  },
};