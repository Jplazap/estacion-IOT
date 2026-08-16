🅿️ Estacionamiento Inteligente UTEQ
<img width="1360" height="768" alt="image" src="https://github.com/user-attachments/assets/ebd41b0d-2406-4f44-905f-9483440d1ce0" />
<img width="1360" height="768" alt="image" src="https://github.com/user-attachments/assets/ac3498e5-4ed3-4049-8317-d4f56f5f5cea" />
<img width="1360" height="768" alt="image" src="https://github.com/user-attachments/assets/04bb2f45-9aa0-43ff-a10a-b1d6951fea93" />

# 🅿️ Estacionamiento Inteligente UTEQ

Aplicación web desarrollada con **React** y **Firebase Realtime Database (RTDB)** que simula un sistema de estacionamiento inteligente de **80 espacios** (4 columnas × 20 plazas) para el campus de la **Universidad Técnica Estatal de Quevedo (UTEQ)**. El sistema simula sensores ultrasónicos que reportan distancia y estado (libre/ocupado) en tiempo real, muestra estadísticas globales de ocupación, historial por espacio y la ubicación geográfica real del parqueadero dentro del campus.

---

## 📑 Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Características principales](#-características-principales)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Estructura de carpetas](#-estructura-de-carpetas)
- [Modelo de datos en Firebase RTDB](#-modelo-de-datos-en-firebase-rtdb)
- [Cálculo de la distribución de los 80 espacios](#-cálculo-de-la-distribución-de-los-80-espacios)
- [Instalación y puesta en marcha](#-instalación-y-puesta-en-marcha)
- [Variables de entorno](#-variables-de-entorno)
- [Reglas de seguridad de Firebase](#-reglas-de-seguridad-de-firebase-recomendado)
- [Simulación de sensores](#-simulación-de-sensores)
- [Páginas y rutas](#-páginas-y-rutas)
- [Componentes principales](#-componentes-principales)
- [Hooks personalizados](#-hooks-personalizados)
- [Capturas de pantalla](#-capturas-de-pantalla)
- [Trabajo futuro](#-trabajo-futuro)
- [Conclusiones](#-conclusiones)
- [Autor](#-autor)
- [Licencia](#-licencia)

---

## 📖 Descripción general

El crecimiento del parque vehicular en los campus universitarios plantea la necesidad de contar con sistemas de gestión de estacionamientos que informen, en tiempo real, sobre la disponibilidad de espacios. Este proyecto documenta el desarrollo de un **estacionamiento inteligente simulado** para la UTEQ, compuesto por 80 espacios organizados en 4 columnas de 20 plazas cada una.

Cada espacio se asocia a un **sensor ultrasónico simulado** que reporta la distancia detectada a Firebase Realtime Database. A partir de dicha distancia, la aplicación determina si el espacio está **libre** u **ocupado** y lo representa gráficamente en una cuadrícula interactiva, actualizada en tiempo real gracias a los listeners de RTDB y a los hooks de React.

**Objetivo general:** desarrollar una aplicación web con React que simule el funcionamiento de un estacionamiento inteligente de 80 espacios ubicado en la UTEQ, integrando sensores simulados que reportan distancia y estado a Firebase Realtime Database, permitiendo visualizar en tiempo real la disponibilidad, las estadísticas de ocupación, el historial por espacio y la ubicación geográfica del parqueadero.

### Objetivos específicos

- Delimitar el área real del parqueadero a partir de coordenadas geográficas y calcular la distribución de 80 espacios en 4 columnas de 20 plazas.
- Diseñar en Firebase Realtime Database la estructura de datos para los espacios (`espacios`) y su historial de cambios (`historial`).
- Implementar en React los componentes, hooks y páginas necesarias para consultar y mostrar los espacios en tiempo real.
- Aplicar la regla de negocio que determina el estado del espacio (libre/ocupado) según la distancia detectada por el sensor.
- Construir tarjetas de resumen con el total, los espacios libres, los ocupados y el porcentaje de disponibilidad.
- Implementar filtros por columna y por estado, y una leyenda de colores para la cuadrícula de espacios.
- Mostrar la ubicación del parqueadero en un mapa utilizando las coordenadas del área delimitada.
- Crear una simulación que actualice periódicamente la distancia y el estado de los sensores, manteniendo un balance entre espacios libres y ocupados.
- Publicar el proyecto completo en un repositorio de GitHub con su documentación (`README.md`).

---

## ✨ Características principales

- 🟢🔴⚪ **Cuadrícula interactiva** de 80 espacios (4 columnas × 20 plazas) con código de colores: verde = libre, rojo = ocupado, gris = sin datos del sensor.
- 📊 **Tarjetas de resumen** con total de espacios, libres, ocupados y porcentaje de disponibilidad.
- 🧰 **Filtros** por columna y por estado de ocupación.
- 🕓 **Historial por espacio**, con fecha/hora de cada medición registrada.
- 🗺️ **Mapa del estacionamiento** ubicado geográficamente dentro del campus UTEQ, usando las coordenadas reales del área delimitada.
- 🔄 **Actualización en tiempo real** mediante listeners de Firebase Realtime Database (sin recargar la página).
- 🤖 **Simulación de sensores** ultrasónicos que actualizan periódicamente distancia y estado, manteniendo un balance entre espacios libres y ocupados.
- 🧩 **Arquitectura modular** basada en componentes, hooks, páginas y servicios.

---

## 🛠 Tecnologías utilizadas

| Categoría | Tecnología |
|---|---|
| Librería de UI | [React](https://react.dev/) (Vite) |
| Base de datos en tiempo real | [Firebase Realtime Database (RTDB)](https://firebase.google.com/docs/database) |
| Enrutamiento | [react-router-dom](https://reactrouter.com/) |
| Bundler / entorno de desarrollo | [Vite](https://vitejs.dev/) |
| Gestor de paquetes | npm |
| Lenguaje | JavaScript (JSX) |

---

## 🏗 Arquitectura del proyecto

El proyecto sigue una **arquitectura por capas basada en componentes**, separando responsabilidades de la siguiente manera:

- **`services/`** → conexión y configuración de Firebase.
- **`hooks/`** → lógica de acceso y suscripción a los datos de Firebase RTDB (custom hooks).
- **`components/`** → piezas de UI reutilizables (tarjetas, cuadrícula, filtros, mapa, historial).
- **`pages/`** → vistas completas que componen la navegación de la aplicación.
- **`App.jsx`** → configuración de rutas y layout general.

Esta separación entre **lógica de datos (hooks)**, **presentación (componentes)** y **navegación (páginas)** favorece la mantenibilidad y escalabilidad del proyecto.

---

## 📂 Estructura de carpetas

```
estacionamiento-app/
├── src/
│   ├── components/
│   │   ├── ResumenEstacionamiento.jsx     # Tarjetas de resumen (total, libres, ocupados, %)
│   │   ├── CuadriculaEstacionamiento.jsx  # Cuadrícula de 80 espacios en 4 columnas
│   │   ├── EspacioCard.jsx                # Tarjeta individual de un espacio
│   │   ├── FiltrosEspacios.jsx            # Filtros por columna y por estado
│   │   ├── HistorialEspacio.jsx           # Tabla/gráfico de historial de un espacio
│   │   └── MapaEstacionamiento.jsx        # Mapa con la ubicación real del parqueadero
│   ├── hooks/
│   │   ├── useEspacios.jsx                # Suscripción en tiempo real al nodo "espacios"
│   │   └── useHistorialEspacio.jsx        # Suscripción al historial de un espacio puntual
│   ├── pages/
│   │   ├── Inicio.jsx                     # Página de inicio / landing
│   │   ├── Estacionamiento.jsx            # Página principal con la cuadrícula de 80 espacios
│   │   └── DetalleEspacio.jsx             # Detalle e historial de un espacio (/espacios/:id)
│   ├── services/
│   │   └── firebase.js                    # Inicialización y configuración de Firebase
│   └── App.jsx                            # Definición de rutas de la aplicación
├── .env                                   # Variables de entorno (no se sube al repositorio)
├── package.json
└── README.md
```

---

## 🔥 Modelo de datos en Firebase RTDB

La base de datos se modela como un único árbol JSON con dos nodos principales: `espacios` e `historial`.

### Nodo `espacios`

Cada sensor se representa como un nodo dentro de `espacios`, identificado por un ID único, e incluye:

- **Columna** y **número** de plaza.
- **Ubicación** (coordenadas centrales del espacio).
- **Bounding box** propio del espacio dentro de la cuadrícula.
- **Distancia** detectada por el sensor (cm).
- **Estado** (`libre` / `ocupado`), derivado de la distancia.
- **Fecha/hora** de la última medición.

```json
{
  "espacios": {
    "espacio_001": {
      "columna": 1,
      "numero": 1,
      "ubicacion": { "lat": -1.012312, "lng": -79.468120 },
      "boundingBox": {
        "norte": -1.012280,
        "sur": -1.012330,
        "oeste": -79.468150,
        "este": -79.468090
      },
      "distancia": 12.4,
      "estado": "ocupado",
      "fechaActualizacion": "2026-08-15T10:32:00.000Z"
    }
  }
}
```

### Nodo `historial`

Cada cambio de estado o de distancia de un espacio queda registrado en `historial`, permitiendo reconstruir la evolución de ocupación de cada plaza a lo largo del tiempo.

```json
{
  "historial": {
    "espacio_001": {
      "-Nabc123...": {
        "distancia": 12.4,
        "estado": "ocupado",
        "fecha": "2026-08-15T10:32:00.000Z"
      }
    }
  }
}
```

> La regla de negocio que traduce distancia → estado se aplica en la capa de simulación/hooks: una distancia por debajo de un umbral determinado indica presencia de vehículo (`ocupado`); por encima del umbral, el espacio se considera `libre`.

---

## 📐 Cálculo de la distribución de los 80 espacios

El área del estacionamiento se delimitó dentro del campus UTEQ mediante cuatro puntos geográficos (P1 a P4), que conforman el siguiente *bounding box* aproximado:

```json
{
  "norte": -1.0122617572453996,
  "sur": -1.012570971500396,
  "oeste": -79.4682998912032,
  "este": -79.46746240847104
}
```

A partir de estas coordenadas se estimó un terreno de aproximadamente **91,37 m de largo por 26,34 m de ancho** (≈ 2405,74 m² de área). Al dividir el terreno en una cuadrícula uniforme de **4 columnas por 20 espacios**, se obtiene:

- Ancho de columna: **6,58 m**
- Largo de espacio: **4,57 m**
- Área de celda: **≈ 30,08 m²** cada una

Dentro de cada celda se representa un espacio de estacionamiento de **2,50 m × 5,00 m**, dejando el área restante como calle de circulación. A cada uno de los 80 espacios se le asigna un *bounding box* y unas coordenadas centrales propias, utilizadas posteriormente para ubicarlo en el mapa.

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- npm (incluido con Node.js)
- Una cuenta y un proyecto creado en [Firebase](https://console.firebase.google.com/) con **Realtime Database** habilitada

### Pasos

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/<usuario>/estacionamiento-app.git
   cd estacionamiento-app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

   Si se está creando el proyecto desde cero con Vite:

   ```bash
   npm create vite@latest estacionamiento-app -- --template react
   cd estacionamiento-app
   npm install firebase react-router-dom
   ```

3. **Configurar las variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto (ver sección [Variables de entorno](#-variables-de-entorno)).

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación quedará disponible en `http://localhost:5173` (puerto por defecto de Vite).

5. **Generar build de producción**

   ```bash
   npm run build
   ```

---

## 🔑 Variables de entorno

El proyecto utiliza variables de entorno con prefijo `VITE_` (requerido por Vite) para configurar la conexión con Firebase. Crea un archivo `.env` en la raíz con la siguiente estructura, **usando las credenciales de tu propio proyecto de Firebase**:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

> ⚠️ **Importante:** el archivo `.env` **no debe subirse al repositorio**. Agrégalo a `.gitignore` y publica únicamente un archivo de ejemplo (`.env.example`) con las claves vacías o con valores ficticios. Si ya se subieron credenciales reales por error, regenera las claves desde la consola de Firebase.

`services/firebase.js` inicializa la app de Firebase leyendo estas variables mediante `import.meta.env`:

```js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
```

---

## 🔒 Reglas de seguridad de Firebase (recomendado)

Por defecto, un proyecto de Firebase recién creado en modo de prueba permite lectura y escritura pública, lo cual **no es seguro para producción**. Se recomienda restringir el acceso, por ejemplo:

```json
{
  "rules": {
    "espacios": {
      ".read": true,
      ".write": "auth != null"
    },
    "historial": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

Esto permite lectura pública (para visualizar la disponibilidad en tiempo real) pero restringe la escritura a usuarios autenticados, evitando que cualquier cliente pueda alterar el estado de los sensores.

---

## 🤖 Simulación de sensores

Al no disponer de sensores físicos, el comportamiento de los 80 sensores ultrasónicos se simula mediante una función periódica (por ejemplo, con `setInterval`) que:

- Genera valores aleatorios de distancia para cada espacio.
- Traduce la distancia en un estado (`libre` / `ocupado`) según un umbral definido.
- Actualiza la fecha y hora de la medición.
- Registra cada cambio en el nodo `historial` correspondiente.
- Mantiene una proporción variable y realista entre espacios libres y ocupados, evitando que todos cambien de estado al mismo tiempo.

---

## 🧭 Páginas y rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | `Inicio.jsx` | Presentación general del proyecto y acceso directo al estacionamiento. |
| `/estacionamiento` | `Estacionamiento.jsx` | Cuadrícula completa de 80 espacios, resumen, filtros y mapa. |
| `/espacios/:id` | `DetalleEspacio.jsx` | Detalle e historial de un espacio específico. |

---

## 🧩 Componentes principales

- **`ResumenEstacionamiento.jsx`** — Tarjetas con el total de espacios, libres, ocupados y porcentaje de disponibilidad.
- **`CuadriculaEstacionamiento.jsx`** — Renderiza los 80 espacios en 4 columnas de 20 plazas, aplicando el color según el estado.
- **`EspacioCard.jsx`** — Tarjeta individual de un espacio dentro de la cuadrícula.
- **`FiltrosEspacios.jsx`** — Filtros por columna y por estado, junto con la leyenda de colores.
- **`HistorialEspacio.jsx`** — Tabla o gráfico con el historial de mediciones de un espacio.
- **`MapaEstacionamiento.jsx`** — Ubica el parqueadero en un mapa usando las coordenadas del área delimitada (P1–P4) y las coordenadas centrales de cada espacio.

---

## 🪝 Hooks personalizados

- **`useEspacios.jsx`** — Se suscribe en tiempo real al nodo `espacios` de Firebase RTDB y expone el listado actualizado de los 80 espacios a los componentes consumidores.
- **`useHistorialEspacio.jsx`** — Se suscribe al historial de un espacio específico (a partir de su ID) para alimentar el componente `HistorialEspacio.jsx`.

---

## 🖼 Capturas de pantalla

> Agrega aquí las capturas de pantalla de tu aplicación en ejecución (página de inicio, cuadrícula de espacios, detalle/historial y mapa), por ejemplo:
>
> ```markdown
> ![Página de inicio](docs/screenshots/inicio.png)
> ![Cuadrícula de estacionamiento](docs/screenshots/estacionamiento.png)
> ![Detalle e historial de un espacio](docs/screenshots/detalle.png)
> ![Mapa del estacionamiento](docs/screenshots/mapa.png)
> ```

---

## 🔮 Trabajo futuro

- Reemplazar la simulación por **sensores físicos reales** (por ejemplo, ultrasónicos HC-SR04 conectados a un microcontrolador como Arduino o ESP32) que reporten datos directamente a Firebase RTDB.
- Incorporar **autenticación** y **reglas de seguridad** en Firebase para restringir la escritura de datos a dispositivos o usuarios autorizados.
- Añadir notificaciones o alertas cuando la disponibilidad global caiga por debajo de un umbral.
- Incorporar reportes históricos y gráficos de ocupación por rangos de fecha.

---

## ✅ Conclusiones

- La delimitación geográfica del terreno mediante coordenadas permitió calcular de forma precisa la distribución de los 80 espacios en 4 columnas de 20 plazas, asignando a cada uno un *bounding box* y unas coordenadas centrales propias.
- Firebase Realtime Database resultó adecuada para sincronizar en tiempo real el estado de los 80 sensores simulados y para mantener, en paralelo, el historial de cambios de cada espacio sin necesidad de recargar la aplicación.
- La arquitectura basada en componentes, hooks y páginas de React facilitó separar la lógica de consulta de datos (hooks), la presentación (componentes) y la navegación (páginas), favoreciendo la mantenibilidad del proyecto.
- La aplicación resultante permite visualizar en tiempo real la disponibilidad del parqueadero, sus estadísticas globales, el historial individual de cada espacio y su ubicación geográfica, cumpliendo el objetivo planteado.

---

## 👤 Autor

**Plaza Pisanan Jorge Enrique**
8vo Nivel de Telemática "A"
Facultad de Ciencias de la Computación y Diseño Digital
Universidad Técnica Estatal de Quevedo (UTEQ)

Docente: Ing. Zambrano Vega Cristian Gabriel

---

## 📄 Licencia

Este proyecto se desarrolló con fines académicos como parte del curso de Telemática (Aplicaciones Telemáticas) de la UTEQ. Puedes adaptar la licencia según las políticas de tu institución o repositorio (por ejemplo, [MIT License](https://opensource.org/licenses/MIT)).
