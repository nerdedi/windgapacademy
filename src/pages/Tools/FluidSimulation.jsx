import { useEffect, useRef } from "react";

// Portions of this file were generated with the assistance of GitHub Copilot
// Converted from static HTML to React component

export default function FluidSimulationPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let hue = 0;
    let animationFrameId;

    function drawFluid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(40 * i + 20, 250 + Math.sin(hue / 20 + i) * 80, 30, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${(hue + i * 18) % 360}, 80%, 60%)`;
        ctx.fill();
      }
      hue += 2;
      animationFrameId = requestAnimationFrame(drawFluid);
    }

    drawFluid();

    // Cleanup function to cancel animation frame when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="p-8 flex flex-col items-center"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #ffe066 100%)",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Windgap Academy Fluid Simulation</h1>
      <p className="mb-4">Interactive fluid physics simulation using React and Canvas API.</p>
      <canvas ref={canvasRef} width={800} height={500} className="rounded-xl shadow-xl bg-white" />
    </div>
  );
}
