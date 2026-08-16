// src/utils/geo.js
export const PUNTOS = {
  P1: { lat: -1.0122617572453996, lng: -79.4682858877737 },
  P2: { lat: -1.0125032549290254, lng: -79.4682998912032 },
  P3: { lat: -1.0125709715003960, lng: -79.46748620024898 },
  P4: { lat: -1.0123403901396444, lng: -79.46746240847104 },
};

export const BOUNDING_BOX_GENERAL = {
  norte: -1.0122617572453996,
  sur: -1.012570971500396,
  oeste: -79.4682998912032,
  este: -79.46746240847104,
};

export function generar80EspaciosIniciales() {
  const espacios = {};
  const { norte, sur, oeste, este } = BOUNDING_BOX_GENERAL;
  const latStep = (norte - sur) / 20;
  const lngStep = (este - oeste) / 4;
  const letras = ["A", "B", "C", "D"];

  for (let col = 1; col <= 4; col++) {
    for (let num = 1; num <= 20; num++) {
      const numStr = String(num).padStart(2, "0");
      const id = `ESP-C0${col}-${numStr}`;
      const lat = norte - (num - 0.5) * latStep;
      const lng = oeste + (col - 0.5) * lngStep;
      const dist = Math.floor(Math.random() * 160) + 10;
      const estado = dist <= 50 ? "ocupado" : "libre";

      espacios[id] = {
        id,
        columna: col,
        letraColumna: letras[col - 1],
        numero: num,
        distanciaDetectada: dist,
        estado,
        fechaHora: Date.now(),
        ubicacion: {
          nombre: "Parqueadero UTEQ",
          latitud: lat,
          longitud: lng,
          boundingBox: {
            norte: lat + latStep / 2,
            sur: lat - latStep / 2,
            oeste: lng - lngStep / 2,
            este: lng + lngStep / 2,
          },
        },
      };
    }
  }
  return espacios;
}