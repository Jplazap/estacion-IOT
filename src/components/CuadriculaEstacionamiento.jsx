import React from "react";

export default function CuadriculaEstacionamiento({ espacios, espacioSeleccionado, onSeleccionarEspacio }) {
  const columnas = [1, 2, 3, 4];
  const letras = ["A", "B", "C", "D"];

  return (
    <div style={estilos.contenedorMatriz}>
      <div style={estilos.headerEntrada}>
        ENTRADA — — — — — — — — — — — — — — — — — — — — —
      </div>

      <div style={estilos.encabezadosColumnas}>
        {letras.map((l) => (
          <div key={l} style={estilos.tituloCol}>COLUMNA {l}</div>
        ))}
      </div>

      <div style={estilos.gridMatriz}>
        {Array.from({ length: 20 }).map((_, filaIndex) => (
          <React.Fragment key={filaIndex}>
            {columnas.map((colNum, colIndex) => {
              const esp = espacios.find(
                (e) => (e.columna === colNum || e.letraColumna === letras[colIndex]) && e.numero === filaIndex + 1
              );

              if (!esp) return <div key={`${colNum}-${filaIndex}`} style={estilos.slotVacio} />;

              const esOcupado = esp.estado === "ocupado";
              const esSeleccionado = espacioSeleccionado?.id === esp.id;
              const codigoCorto = `${letras[colIndex]}${String(esp.numero).padStart(2, "0")}`;

              return (
                <div
                  key={esp.id}
                  onClick={() => onSeleccionarEspacio(esp)}
                  style={{
                    ...estilos.slot,
                    backgroundColor: esOcupado ? "#dc3545" : "#242d35",
                    borderColor: esSeleccionado ? "#2ecc71" : "transparent",
                    boxShadow: esSeleccionado ? "0 0 0 2px #2ecc71" : "none",
                  }}
                >
                  <div style={estilos.slotHeader}>
                    <span style={{ fontWeight: "bold", color: esOcupado ? "#fff" : "#8a9a86" }}>
                      {codigoCorto}
                    </span>
                  </div>

                  {esOcupado ? (
                    <div style={estilos.autoIcon}>
                      <svg width="28" height="14" viewBox="0 0 24 12" fill="#ffffff">
                        <rect x="2" y="4" width="20" height="6" rx="2" />
                        <circle cx="6" cy="10" r="2" fill="#333" />
                        <circle cx="18" cy="10" r="2" fill="#333" />
                        <path d="M5 4L8 1H16L19 4Z" fill="#ffffff" />
                      </svg>
                      <span style={estilos.distanciaText}>{esp.distanciaDetectada} cm</span>
                    </div>
                  ) : (
                    <div style={estilos.slotLibreText}>
                      <span>LIBRE</span>
                      <span style={{ fontSize: 10 }}>{esp.distanciaDetectada} cm</span>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const estilos = {
  contenedorMatriz: {
    backgroundColor: "#192026",
    borderRadius: 12,
    padding: 20,
    color: "#fff",
  },
  headerEntrada: {
    textAlign: "center",
    fontSize: 11,
    letterSpacing: 2,
    color: "#6c7a89",
    marginBottom: 15,
    fontWeight: "bold",
  },
  encabezadosColumnas: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  tituloCol: { fontSize: 11, fontWeight: "bold", color: "#8a9a86" },
  gridMatriz: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
  },
  slotVacio: { height: 42, backgroundColor: "#202830", borderRadius: 6 },
  slot: {
    height: 44,
    borderRadius: 6,
    padding: "4px 8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  slotHeader: { fontSize: 11 },
  autoIcon: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  distanciaText: { fontSize: 11, fontWeight: "bold", color: "#fff" },
  slotLibreText: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 10,
    color: "#4a5d6e",
    fontWeight: "bold",
  },
};