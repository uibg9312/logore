'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, Download } from 'lucide-react';

const steps = [
    {
        title: "Sube tu logo",
        description: "Arrastra tu archivo (PNG, JPG o SVG) y nuestro radar lo procesará localmente.",
        icon: Upload,
        color: "bg-primary/10 text-primary"
    },
    {
        title: "Análisis IA",
        description: "Gemini realiza una auditoría profunda de estilo, color y legibilidad.",
        icon: Cpu,
        color: "bg-secondary/10 text-secondary"
    },
    {
        title: "Kit de marca",
        description: "Descarga versiones vectoriales, monocromáticas y variaciones mejoradas.",
        icon: Download,
        color: "bg-tertiary/10 text-tertiary"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 px-4 bg-surface">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16 px-4">
                    Diseño Profesional <br /> <span className="text-primary">al Instante</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, translateY: -10 }}
                            className="p-8 rounded-3xl bg-background border border-on-background/5 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                                <step.icon size={28} />
                            </div>
                            <h3 className="text-xl font-display font-bold mb-4">{step.title}</h3>
                            <p className="text-on-background/60 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
