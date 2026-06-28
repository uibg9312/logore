# Matriz de Cumplimiento Normativo (GDPR / Italia D.Lgs 101/2018)

## 1. Privacy by Design & Default
- **Arquitectura Local:** El procesamiento bruto de la imagen (eliminación de fondo, redimensionado, tracing vectorial) ocurre 100% en el Client-Side (`<canvas>`). La IP del usuario o la imagen original NUNCA se almacenan a largo plazo en nuestros servidores.
- **Proxy BFF Gemini (Vía A):** La imagen se convierte a Base64 en el cliente y se envía efímeramente a la API Route de Next.js. El servidor actúa de pasarela, reenviando a Gemini. **NO SE LOGUEA EL PAYLOAD EN BASE DE DATOS**. Al terminar el *request*, la imagen en RAM del servidor es liberada al finalizar el worker serverless.

## 2. Consentimiento y Tracking
- **Google Consent Mode v2:** Implementado por defecto con banners explícitos (Opt-In activo, no implícito).
- **Analytics:** Componentes de tracking (Google Analytics 4 vía GTM) postergados hasta obtener "Accept All". Cero rastreo de third-party cookies previo al consentimiento.

## 3. Condiciones Jurisdiccionales (Roma/Italia/EU)
- Los logs estadísticos de sistema (Firebase Firestore), si se habilitan, son estadísticos puros (Dato agregado). Excluyen IP y cabeceras user-agent específicas. Purgado legal cada 90 días (Políticas de Retención nativas).
- La invocación a la API de Vertex AI/Gemini prefiere el enrutamiento intra-EU (ej. Endpoint `europe-west4` o el más cercano en la documentación de GCP) para evitar cruce de fronteras de datos no mitigados, salvaguardando la legislación de transferencia del Garante per la protezione dei dati personali.
