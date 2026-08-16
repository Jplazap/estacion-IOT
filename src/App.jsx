// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Estacionamiento from "./pages/Estacionamiento";
import DetalleEspacio from "./pages/DetalleEspacio";

function Navbar() {
  const location = useLocation();
  const activo = (ruta) => location.pathname === ruta;

  return (
    <nav style={estilos.nav}>
      <div style={estilos.marca}>
        <div style={estilos.logo}>U</div>
        <div>
          <div style={estilos.marcaTitulo}>UTEQ Smart Parking</div>
          <div style={estilos.marcaSub}>Monitoreo telemático del parqueadero</div>
        </div>
      </div>

      <div style={estilos.links}>
        <Link to="/" style={{ ...estilos.link, ...(activo("/") ? estilos.linkActivo : {}) }}>
          Inicio
        </Link>
        <Link
          to="/estacionamiento"
          style={{ ...estilos.link, ...(activo("/estacionamiento") ? estilos.linkActivo : {}) }}
        >
          Parqueadero
        </Link>
        <span style={estilos.badgeLive}>● RTDB en vivo</span>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/estacionamiento" element={<Estacionamiento />} />
        <Route path="/espacios/:id" element={<DetalleEspacio />} />
      </Routes>
    </BrowserRouter>
  );
}

const estilos = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 28px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
  },
  marca: { display: "flex", alignItems: "center", gap: 10 },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#0b522c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  marcaTitulo: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  marcaSub: { fontSize: 11, color: "#64748b" },
  links: { display: "flex", alignItems: "center", gap: 20 },
  link: { textDecoration: "none", color: "#64748b", fontSize: 13, fontWeight: "600" },
  linkActivo: { color: "#0b522c" },
  badgeLive: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "4px 10px",
    borderRadius: 16,
    fontSize: 11,
    fontWeight: "bold",
  },
};