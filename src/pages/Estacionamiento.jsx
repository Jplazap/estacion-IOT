// src/pages/Estacionamiento.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useEspacios, simularCambioManual } from "../hooks/useEspacios";
import { useHistorialEspacio } from "../hooks/useHistorialEspacio";
import CuadriculaEstacionamiento from "../components/CuadriculaEstacionamiento";
import MapaEstacionamiento from "../components/MapaEstacionamiento";

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
          <div style={estilos.resumenNum}>{resumen?.total || 80}</div>
          <span style={estilos.resumenSub}>espacios monitoreados</span>
        </div>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>DISPONIBLES</span>
          <div style={{ ...estilos.resumenNum, color: "#10b981" }}>{resumen?.libres || 0}</div>
          <span style={estilos.resumenSub}>{Math.round(resumen?.porcentajeDisponible || 0)}% del parqueadero</span>
        </div>
        <div style={estilos.cardResumen}>
          <span style={estilos.resumenLabel}>OCUPADOS</span>
          <div style={{ ...estilos.resumenNum, color: "#f87171" }}>{resumen?.ocupados || 0}</div>
          <span style={estilos.resumenSub}>{100 - Math.round(resumen?.porcentajeDisponible || 0)}% del parqueadero</span>
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
              <span><span style={{ color: "#10b981" }}>●</span> Libre</span>
              <span><span style={{ color: "#f87171" }}>●</span> Ocupado</span>
              <span><span style={{ color: "#38bdf8" }}>○</span> Seleccionado</span>
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
            <p style={{ padding: 20, color: "#8a95a1" }}>Cargando datos de Firebase...</p>
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

      {/* Mapa de Geolocalización Leaflet */}
      <MapaEstacionamiento
        espacios={espacios}
        espacioSeleccionado={espacioSeleccionado}
        onSelectEspacio={setEspacioSeleccionado}
      />
    </div>
  );
}

function PanelSensorSeleccionado({ espacio }) {
  const { historial } = useHistorialEspacio(espacio.id);
  const porcentajeDistancia = Math.min(100, Math.max(0, (espacio.distanciaDetectada / 200) * 100));
  const esLibre = espacio.estado === "libre" || espacio.estado === "Disponible";

  const codigoCorto = `${espacio.letraColumna || ["A", "B", "C", "D"][espacio.columna - 1]}${String(espacio.numero).padStart(2, "0")}`;

  return (
    <div style={estilos.panelDerecho}>
      <span style={estilos.subtag}>SENSOR SELECCIONADO</span>
      <div style={estilos.headerSensor}>
        <h2 style={{ fontSize: 28, margin: 0, color: "#ffffff" }}>{codigoCorto}</h2>
        <span
          style={{
            ...estilos.badgeEstado,
            backgroundColor: esLibre ? "rgba(16, 185, 129, 0.15)" : "rgba(248, 113, 113, 0.15)",
            color: esLibre ? "#10b981" : "#f87171",
          }}
        >
          {espacio.estado.toUpperCase()}
        </span>
      </div>

      {/* Indicador de distancia */}
      <div style={estilos.boxDistancia}>
        <span style={{ fontSize: 11, color: "#8a95a1" }}>Distancia detectada</span>
        <div style={{ fontSize: 32, fontWeight: "bold", margin: "4px 0", color: "#ffffff" }}>
          {espacio.distanciaDetectada} <span style={{ fontSize: 16, fontWeight: "normal", color: "#8a95a1" }}>cm</span>
        </div>
        <div style={estilos.progressBarBg}>
          <div
            style={{
              ...estilos.progressBarFill,
              width: `${porcentajeDistancia}%`,
              backgroundColor: esLibre ? "#10b981" : "#f87171",
            }}
          />
        </div>
        <span style={{ fontSize: 10, color: "#8a95a1", marginTop: 6, display: "block" }}>
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
            {espacio.fechaHora || espacio.fechaActualizacion
              ? new Date(espacio.fechaHora || espacio.fechaActualizacion).toLocaleTimeString("es-EC")
              : "En vivo"}
          </span>
        </div>
      </div>

      {/* Historial Reciente */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: "bold", fontSize: 13, color: "#ffffff" }}>Historial reciente</span>
          <span style={{ fontSize: 11, color: "#8a95a1" }}>{historial.length} eventos</span>
        </div>

        <div style={estilos.listaHistorial}>
          {historial.slice(0, 4).map((h, i) => (
            <div key={i} style={estilos.itemHistorial}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: h.estado === "libre" ? "#10b981" : "#f87171" }}>●</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: "#e2e8f0" }}>
                    {h.estado === "libre" ? "Libre" : "Ocupado"}
                  </div>
                  <div style={{ fontSize: 10, color: "#8a95a1" }}>
                    {new Date(h.fecha || h.fechaHora || Date.now()).toLocaleTimeString("es-EC")}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: "bold", color: "#60a5fa" }}>
                {h.distancia || h.distanciaDetectada} cm
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
        <button
          onClick={() => simularCambioManual(espacio.id)}
          style={estilos.btnSimular}
        >
          Simular cambio de estado
        </button>

        <Link
          to={`/espacios/${espacio.id}`}
          style={estilos.btnDetalle}
        >
          Ver Detalle Completo →
        </Link>
      </div>
    </div>
  );
}

