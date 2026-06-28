/**
 * Flood Fill algorithm implementation for background removal on HTML5 Canvas.
 * Detects solid colors at the corners and fills with transparency.
 */

export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * Checks if two colors are "similar" within a tolerance.
 */
function isSimilarColor(c1: RGBA, c2: RGBA, tolerance: number): boolean {
    return (
        Math.abs(c1.r - c2.r) <= tolerance &&
        Math.abs(c1.g - c2.g) <= tolerance &&
        Math.abs(c1.b - c2.b) <= tolerance &&
        Math.abs(c1.a - c2.a) <= tolerance
    );
}

/**
 * Main background removal function using Flood Fill.
 */
export async function removeBackground(
    canvas: HTMLCanvasElement,
    tolerance: number = 20
): Promise<HTMLCanvasElement> {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return canvas;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Detect corner color (likely background)
    const getPixel = (x: number, y: number): RGBA => {
        const i = (y * width + x) * 4;
        return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
    };

    const corners = [
        getPixel(0, 0),
        getPixel(width - 1, 0),
        getPixel(0, height - 1),
        getPixel(width - 1, height - 1)
    ];

    // Average corner color if they are similar, otherwise pick top-left
    const targetColor = corners[0];

    const visited = new Uint8Array(width * height);
    const queue: [number, number][] = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];

    while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        const idx = y * width + x;

        if (x < 0 || x >= width || y < 0 || y >= height || visited[idx]) continue;

        const currentColor = getPixel(x, y);
        if (isSimilarColor(currentColor, targetColor, tolerance)) {
            visited[idx] = 1;
            const i = idx * 4;
            data[i + 3] = 0; // Set Alpha to 0 (Transparent)

            queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

/**
 * Converts image to Monochrome (Black or White)
 */
export function convertToMonochrome(canvas: HTMLCanvasElement, type: 'black' | 'white'): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 0) {
            if (type === 'black') {
                data[i] = 0; data[i + 1] = 0; data[i + 2] = 0;
            } else {
                data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

/**
 * Resizes an image ensuring it doesn't exceed a maximum dimension.
 */
export function resizeImage(canvas: HTMLCanvasElement, maxDim: number = 800): HTMLCanvasElement {
    const width = canvas.width;
    const height = canvas.height;

    if (width <= maxDim && height <= maxDim) return canvas;

    const ratio = Math.min(maxDim / width, maxDim / height);
    const newWidth = width * ratio;
    const newHeight = height * ratio;

    const offscreen = document.createElement('canvas');
    offscreen.width = newWidth;
    offscreen.height = newHeight;
    const ctx = offscreen.getContext('2d');
    if (ctx) {
        ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
    }
    return offscreen;
}

/**
 * SVG Vectorization using ImageTracerJS.
 */
export async function vectorizeToSVG(canvas: HTMLCanvasElement): Promise<string> {
    // @ts-ignore - imagetracerjs doesn't have official types
    const ImageTracer = (await import('imagetracerjs')).default;

    // We resize to avoid browser hanging during tracing if the image is too large
    const smallCanvas = resizeImage(canvas, 512);
    const ctx = smallCanvas.getContext('2d');
    if (!ctx) return '';

    const imageData = ctx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);

    return ImageTracer.imagedataToSVG(imageData, {
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        colorsampling: 1,
        numberofcolors: 16,
        mincolorratio: 0.02,
        colorquantcycles: 3,
        scale: 1,
        simplifytolerance: 1.2
    });
}

/**
 * Converts canvas to Base64 (PNG)
 */
export function toBase64(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
}
