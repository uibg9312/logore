'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { removeBackground, toBase64, convertToMonochrome, vectorizeToSVG } from '@/lib/utils/image-processing';
import { Download as DownloadIcon } from 'lucide-react';

export function Workspace() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [variations, setVariations] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isVectorizing, setIsVectorizing] = useState(false);

    const downloadFile = (data: string, filename: string, type: string) => {
        const link = document.createElement('a');
        link.href = data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleVectorExport = async () => {
        if (!processedCanvas) return;
        setIsVectorizing(true);
        try {
            const svg = await vectorizeToSVG(processedCanvas);
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, 'logo-vector.svg', 'image/svg+xml');
        } catch (err) {
            console.error(err);
            setError('Error al vectorizar el logo.');
        } finally {
            setIsVectorizing(false);
        }
    };

    const handleMonoExport = (type: 'black' | 'white') => {
        if (!processedCanvas) return;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = processedCanvas.width;
        tempCanvas.height = processedCanvas.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(processedCanvas, 0, 0);
            convertToMonochrome(tempCanvas, type);
            downloadFile(tempCanvas.toDataURL(), `logo-${type}.png`, 'image/png');
        }
    };

    const generateVariations = async () => {
        if (!processedCanvas || !analysis) return;
        setIsGenerating(true);
        try {
            const response = await fetch('/api/variations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: toBase64(processedCanvas),
                    analysis
                }),
            });
            const data = await response.json();
            setVariations(data);
        } catch (err) {
            console.error(err);
            setError('Error al generar variaciones.');
        } finally {
            setIsGenerating(false);
        }
    };

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = useCallback(async (uploadedFile: File) => {
        if (!uploadedFile.type.startsWith('image/')) {
            setError('Por favor, sube un archivo de imagen válido.');
            return;
        }

        setFile(uploadedFile);
        setIsProcessing(true);
        setError(null);
        setAnalysis(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);

                    // Step 1: Remove Background (Flood Fill)
                    const resultCanvas = await removeBackground(canvas);
                    setProcessedCanvas(resultCanvas);

                    // Step 2: Gemini Audit
                    const base64 = toBase64(resultCanvas);
                    try {
                        const response = await fetch('/api/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ image: base64 }),
                        });
                        const data = await response.json();
                        setAnalysis(data);
                    } catch (err) {
                        console.error(err);
                        setError('Error al conectar con la IA de Gemini.');
                    }
                }
                setIsProcessing(false);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(uploadedFile);
    }, []);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileUpload(droppedFile);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Drop Zone / Preview */}
                <div className="space-y-6">
                    <motion.div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        className={`
              relative min-h-[400px] rounded-[40px] border-2 border-dashed 
              flex flex-col items-center justify-center transition-all duration-500
              ${file ? 'border-primary/40 bg-white' : 'border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40'}
            `}
                    >
                        <AnimatePresence mode="wait">
                            {!file ? (
                                <motion.div
                                    key="upload"
                                    className="flex flex-col items-center text-center p-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-2xl font-display font-bold mb-2 text-on-background">Suelta tu logo aquí</h3>
                                    <p className="text-on-background/50 mb-8 max-w-xs">Soporta PNG, JPG y SVG. El procesamiento inicial es 100% local.</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="fileInput"
                                        accept="image/*"
                                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                                    />
                                    <Button asChild onClick={() => document.getElementById('fileInput')?.click()}>
                                        <label htmlFor="fileInput" className="cursor-pointer">Elegir Archivo</label>
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    className="w-full h-full p-8 flex flex-col items-center justify-center relative"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {processedCanvas && (
                                        <img
                                            src={processedCanvas.toDataURL()}
                                            alt="Preview"
                                            className="max-h-[300px] w-auto object-contain drop-shadow-2xl"
                                        />
                                    )}
                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[40px] flex flex-col items-center justify-center">
                                            <Loader2 className="animate-spin text-primary mb-4" size={40} />
                                            <p className="font-display font-bold text-primary animate-pulse">Analizando con Gemini...</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {file && !isProcessing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[32px] border border-on-background/5 shadow-sm space-y-4"
                        >
                            <h4 className="font-display font-bold text-sm uppercase tracking-widest text-on-background/40">Exportar Brand Kit</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="rounded-2xl gap-2" onClick={handleVectorExport} disabled={isVectorizing}>
                                    {isVectorizing ? <Loader2 className="animate-spin" size={16} /> : <DownloadIcon size={16} />}
                                    SVG Vector
                                </Button>
                                <Button variant="outline" className="rounded-2xl gap-2" onClick={() => handleMonoExport('black')}>
                                    <DownloadIcon size={16} /> Negro (PNGe)
                                </Button>
                                <Button variant="outline" className="rounded-2xl gap-2" onClick={() => handleMonoExport('white')}>
                                    <DownloadIcon size={16} /> Blanco (PNGe)
                                </Button>
                                <Button variant="default" className="rounded-2xl gap-2" onClick={() => downloadFile(processedCanvas!.toDataURL(), 'logo-clean.png', 'image/png')}>
                                    <DownloadIcon size={16} /> PNG Original
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <div className="p-4 rounded-2xl bg-error/10 text-error flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-display font-bold">Análisis de Marca</h2>
                        {file && !isProcessing && (
                            <Button variant="ghost" className="gap-2" onClick={() => setFile(null)}>
                                <RefreshCw size={16} /> Reiniciar
                            </Button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {!analysis ? (
                            <motion.div
                                key="empty"
                                className="p-12 text-center rounded-3xl border border-on-background/5 bg-surface/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <p className="text-on-background/40">Sube un logo para ver el análisis de estilo y sugerencias de IA.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                                        <CheckCircle2 size={20} /> Estilo Identificado
                                    </div>
                                    <p className="text-2xl font-display font-bold text-on-background capitalize">{analysis.style}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10">
                                        <p className="text-sm font-medium text-secondary/70 mb-2 uppercase tracking-wider">Paleta Extractada</p>
                                        <div className="flex gap-2">
                                            {analysis.colors.map((color: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full border border-black/5"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-tertiary/5 border border-tertiary/10">
                                        <p className="text-sm font-medium text-tertiary/70 mb-2 uppercase tracking-wider">Sectores</p>
                                        <p className="font-bold text-on-background truncate">{analysis.useCases?.join(', ') || 'General'}</p>
                                    </div>
                                </div>

                                <div className="p-8 rounded-3xl bg-white border border-on-background/5 shadow-sm">
                                    <h4 className="font-display font-bold mb-4">Auditoría Técnica</h4>
                                    <p className="text-on-background/70 leading-relaxed mb-6">
                                        {analysis.audit}
                                    </p>
                                    <hr className="mb-6 opacity-5" />
                                    <h4 className="font-display font-bold mb-4">Sugerencias Pro</h4>
                                    <ul className="space-y-3">
                                        {analysis.suggestions.map((s: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm text-on-background/80">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Variations Section */}
                                <div className="mt-12 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-display font-bold">Rediseño Creativo</h3>
                                        {!variations.length && (
                                            <Button
                                                onClick={generateVariations}
                                                disabled={isGenerating}
                                                className="gap-2"
                                            >
                                                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : 'Generar Variantes'}
                                            </Button>
                                        )}
                                    </div>

                                    {variations.length > 0 && (
                                        <div className="grid grid-cols-1 gap-6">
                                            {variations.map((v: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 hover:bg-white hover:shadow-xl transition-all duration-300 group"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <h4 className="text-xl font-display font-bold text-primary">{v.conceptName}</h4>
                                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">IA Concept</span>
                                                    </div>
                                                    <p className="text-on-background/70 mb-4 italic">
                                                        "{v.visualDescription}"
                                                    </p>
                                                    <div className="p-4 rounded-2xl bg-white border border-on-background/5">
                                                        <p className="text-sm font-medium"><span className="text-primary font-bold">Racional:</span> {v.rational}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
