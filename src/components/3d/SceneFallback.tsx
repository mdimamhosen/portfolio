import { useEffect, useRef } from "react";

const SceneFallback = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Generate stars
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Deep space base gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, "#08090f");
      bgGrad.addColorStop(0.5, "#040508");
      bgGrad.addColorStop(1, "#020203");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient glowing nebula orbs
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.45,
        Math.min(width, height) * 0.4
      );
      nebulaGrad.addColorStop(0, "rgba(255, 107, 53, 0.06)");
      nebulaGrad.addColorStop(0.5, "rgba(255, 215, 0, 0.02)");
      nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw and animate stars
      for (const star of stars) {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const currentAlpha =
          star.alpha + Math.sin(frame * star.twinkleSpeed + star.twinklePhase) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${clampedAlpha})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="canvas-container fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020203]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SceneFallback;
