"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    type: "rect" | "circle";
}

const CONFETTI_COLORS = [
    "#f59e0b", // Amber/Gold
    "#fbbf24", // Yellow Gold
    "#ea580c", // Warm Orange
    "#10b981", // Emerald Green
    "#38bdf8", // Sky Blue
    "#ec4899", // Pink
    "#ffffff"  // White
];

export const ConfettiCanvas: React.FC<{ durationMs?: number }> = ({ durationMs = 5000 }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let isRunning = true;
        const startTime = Date.now();

        const resize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Generate particles
        const count = Math.min(100, Math.floor(window.innerWidth / 12));
        const particles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height * 0.8, // start above screen
                size: Math.random() * 8 + 6,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                speedX: (Math.random() - 0.5) * 3,
                speedY: Math.random() * 3 + 2.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 8,
                opacity: 1,
                type: Math.random() > 0.4 ? "rect" : "circle"
            });
        }

        const render = () => {
            if (!isRunning || !ctx || !canvas) return;

            const elapsed = Date.now() - startTime;
            const progress = elapsed / durationMs;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fade out towards end
            const globalAlpha = progress > 0.7 ? Math.max(0, 1 - (progress - 0.7) / 0.3) : 1;

            if (globalAlpha <= 0 || progress >= 1) {
                isRunning = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            particles.forEach((p) => {
                p.x += p.speedX + Math.sin(p.y * 0.01) * 0.8;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                // Reset to top if still early
                if (p.y > canvas.height + 20 && progress < 0.6) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }

                ctx.save();
                ctx.globalAlpha = p.opacity * globalAlpha;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;

                if (p.type === "rect") {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            isRunning = false;
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
        };
    }, [durationMs]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[99998]"
            style={{ width: "100vw", height: "100vh" }}
        />
    );
};
