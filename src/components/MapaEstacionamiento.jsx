
// src/components/MapaEstacionamiento.jsx
// Requiere: npm install leaflet react-leaflet
// Y en tu index.html o main.jsx: import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, Rectangle, CircleMarker, Popup, Polygon } from "react-leaflet";
import { PUNTOS, BOUNDING_BOX_GENERAL } from "../utils/geo";

const CENTRO_MAPA = [
  (PUNTOS.P1.lat + PUNTOS.P3.lat) / 2,
  (PUNTOS.P1.lng + PUNTOS.P3.lng) / 2,
];

const PERIMETRO = [
  [PUNTOS.P1.lat, PUNTOS.P1.lng],
  [PUNTOS.P2.lat, PUNTOS.P2.lng],
  [PUNTOS.P3.lat, PUNTOS.P3.lng],
  [PUNTOS.P4.lat, PUNTOS.P4.lng],
];

const RECTANGULO_BOUNDS = [
  [BOUNDING_BOX_GENERAL.sur, BOUNDING_BOX_GENERAL.oeste],
  [BOUNDING_BOX_GENERAL.norte, BOUNDING_BOX_GENERAL.este],
];

function colorEstado(estado) {
  if (estado === "libre") return "#1e8f4e";
  if (estado === "ocupado") return "#c0392b";
  return "#7a7a7a";
}

export default function MapaEstacionamiento({ espacios, espacioSeleccionado }) {
  return (
    <div style={estilos.contenedor}>
      <MapContainer center={CENTRO_MAPA} zoom={19} style={estilos.mapa} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Perímetro real del terreno (P1-P2-P3-P4) */}
        <Polygon positions={PERIMETRO} pathOptions={{ color: "#1e8f4e", weight: 2, fillOpacity: 0.05 }} />

        {/* Bounding box general aproximado */}
        <Rectangle
          bounds={RECTANGULO_BOUNDS}
          pathOptions={{ color: "#3a4750", weight: 1, dashArray: "4", fillOpacity: 0 }}
        />

        {/* Un marcador por cada espacio, coloreado según su estado */}
        {espacios.map((espacio) => (
          <CircleMarker
            key={espacio.id}
            center={[espacio.ubicacion.latitud, espacio.ubicacion.longitud]}
            radius={espacio.id === espacioSeleccionado ? 8 : 4}
            pathOptions={{
              color: colorEstado(espacio.estado),
              fillColor: colorEstado(espacio.estado),
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <strong>{espacio.id}</strong>
              <br />
              Estado: {espacio.estado}
              <br />
              Distancia: {espacio.distanciaDetectada} cm
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

const estilos = {
  contenedor: {
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  mapa: { width: "100%", height: 360 },
};
