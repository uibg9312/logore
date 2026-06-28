import { NextRequest, NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json(); // Base64 string from client

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Clean base64 if it has header
        const base64Data = image.split(',')[1] || image;

        const prompt = `
      Actúa como un experto Consultor de Marca y Arquitecto de Diseño de Clase Mundial.
      Analiza el logo proporcionado y responde ÚNICAMENTE con un objeto JSON estructurado con las siguientes claves:
      - style: Identifica el estilo visual (minimalista, corporativo, vintage, etc.)
      - colors: Array de códigos HEX dominantes encontrados.
      - elements: Lista de símbolos, formas o tipografías clave identificadas.
      - audit: Análisis crítico de 2-3 oraciones sobre legibilidad y escalabilidad.
      - suggestions: 3 puntos clave para mejorar o modernizar el diseño.
      - useCases: Sectores recomendados.

      Tu respuesta debe ser JSON válido. No incluyas cajas de código de markdown.
    `;

        const result = await geminiModel.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/png',
                },
            },
        ]);

        const responseText = result.response.text();
        // Cleanup JSON if Gemini adds markdown markers
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        const auditData = JSON.parse(jsonString);

        return NextResponse.json(auditData);
    } catch (error: any) {
        console.error('Gemini Audit Error:', error);
        return NextResponse.json({ error: 'Error processing logo audit' }, { status: 500 });
    }
}
