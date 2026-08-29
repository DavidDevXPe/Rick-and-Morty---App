# Rick & Morty — Explorador del Multiverso

[![Quality](https://github.com/DavidDevXPe/Rick-and-Morty---App/actions/workflows/quality.yml/badge.svg)](https://github.com/DavidDevXPe/Rick-and-Morty---App/actions/workflows/quality.yml)

Aplicación web interactiva para explorar personajes, episodios y ubicaciones
del universo de Rick & Morty, con filtros, favoritos, personalización de
perfil, temas e interfaz responsive.

## Demo

🔗 [rickandmorty99.netlify.app](https://rickandmorty99.netlify.app/)

## Funcionalidades

- Pantalla de bienvenida / onboarding con selección de versión (Rick o Morty).
- Nombre de usuario personalizado, con persistencia del perfil entre sesiones.
- Navegación entre las secciones Personajes, Episodios y Ubicaciones.
- Búsqueda de personajes y episodios.
- Filtros de personajes por estado, especie y género.
- Sistema de favoritos, con contador y listado dedicado.
- Contador de personajes totales en el header.
- Cambio de idioma Español / Inglés.
- Tema claro / oscuro persistente.
- Estados de carga (skeletons) en personajes, episodios y ubicaciones.
- Manejo de errores con mensajes claros y botón de reintentar.
- Recuperación global ante errores inesperados de renderizado.
- Interfaz responsive.
- Accesibilidad: roles ARIA, foco de teclado, textos alternativos y regiones
  `aria-live` para estados dinámicos.
- Persistencia en `localStorage` de tema, favoritos, perfil e idioma.

## Personajes

- Búsqueda por nombre.
- Filtros combinables por estado, especie y género.
- Favoritos: marcar/desmarcar personajes y consultarlos en una vista aparte.
- Navegación por el episodio seleccionado: muestra los personajes que
  aparecen en un episodio específico.
- Información de origen de cada personaje.

## Episodios

- Listado paginado de episodios de la serie.
- Búsqueda de episodios por nombre.
- Datos de temporada/código de episodio y fecha de emisión.
- Cantidad de personajes por episodio.
- Navegación directa desde un episodio hacia sus personajes.

## Ubicaciones

- Consulta de ubicaciones por identificador.
- Tipo y dimensión de cada ubicación.
- Listado paginado de residentes de la ubicación.
- Estado dedicado cuando la ubicación no tiene residentes.

## Tecnologías

- [React](https://react.dev/) 18.3.1
- [Vite](https://vite.dev/) 8.2.2 (bundler y servidor de desarrollo)
- [Rick and Morty API](https://rickandmortyapi.com/) (fuente de datos)
- [lucide-react](https://lucide.dev/) 0.468.0 (iconografía)
- [prop-types](https://www.npmjs.com/package/prop-types) 15.8.1
- Testing: [Vitest](https://vitest.dev/) 4.1.11, [Testing Library](https://testing-library.com/) y cobertura V8
- [ESLint](https://eslint.org/) 9.0.0 para control de calidad de código

La navegación entre secciones (Personajes / Episodios / Ubicaciones) se
maneja con estado de React, sin librería de enrutamiento.

## API

Los datos provienen de la [Rick and Morty API](https://rickandmortyapi.com/),
una API pública, gratuita y mantenida por la comunidad. Este proyecto de fans
no está afiliado con Adult Swim. La aplicación consume los endpoints de
personajes, episodios y ubicaciones, incluyendo búsqueda, paginación y
filtros (estado, especie, género).

## Testing

El proyecto usa [Vitest](https://vitest.dev/) junto con
[Testing Library](https://testing-library.com/) (`@testing-library/react`,
`@testing-library/jest-dom`, `@testing-library/user-event`) sobre un entorno
`jsdom`.

La suite cubre:

- Componentes: `CharacterGrid`, `Header`, `Pagination`, `ResidentCard`,
  `ResidentList`, `SearchFilters`, `WelcomeScreen`.
- Páginas: `CharactersPage`, `EpisodesPage`, `LocationsPage`.
- Hooks: `useFavorites`, `useFetch`, `useLocalStorage`, `usePaginatedList`.
- Internacionalización: `translations`.
- `App`: pruebas unitarias y de integración sin mocks de páginas.
- Contratos de respuesta de la API, persistencia degradada y configuración de
  despliegue.

La cobertura se genera con V8 y el pipeline exige como mínimo 70 % en líneas y
sentencias, 60 % en ramas y 75 % en funciones.

```bash
npm run test        # Ejecuta la suite una vez
npm run test:coverage # Ejecuta la suite y genera coverage/
npm run test:watch  # Ejecuta la suite en modo watch
```

## Scripts

```bash
npm install         # Instala las dependencias
npm run dev         # Inicia el servidor de desarrollo
npm run build       # Genera el build de producción en dist/
npm run lint        # Ejecuta ESLint (cero warnings permitidos)
npm run test        # Ejecuta la suite de tests una vez
npm run test:coverage # Ejecuta tests y valida los umbrales de cobertura
npm run test:watch  # Ejecuta la suite de tests en modo watch
npm run check       # Ejecuta lint, cobertura y build
npm run preview     # Sirve localmente el build de producción
```

## Instalación local

```bash
git clone https://github.com/DavidDevXPe/Rick-and-Morty---App.git
cd Rick-and-Morty---App
npm install
npm run dev
```

Vite imprime en la terminal la URL local de desarrollo.

### Requisitos

- Node.js `22.12+` (el pipeline y Netlify usan Node.js `24.16.0`)
- npm `10.9+` (versión fijada para despliegue: `11.13.0`)

## SEO y Open Graph

El proyecto incluye SEO básico y metadatos Open Graph / Twitter Card, lo que
permite una vista previa social (imagen, título y descripción) al compartir
el enlace en redes sociales y aplicaciones de mensajería. También expone
`robots.txt` y `sitemap.xml`.

## Despliegue y calidad

- `netlify.toml` fija el directorio `dist`, las versiones de Node/npm,
  encabezados de seguridad y caché inmutable para assets versionados.
- GitHub Actions ejecuta instalación reproducible, lint, cobertura, build y
  auditoría de dependencias en cada push o pull request a `main`.
- Dependabot revisa semanalmente actualizaciones npm compatibles (patch/minor,
  con excepciones conservadoras para librerías `0.x`) y mensualmente las
  acciones de GitHub.
- La URL canónica, Open Graph, Twitter Card, `robots.txt` y `sitemap.xml`
  apuntan a `https://rickandmorty99.netlify.app/`.

## Estructura del proyecto

```text
src/
  assets/        Branding, fondos y elementos decorativos
  components/    Cards, estados de carga/vacío/error, header, footer
  hooks/         useFetch, usePaginatedList, useFavorites, useLocalStorage
  i18n/          Contexto de idioma y traducciones ES/EN
  pages/         CharactersPage, EpisodesPage, LocationsPage
  test/          Setup y fixtures compartidos para los tests
  utils/         Funciones de formateo
  App.jsx        Perfil, navegación entre secciones y layout principal
  config.js      Constantes de API, paginación y claves de localStorage
  main.jsx       Punto de entrada de React
public/          Favicon e imagen Open Graph
```

## Qué aprendí

Este proyecto reforzó el trabajo con una aplicación React más completa que
una demo simple:

- Consumo de múltiples endpoints de una API REST pública, con búsqueda,
  filtros y paginación.
- Diseño de componentes reutilizables (cards, skeletons, estados vacíos y de
  error) compartidos entre distintas secciones.
- Manejo de estado y efectos con hooks personalizados (`useFetch`,
  `usePaginatedList`, `useFavorites`, `useLocalStorage`), incluyendo
  cancelación de peticiones obsoletas.
- Persistencia de preferencias del usuario (perfil, favoritos, tema, idioma)
  en `localStorage`.
- Internacionalización con contexto de React (ES/EN).
- Diseño responsive y con foco en accesibilidad (ARIA, foco de teclado,
  regiones `aria-live`).
- Organización de tests con Vitest y Testing Library.
- Estructuración de una aplicación de varias secciones sin depender de una
  librería de enrutamiento.
