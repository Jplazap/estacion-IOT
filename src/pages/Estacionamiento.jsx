import React, { useState, useEffect } from "react";
import { useEspacios, simularCambioManual } from "../hooks/useEspacios";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";
import CuadriculaEstacionamiento from "../components/CuadriculaEstacionamiento";

export default function Estacionamiento() {
  const { espacios, resumen, cargando } = useEspacios({ simular: true });
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroColumna, setFiltroColumna] = useState("todas");
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);

  useEffect(() => {
    if (espacios.length > 0 && !espacioSeleccionado) {
      setEspacioSeleccionado(espacios[0]);
    } else if (espacioSeleccionado) {
      const actualizado = espacios.find((e) => e.id === espacioSeleccionado.id);
      if (actualizado) setEspacioSeleccionado(actualizado);
    }
  }, [espacios]);

  const espaciosFiltrados = espacios.filter((e) => {
    const cumpleEstado = filtroEstado === "todos" || e.estado === filtroEstado;
    const cumpleCol =
      filtroColumna === "todas" ||
      String(e.columna) === filtroColumna ||
      e.letraColumna === filtroColumna;
    return cumpleEstado && cumpleCol;
  });

  const descargarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(espacios, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "rtdb_estacionamiento.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={estilos.page}>
      {/* Hero Header */}
      <div style={estilos.heroContainer}>
        <div>
          <span style={estilos.subtag}>CAMPUS UTEQ · QUEVEDO</span>
          <h1 style={estilos.heroTitle}>Parqueadero inteligente</h1>
          <p style={estilos.heroSub}>
            Simulación de 80 sensores ultrasónicos organizados en cuatro columnas. Cada cuadro representa una plaza y se actualiza en tiempo real desde Firebase Realtime Database.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <button onClick={descargarJSON} style={estilos.btnJson}>
            Descargar JSON para RTDB
          </button>
          <div style={estilos.umbralText}>Umbral: ocupado si la distancia es menor a 50 cm</div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div style={estilos.resumenGrid}>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>TOTAL</span>
          <div style={estilos.resumenNum}>{resumen.total}</div>
          <span style={estilos.resumenSub}>espacios monitoreados</span>
        </div>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>DISPONIBLES</span>
          <div style={{ ...estilos.resumenNum, color: "#27ae60" }}>{resumen.libres}</div>
          <span style={estilos.resumenSub}>{Math.round(resumen.porcentajeDisponible)}% del parqueadero</span>
        </div>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>OCUPADOS</span>
          <div style={{ ...estilos.resumenNum, color: "#e74c3c" }}>{resumen.ocupados}</div>
          <span style={estilos.resumenSub}>{100 - Math.round(resumen.porcentajeDisponible)}% del parqueadero</span>
        </div>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>DISTRIBUCIÓN</span>
          <div style={estilos.resumenNum}>4 × 20</div>
          <span style={estilos.resumenSub}>columnas × espacios</span>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div style={estilos.layoutMasterDetail}>
        {/* Lado Izquierdo: Matriz de parqueadero */}
        <div style={estilos.panelIzquierdo}>
          <div style={estilos.panelHeader}>
            <div>
              <span style={estilos.subtag}>VISTA OPERATIVA</span>
              <h2 style={estilos.sectionTitle}>Disponibilidad por espacio</h2>
            </div>
            <div style={estilos.leyenda}>
              <span><span style={{ color: "#27ae60" }}>●</span> Libre</span>
              <span><span style={{ color: "#e74c3c" }}>●</span> Ocupado</span>
              <span><span style={{ color: "#2ecc71" }}>○</span> Seleccionado</span>
            </div>
          </div>

          {/* Filtros */}
          <div style={estilos.filtrosRow}>
            <div style={estilos.btnGroup}>
              {["todos", "libre", "ocupado"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFiltroEstado(st)}
                  style={{
                    ...estilos.btnFiltro,
                    ...(filtroEstado === st ? estilos.btnFiltroActivo : {}),
                  }}
                >
                  {st.charAt(0).toUpperCase() + st.slice(1)}s
                </button>
              ))}
            </div>

            <div style={estilos.btnGroup}>
              {["todas", "A", "B", "C", "D"].map((col) => (
                <button
                  key={col}
                  onClick={() => setFiltroColumna(col)}
                  style={{
                    ...estilos.btnFiltro,
                    ...(filtroColumna === col ? estilos.btnFiltroActivo : {}),
                  }}
                >
                  {col === "todas" ? "Todas" : col}
                </button>
              ))}
            </div>
          </div>

          {cargando ? (
            <p style={{ padding: 20 }}>Cargando datos de Firebase...</p>
          ) : (
            <CuadriculaEstacionamiento
              espacios={espaciosFiltrados}
              espacioSeleccionado={espacioSeleccionado}
              onSeleccionarEspacio={setEspacioSeleccionado}
            />
          )}
        </div>

        {/* Lado Derecho: Panel de Sensor Seleccionado */}
        {espacioSeleccionado && (
          <PanelSensorSeleccionado espacio={espacioSeleccionado} />
        )}
      </div>
    </div>
  );
}

