import { NextRequest, NextResponse } from 'next/server';
import { geminiImageModel } from '@/lib/gemini';

/**
 * Generates conceptual redesign variations for an uploaded logo.
 *
 * Note: this endpoint returns *text-based* creative directions (concept name,
 * visual description and rationale) produced by Gemini, not rasterized images.
 * Each variation's `visualDescription` is intended to be used as a prompt for a
 * downstream image-generation model.
 */

export async function POST(req: NextRequest) {
    try {
        const { image, analysis } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const base64Data = image.split(',')[1] || image;

        const prompt = `
      Basándote en el logo adjunto y el siguiente análisis previo: ${JSON.stringify(analysis)}.
      Como un Director Creativo Senior, describe una versión "Mejorada" y "Moderna" de este logo.
      Genera 3 variantes conceptuales.
      Para cada variante, responde con:
      - conceptName: Nombre del concepto.
      - visualDescription: Descripción detallada para ser usada como prompt de generación.
      - rational: Por qué este cambio es superior al original.
      
      Responde en formato JSON.
    `;

        const result = await geminiImageModel.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/png',
                },
            },
        ]);

        const responseText = result.response.text();
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        const variations = JSON.parse(jsonString);

        return NextResponse.json(variations);
    } catch (error: any) {
        console.error('Gemini Variations Error:', error);
        return NextResponse.json({ error: 'Error generating logo variations' }, { status: 500 });
    }
}
