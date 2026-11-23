# Travelsti — Agencia de Viajes y Planificador de Vacaciones

Aplicación web para una **Agencia de Viajes** desarrollada con **React**, **React Router**, **Apollo Client** y **Mock Service Worker (MSW)**. Permite explorar destinos internacionales, consultar su clima actual en tiempo real y planificar un viaje completo cotizando opciones de vuelos y hoteles en **Pesos Chilenos (`CLP`)** o **Dólares (`USD`)**.



---

##  Características Principales

- **Catálogo de Destinos Internacionales (API REST Mock):**
  - Consulta mediante `GET /api/destinations` el listado de destinos disponibles (**París, Tokio, Cusco y Machu Picchu, Cancún y Riviera Maya, Roma y San Carlos de Bariloche**).
  - Visualiza información clave de cada destino: país, continente, mejor temporada de viaje, valoración y listado de **actividades populares**.
  - Incluye buscador dinámico en tiempo real (por ciudad, país o actividad) y filtros por continente.

- **Exploración de Vuelos y Hoteles por Destino (API GraphQL Mock):**
  - Al hacer clic en la fotografía o en el botón de cualquier destino, navega a `/destinos/:destinationId` y ejecuta la consulta GraphQL `GetTravelDetailsByDestination` mediante **Apollo Client** (`useQuery` + `InMemoryCache`).
  - Muestra los **vuelos disponibles** con aerolínea, código de vuelo, horarios, escalas, clase de cabina, fechas de salida/regreso, asientos disponibles y precio.
  - Muestra los **hoteles disponibles** con categoría de estrellas, ubicación, tipo de habitación, fechas de check-in/check-out, comodidades, habitaciones disponibles y tarifa por noche.
  - Incluye filtros interactivos por tarifa máxima de vuelo, categoría de estrellas de hotel y pestañas de visualización (*Vuelos + Hoteles*, *Solo Vuelos*, *Solo Hoteles*).

- **Cotizador Interactivo y Selector Multimoneda (`CLP` / `USD`):**
  - Todos los precios se muestran por defecto en **Pesos Chilenos (`CLP`)** y pueden alternarse en cualquier momento a **Dólares (`USD`)** desde la barra de navegación superior.
  - El planificador interactivo permite seleccionar un vuelo y un hotel, ajustar la cantidad de noches de estadía (1 a 14 noches) y calcular automáticamente el presupuesto total estimado.

- **Clima en Tiempo Real (Open-Meteo API):**
  - Integra la API pública de **Open-Meteo** utilizando las coordenadas geográficas de cada destino para mostrar la temperatura actual en `°C` y el estado meteorológico en vivo (con respaldo automático en caso de no contar con conexión).

---

##  Tecnologías Utilizadas

- **Frontend:** React 18, HTML5, CSS3 (Diseño Responsivo con CSS Grid y Flexbox), JavaScript (ES6+).
- **Enrutamiento:** React Router DOM v6 (`BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `useParams`).
- **Cliente GraphQL:** Apollo Client v3 (`ApolloClient`, `InMemoryCache`, `ApolloProvider`, `gql`, `useQuery`).
- **Simulación de Backend (Mocking):** Mock Service Worker (`msw` v2) interceptando peticiones `http.get` (REST) y `graphql.query` (GraphQL) en el navegador.
- **API Externa:** Open-Meteo API (`https://api.open-meteo.com/v1/forecast`) para datos meteorológicos en vivo.
- **Despliegue:** GitHub Pages (`gh-pages`).

---

##  Estructura del Proyecto

```text
Travelsti/
├── public/
│   ├── index.html                   # Plantilla HTML5 principal
│   ├── manifest.json                # Manifiesto de aplicación web
│   └── mockServiceWorker.js         # Service Worker de MSW para interceptar peticiones
├── src/
│   ├── apollo/
│   │   ├── cliente.js               # Configuración de ApolloClient e InMemoryCache
│   │   └── consultas.js             # Definición de la query GraphQL GetTravelDetailsByDestination
│   ├── components/
│   │   ├── BarraNavegacion.js       # Barra superior con navegación y selector de moneda CLP/USD
│   │   ├── TarjetaDestino.js        # Tarjeta de destino con foto interactiva, clima y actividades
│   │   ├── TarjetaVuelo.js          # Tarjeta con detalle de vuelo, fechas, cupos y tarifa
│   │   ├── TarjetaHotel.js          # Tarjeta con detalle de hotel, estrellas, fechas y precio
│   │   └── ResumenPlanViaje.js      # Cotizador interactivo de vuelo + hotel seleccionado
│   ├── mocks/
│   │   ├── browser.js               # Configuración del worker de MSW en navegador
│   │   ├── datosViajes.js           # Catálogo de datos simulados (destinos, vuelos y hoteles)
│   │   └── handlers.js              # Handlers simultáneos para REST y GraphQL
│   ├── pages/
│   │   ├── PaginaDestinos.js        # Vista principal y catálogo de destinos (consumo REST)
│   │   └── PaginaDetalleDestino.js  # Vista de vuelos y hoteles por destino (consumo GraphQL)
│   ├── utils/
│   │   ├── clima.js                 # Hook useClimaReal conectado a Open-Meteo API
│   │   └── moneda.js                # Conversión y formateo de precios en CLP y USD
│   ├── App.js                       # Configuración de rutas (React Router) y estado global
│   ├── App.css                      # Estilos de componentes y media queries responsivas
│   ├── App.test.js                  # Pruebas automatizadas de integración REST y GraphQL
│   ├── index.js                     # Punto de entrada con inicialización de MSW y ApolloProvider
│   └── index.css                    # Variables CSS globales y estilos base
└── package.json                     # Dependencias, scripts y configuración de despliegue
```