function PanelSensorSeleccionado({ espacio }) {
  const { historial } = useHistorialEspacio(espacio.id);
  const porcentajeDistancia = Math.min(100, Math.max(0, (espacio.distanciaDetectada / 200) * 100));

  const codigoCorto = `${espacio.letraColumna || ["A", "B", "C", "D"][espacio.columna - 1]}${String(espacio.numero).padStart(2, "0")}`;

  return (
    <div style={estilos.panelDerecho}>
      <span style={estilos.subtag}>SENSOR SELECCIONADO</span>
      <div style={estilos.headerSensor}>
        <h2 style={{ fontSize: 28, margin: 0 }}>{codigoCorto}</h2>
        <span
          style={{
            ...estilos.badgeEstado,
            backgroundColor: espacio.estado === "libre" ? "#e8f8f0" : "#fde8e8",
            color: espacio.estado === "libre" ? "#27ae60" : "#e74c3c",
          }}
        >
          {espacio.estado.toUpperCase()}
        </span>
      </div>

      {/* Indicador de distancia */}
      <div style={estilos.boxDistancia}>
        <span style={{ fontSize: 11, color: "#7f8c8d" }}>Distancia detectada</span>
        <div style={{ fontSize: 32, fontWeight: "bold", margin: "4px 0" }}>
          {espacio.distanciaDetectada} <span style={{ fontSize: 16, fontWeight: "normal" }}>cm</span>
        </div>
        <div style={estilos.progressBarBg}>
          <div
            style={{
              ...estilos.progressBarFill,
              width: `${porcentajeDistancia}%`,
              backgroundColor: espacio.estado === "libre" ? "#27ae60" : "#e74c3c",
            }}
          />
        </div>
        <span style={{ fontSize: 10, color: "#95a5a6", marginTop: 4, display: "block" }}>
          Umbral del sensor: 50 cm
        </span>
      </div>

      {/* Metadatos */}
      <div style={estilos.metadatos}>
        <div style={estilos.metaItem}>
          <span style={estilos.metaLabel}>ID RTDB</span>
          <span style={estilos.metaVal}>{espacio.id}</span>
        </div>
        <div style={estilos.metaItem}>
          <span style={estilos.metaLabel}>COLUMNA / NÚMERO</span>
          <span style={estilos.metaVal}>{espacio.letraColumna || espacio.columna} / {espacio.numero}</span>
        </div>
        <div style={estilos.metaItem}>
          <span style={estilos.metaLabel}>CENTRO GEOGRÁFICO</span>
          <span style={estilos.metaVal}>
            {espacio.ubicacion?.latitud?.toFixed(6)}, {espacio.ubicacion?.longitud?.toFixed(6)}
          </span>
        </div>
        <div style={estilos.metaItem}>
          <span style={estilos.metaLabel}>ÚLTIMA ACTUALIZACIÓN</span>
          <span style={estilos.metaVal}>
            {espacio.fechaHora ? new Date(espacio.fechaHora).toLocaleTimeString("es-EC") : "—"}
          </span>
        </div>
      </div>

      {/* Historial Reciente */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: "bold", fontSize: 13 }}>Historial reciente</span>
          <span style={{ fontSize: 11, color: "#7f8c8d" }}>{historial.length} eventos</span>
        </div>

        <div style={estilos.listaHistorial}>
          {historial.slice(0, 5).map((h, i) => (
            <div key={i} style={estilos.itemHistorial}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: h.estado === "libre" ? "#27ae60" : "#e74c3c" }}>●</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: "bold" }}>{h.estado === "libre" ? "Libre" : "Ocupado"}</div>
                  <div style={{ fontSize: 10, color: "#95a5a6" }}>
                    {new Date(h.fechaHora).toLocaleTimeString("es-EC")}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: "bold" }}>{h.distanciaDetectada} cm</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => simularCambioManual(espacio.id)}
        style={estilos.btnSimular}
      >
        Simular cambio de estado
      </button>
    </div>
  );
}

const estilos = {
  page: { maxWidth: 1240, margin: "0 auto", padding: "20px 24px" },
  heroContainer: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  subtag: { fontSize: 10, fontWeight: "bold", color: "#27ae60", letterSpacing: 1 },
  heroTitle: { fontSize: 28, margin: "4px 0" },
  heroSub: { fontSize: 13, color: "#7f8c8d", maxWidth: 600 },
  btnJson: { backgroundColor: "#0b522c", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  umbralText: { fontSize: 11, color: "#95a5a6", marginTop: 4 },
  resumenGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  cardResumen: { backgroundColor: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0" },
  resumenLabel: { fontSize: 10, fontWeight: "bold", color: "#95a5a6" },
  resumenNum: { fontSize: 28, fontWeight: "bold", margin: "4px 0" },
  resumenSub: { fontSize: 11, color: "#7f8c8d" },
  layoutMasterDetail: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  panelIzquierdo: { backgroundColor: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, margin: 0 },
  leyenda: { display: "flex", gap: 12, fontSize: 12, color: "#7f8c8d" },
  filtrosRow: { display: "flex", gap: 16, marginBottom: 16 },
  btnGroup: { display: "flex", backgroundColor: "#f1f5f9", borderRadius: 8, padding: 2 },
  btnFiltro: { border: "none", backgroundColor: "transparent", padding: "6px 12px", fontSize: 12, borderRadius: 6, cursor: "pointer", color: "#64748b" },
  btnFiltroActivo: { backgroundColor: "#fff", color: "#0f172a", fontWeight: "bold", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  panelDerecho: { backgroundColor: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0", height: "fit-content" },
  headerSensor: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 16 },
  badgeEstado: { padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold" },
  boxDistancia: { backgroundColor: "#f8fafc", borderRadius: 8, padding: 12, border: "1px solid #f1f5f9" },
  progressBarBg: { backgroundColor: "#e2e8f0", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", transition: "width 0.3s ease" },
  metadatos: { marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 12 },
  metaItem: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 },
  metaLabel: { color: "#94a3b8" },
  metaVal: { fontWeight: "600", color: "#334155" },
  listaHistorial: { display: "flex", flexDirection: "column", gap: 8 },
  itemHistorial: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f8fafc" },
  btnSimular: { width: "100%", marginTop: 20, padding: 10, backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: "bold", cursor: "pointer", color: "#334155" },
};