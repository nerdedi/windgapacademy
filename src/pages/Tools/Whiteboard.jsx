import { useEffect, useRef } from "react";

// Portions of this file were generated with the assistance of GitHub Copilot
// Converted from static HTML to React component

export default function WhiteboardPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamically import Excalidraw
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Excalidraw from 'https://unpkg.com/@excalidraw/excalidraw/dist/excalidraw.min.mjs';
      const container = document.getElementById('whiteboard-container');
      const excalidraw = new Excalidraw(container, {
        theme: 'light',
        langCode: 'en',
        UIOptions: {
          canvasActions: {
            toggleTheme: true,
            export: true,
          },
        },
      });
    `;

    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
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
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Windgap Academy Whiteboard</h1>
      <p className="mb-4">Interactive whiteboard for creative expression and teaching.</p>
      <div
        id="whiteboard-container"
        ref={containerRef}
        className="w-full max-w-[1200px] h-[700px] rounded-xl shadow-xl bg-white overflow-hidden"
      />
    </div>
  );
}
