# 🎨 Logore

> Suite de branding con IA: limpia tu logo, genera un brand kit y recibe rediseños conceptuales.

Herramienta web construida con **Next.js 16** y **Google Gemini** que toma el logo de una marca y, en segundos, produce un *brand kit* listo para usar: logo limpio sin fondo, versiones monocromáticas (negro/blanco) y un SVG vectorial generado en el cliente. Además, Gemini actúa como director creativo para analizar el logo y proponer rediseños conceptuales.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)

## ✨ Características

- **🪄 Limpieza automática de fondo** — Eliminación de fondo client-side mediante un algoritmo de *flood fill* sobre el canvas. Sin servidor, sin APIs externas.
- **🧠 Análisis con IA** — Gemini 2.5 Flash audita el logo: estilo, paleta de color, casos de uso, auditoría técnica y sugerencias de mejora.
- **📦 Brand Kit completo** — Exporta:
  - PNG original limpio
  - Versiones monocromáticas (negro y blanco) en PNG
  - SVG vectorial (vectorización en el navegador con `imagetracerjs`)
- **💡 Rediseños conceptuales** — Gemini genera 3 direcciones creativas (nombre, descripción visual y racional) que sirven como brief para un rediseño.
- **🎬 UX de alta gama** — Animaciones con GSAP + Framer Motion, scroll suave con Lenis, y un sistema de diseño basado en tokens Material Design 3.

## 🛠️ Stack técnico

| Tecnología | Rol |
|---|---|
| **Next.js 16** (App Router) + React 19 | Framework full-stack |
| **Google Gemini 2.5** | Análisis de logo + generación de variantes conceptuales |
| **Tailwind CSS 4** | Estilos |
| **GSAP + Framer Motion** | Animaciones |
| **Lenis** | Scroll suave |
| **imagetracerjs** | Vectorización SVG en el cliente |
| **lucide-react + Radix UI** | Iconografía y primitivos accesibles |

## 🚀 Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la API key de Gemini
#    Crea un archivo .env.local con:
#    GEMINI_API_KEY=tu_clave_aqui

# 3. Servidor de desarrollo
npm run dev

# 4. Build de producción
npm run build && npm start
```

Necesitas una API key de Google AI Studio ([obténla aquí](https://aistudio.google.com/apikey)).

## 🧩 Cómo funciona

1. **Subes** un logo (PNG/JPG).
2. El navegador **elimina el fondo** automáticamente (flood fill sobre píxeles).
3. **Gemini analiza** el logo y devuelve un informe de marca.
4. Generas el **brand kit** (PNG limpio, monocromos, SVG) con un clic.
5. Opcionalmente, pides **3 conceptos de rediseño** generados por la IA.

Todo el procesamiento de imagen ocurre **en el cliente**; Gemini solo recibe el logo para análisis textual.

## 📄 Licencia

MIT
