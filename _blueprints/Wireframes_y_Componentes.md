# Inventario de Componentes UI y Flujos (Wireframes lógicos)

## 0. Reglas de Emplazamiento de Logotipo
- **App Bar (Header):** Isotipo a la izquierda + Logotipo en tipografía negra/oscura. (Responsive: Solo Isotipo en móvil).
- **Footer:** Versión monocromática negativa (Blanco puro sobre fondo oscuro).
- **Favicon:** Isotipo puro, escalado a 32x32px.
- **Zona de Respeto (Clear Space):** 20% del tamaño total del logo a cada lado.

## 1. Landing Page (Home)
- **Header:** Sticky Navbar (con backdrop-blur y border-b translúcido), Logo (izq), CTA "Try now" (der).
- **Hero Section:** Título principal: "Tu Agencia de Branding IA". Subtítulo. Call to Action primario gigante (GSAP fade-up). Drag & Drop Zone centrada ocupando 50vh.
- **How it Works:** 3 tarjetas con iconos (Sube tu logo -> Analiza -> Descarga tu Kit). Hover animations usando Framer Motion.
- **Footer:** Links legales, redes, versión monocromática del logo.

## 2. Dashboard de Resultados (App Workspace)
- **Sidebar (Panel Izquierdo):** Navegación por Pestañas (Análisis IA, Exportar SVG, Versión B&W, Nuevos Diseños).
- **Main Content (Centro):**
  - Preview de la imagen interactiva (Canvas render).
  - Herramientas overlay (zoom, pan, color picker).
  - Estado del proceso IA (Skeleton loaders y progress bars fluídas de 0 a 100%).
- **Panel Derecho (Resultados IA):** Tarjetas iterativas con la Auditoría de Gemini (Chips con colores extraídos en formato HEX, críticas constructivas en cards minimalistas, sugerencias).

## Animaciones Avanzadas Requeridas (MANDATO DEL frontend-architect)
- **Smooth Scrolling** usando Lenis a nivel aplicación para una navegación mantecosa.
- **Page Transitions:** Fade in/out directionales al cambiar entre Home y Dashboard (Framer Motion).
- **Drag & Drop Zone:** Animación de "respiración" (scale pulse) al mantener un archivo flotando encima. Efecto de escaneo láser (beam sweep) al soltar el archivo, indicando procesamiento inmediato interactuando con el backend API Route.
