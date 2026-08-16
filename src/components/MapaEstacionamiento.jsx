// src/components/MapaEstacionamiento.jsx
import React, { useEffect, useRef } from 'react';

export default function MapaEstacionamiento({ espacios = [], espacioSeleccionado, onSelectEspacio }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // 1. Inyectar CSS de Leaflet de forma segura
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // 2. Controlar la carga del JS de Leaflet con polling
    const cargarLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.L) {
            clearInterval(interval);
            initMap();
          }
        }, 100);
      }
    };

    cargarLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, []);

  const initMap = () => {
    if (!mapContainerRef.current || mapInstanceRef.current || !window.L) return;

    const L = window.L;
    
    // Crear el mapa indicando las coordenadas centrales de UTEQ Quevedo
    const map = L.map(mapContainerRef.current, {
      center: [-1.012269, -79.468195],
      zoom: 18,
      zoomControl: true
    });

    // Capa visual oscura (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Recalcular tamaño del contenedor en React para forzar el renderizado de los tiles
    setTimeout(() => {
      map.invalidateSize();
      actualizarMarcadores();
    }, 200);
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      actualizarMarcadores();
    }
  }, [espacios, espacioSeleccionado]);

  const actualizarMarcadores = () => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    espacios.forEach((e) => {
      let lat = Number(e.ubicacion?.latitud);
      let lng = Number(e.ubicacion?.longitud);

      // Coordenadas de respaldo ante valores numéricos no válidos
      if (isNaN(lat) || !isFinite(lat)) {
        const num = Number(e.numero) || 1;
        lat = -1.012269 + (num * 0.00003);
      }
      if (isNaN(lng) || !isFinite(lng)) {
        const colCode = typeof e.columna === 'string' ? e.columna.charCodeAt(0) : (Number(e.columna) || 1);
        lng = -79.468195 + (colCode * 0.00003);
      }

      const esLibre = e.estado === 'libre' || e.estado === 'Disponible';
      const color = esLibre ? '#10b981' : '#f87171';
      const isSelected = espacioSeleccionado && espacioSeleccionado.id === e.id;

      if (!markersRef.current[e.id]) {
        const marker = L.circleMarker([lat, lng], {
          radius: isSelected ? 10 : 6,
          fillColor: color,
          color: isSelected ? '#ffffff' : color,
          weight: isSelected ? 3 : 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstanceRef.current);

        marker.on('click', () => onSelectEspacio && onSelectEspacio(e));
        markersRef.current[e.id] = marker;
      } else {
        markersRef.current[e.id].setLatLng([lat, lng]);
        markersRef.current[e.id].setStyle({
          radius: isSelected ? 10 : 6,
          fillColor: color,
          color: isSelected ? '#ffffff' : color,
          weight: isSelected ? 3 : 1
        });
      }
    });
  };

  return (
    <div style={{ background: '#1b2228', padding: '16px', borderRadius: '12px', marginTop: '20px', border: '1px solid #28323c' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#8a95a1', textTransform: 'uppercase' }}>
        Mapa de Geolocalización en Tiempo Real
      </h3>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '360px', borderRadius: '8px', overflow: 'hidden', position: 'relative', zIndex: 1 }} 
      />
    </div>
  );
}