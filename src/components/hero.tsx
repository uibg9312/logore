'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                delay: 0.2
            });

            gsap.from(subtitleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.5
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background patterns could be added here */}
            <div className="absolute inset-0 -z-10 bg-radial-[at_50%_50%] from-primary/10 to-background pointer-events-none" />

            <h1
                ref={titleRef}
                className="text-5xl md:text-7xl font-display font-bold tracking-tight text-on-background mb-6"
            >
                Tu Agencia de <span className="text-primary italic">Branding</span> <br />
                Impulsada por IA
            </h1>

            <p
                ref={subtitleRef}
                className="max-w-2xl text-lg md:text-xl text-on-background/70 mb-10"
            >
                Sube tu logo y obtén instantáneamente un kit de marca profesional,
                auditoría técnica y variaciones inteligentes generadas por Google Gemini.
            </p>

            <div className="flex gap-4">
                <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Comenzar Gratis
                </Button>
            </div>
        </section>
    );
}
