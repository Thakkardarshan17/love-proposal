import React, { useEffect, useRef } from 'react';

interface BackgroundEffectsProps {
  intensity?: 'subtle' | 'romantic' | 'celebration';
  sceneTheme?: 'dark' | 'lightPink' | 'burgundy' | 'starry';
  theme?: 'dark' | 'lightPink' | 'burgundy' | 'starry';
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  targetOpacity: number;
  scale: number;
  pulseSpeed: number;
  pulsePhase: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
  glow: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaSpeed: number;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  intensity = 'romantic',
  sceneTheme,
  theme
}) => {
  const currentTheme = theme || sceneTheme || 'burgundy';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Heart Color Palette
    const heartColors = [
      '#E8899D', // Romantic Blush Rose
      '#F7B8C5', // Soft Fairy Pink
      '#FF7096', // Warm Love Pink
      '#D8A06C', // Champagne Gold
      '#FF97B7', // Glow Rose
      '#E63956', // Ruby Heart
      '#FFD1DC'  // Pastel Light
    ];

    const petalColors = ['#E8899D', '#F7B8C5', '#D8A06C', '#C44D6A', '#FFA8BA'];

    // Increase heart counts for rich, visible background heart animation
    const heartCount = intensity === 'celebration' ? 45 : intensity === 'romantic' ? 28 : 16;
    const petalCount = intensity === 'celebration' ? 30 : intensity === 'romantic' ? 18 : 10;
    const starCount = currentTheme === 'starry' || currentTheme === 'dark' ? 60 : 35;

    // Create Floating Hearts
    const hearts: FloatingHeart[] = Array.from({ length: heartCount }, () => {
      const baseSize = Math.random() * 18 + 10; // Sizes between 10px and 28px
      const op = Math.random() * 0.5 + 0.35; // Clearly visible opacity (0.35 - 0.85)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        speedY: -(Math.random() * 0.85 + 0.45), // Smooth upward drift
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: op,
        targetOpacity: op,
        scale: 1,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.3,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        glow: Math.random() * 14 + 8
      };
    });

    // Create Petals
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 6,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.4 + 0.2,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01
    }));

    // Create Twinkling Stars
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.6,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    }));

    // Draw Vector-Perfect Heart with Soft Glow
    const drawHeart = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      rotation: number,
      glow: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      if (rotation) ctx.rotate(rotation);
      
      const s = size / 26; // Normalized scale
      ctx.scale(s, s);
      
      ctx.beginPath();
      // Mathematically curved symmetric upright heart path
      ctx.moveTo(0, -6);
      ctx.bezierCurveTo(-10, -20, -24, -6, -24, 6);
      ctx.bezierCurveTo(-24, 18, -8, 28, 0, 36);
      ctx.bezierCurveTo(8, 28, 24, 18, 24, 6);
      ctx.bezierCurveTo(24, -6, 10, -20, 0, -6);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
      ctx.shadowColor = color;
      ctx.shadowBlur = glow;
      ctx.fill();
      ctx.restore();
    };

    // Draw Rose Petal
    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      p: Petal
    ) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    };

    // Main Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Twinkling Ambient Stars
      stars.forEach(star => {
        star.alpha += star.alphaSpeed;
        if (star.alpha > 0.9) {
          star.alpha = 0.9;
          star.alphaSpeed = -star.alphaSpeed;
        } else if (star.alpha < 0.1) {
          star.alpha = 0.1;
          star.alphaSpeed = -star.alphaSpeed;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF3EF';
        ctx.globalAlpha = star.alpha * 0.65;
        ctx.shadowColor = '#F7B8C5';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
      });

      // 2. Draw Floating & Pulsing Animated Hearts (Ascending with gentle sway)
      hearts.forEach(h => {
        h.wobble += h.wobbleSpeed;
        h.pulsePhase += h.pulseSpeed;
        h.y += h.speedY;
        h.x += Math.sin(h.wobble) * 0.75 + h.speedX;
        h.rotation += h.rotSpeed;

        // Subtle gentle heart pulse
        const currentSize = h.size * (1 + Math.sin(h.pulsePhase) * 0.08);

        // Respawn when heart floats off the top
        if (h.y < -40) {
          h.y = height + 30;
          h.x = Math.random() * width;
        }

        drawHeart(ctx, h.x, h.y, currentSize, h.color, h.opacity, h.rotation, h.glow);
      });

      // 3. Draw Falling Rose Petals
      petals.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.y += p.speedY;
        p.x += Math.sin(p.wobble) * 0.8 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        drawPetal(ctx, p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      id="romantic-canvas-effects"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