const estilos = {
  page: { maxWidth: 1280, margin: "0 auto", padding: "24px", color: "#e2e8f0" },
  heroContainer: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  subtag: { fontSize: 10, fontWeight: "bold", color: "#10b981", letterSpacing: 1 },
  heroTitle: { fontSize: 28, margin: "4px 0", color: "#ffffff" },
  heroSub: { fontSize: 13, color: "#8a95a1", maxWidth: 600, lineHeight: 1.5 },
  btnJson: { backgroundColor: "#0b522c", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: "bold", cursor: "pointer" },
  umbralText: { fontSize: 11, color: "#8a95a1", marginTop: 6 },
  resumenGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  cardResumen: { backgroundColor: "#1b2228", borderRadius: 12, padding: 16, border: "1px solid #28323c" },
  resumenLabel: { fontSize: 10, fontWeight: "bold", color: "#8a95a1" },
  resumenNum: { fontSize: 28, fontWeight: "bold", margin: "4px 0", color: "#ffffff" },
  resumenSub: { fontSize: 11, color: "#8a95a1" },
  layoutMasterDetail: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  panelIzquierdo: { backgroundColor: "#1b2228", borderRadius: 12, padding: 20, border: "1px solid #28323c" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, margin: 0, color: "#ffffff" },
  leyenda: { display: "flex", gap: 12, fontSize: 12, color: "#8a95a1" },
  filtrosRow: { display: "flex", gap: 16, marginBottom: 16 },
  btnGroup: { display: "flex", backgroundColor: "#11171d", borderRadius: 8, padding: 3, border: "1px solid #28323c" },
  btnFiltro: { border: "none", backgroundColor: "transparent", padding: "6px 12px", fontSize: 12, borderRadius: 6, cursor: "pointer", color: "#8a95a1" },
  btnFiltroActivo: { backgroundColor: "#1b2228", color: "#ffffff", fontWeight: "bold" },
  panelDerecho: { backgroundColor: "#1b2228", borderRadius: 12, padding: 20, border: "1px solid #28323c", height: "fit-content" },
  headerSensor: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, marginBottom: 16 },
  badgeEstado: { padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold" },
  boxDistancia: { backgroundColor: "#11171d", borderRadius: 8, padding: 12, border: "1px solid #28323c" },
  progressBarBg: { backgroundColor: "#28323c", height: 6, borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", transition: "width 0.3s ease" },
  metadatos: { marginTop: 16, borderTop: "1px solid #28323c", paddingTop: 12 },
  metaItem: { display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 },
  metaLabel: { color: "#8a95a1" },
  metaVal: { fontWeight: "600", color: "#cbd5e1" },
  listaHistorial: { display: "flex", flexDirection: "column", gap: 8 },
  itemHistorial: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #28323c" },
  btnSimular: { width: "100%", padding: "10px", backgroundColor: "#28323c", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer", color: "#ffffff" },
  btnDetalle: { display: "block", textAlign: "center", width: "100%", padding: "10px", backgroundColor: "#10b981", color: "#0d131a", borderRadius: 8, fontWeight: "bold", textDecoration: "none", boxSizing: "border-box" }
};