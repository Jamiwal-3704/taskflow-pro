import React, { useEffect, useRef } from "react";

export const DynamicGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      const isDark =
        document.documentElement.getAttribute("data-theme") !== "light";

      // ── Background fill ──────────────────────────────────────
      if (isDark) {
        // Deep dark navy base
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, width, height);

        // Subtle ambient gradient vignette
        const ambient = ctx.createRadialGradient(
          width / 2, height / 2, 0,
          width / 2, height / 2, Math.max(width, height) * 0.75
        );
        ambient.addColorStop(0, "rgba(15, 23, 60, 0.3)");
        ambient.addColorStop(1, "rgba(2, 6, 23, 0)");
        ctx.fillStyle = ambient;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Light mode: cool slate-blue gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#eef2ff");
        bgGrad.addColorStop(0.5, "#f0f9ff");
        bgGrad.addColorStop(1, "#f1f5f9");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // ── Smooth cursor interpolation ───────────────────────────
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // ── Radial spotlight following cursor ─────────────────────
      const glowRadius = 380;
      const glowGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, glowRadius
      );

      if (isDark) {
        glowGrad.addColorStop(0, "rgba(79, 120, 246, 0.18)");
        glowGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.08)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(99, 102, 241, 0.14)");
        glowGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.06)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // ── Dot grid ─────────────────────────────────────────────
      const dotSpacing = 28;
      const influenceRadius = 220;

      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const factor = 1 - dist / influenceRadius;
            const size = 1.2 + factor * 2.2;

            if (isDark) {
              ctx.fillStyle = `rgba(96, 165, 250, ${0.08 + factor * 0.45})`;
            } else {
              ctx.fillStyle = `rgba(59, 130, 246, ${0.08 + factor * 0.35})`;
            }
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Base dot (outside influence zone)
            const baseOpacity = isDark ? 0.07 : 0.10;
            ctx.fillStyle = isDark
              ? `rgba(148, 163, 184, ${baseOpacity})`
              : `rgba(71, 85, 105, ${baseOpacity})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -10 }}
    />
  );
};
