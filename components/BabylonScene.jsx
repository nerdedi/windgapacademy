import React, { useRef, useEffect } from "react";

export default function BabylonScene({ createScene, width = 600, height = 400, className = "" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    let engine, scene;
    import("babylonjs").then((BABYLON) => {
      engine = new BABYLON.Engine(canvasRef.current, true);
      createScene(engine, canvasRef.current).then((s) => {
        scene = s;
        engine.runRenderLoop(() => scene.render());
      });
      window.addEventListener("resize", () => engine.resize());
    });
    return () => {
      if (engine) {
        engine.stopRenderLoop();
        engine.dispose();
      }
    };
  }, [createScene]);
  return <canvas ref={canvasRef} width={width} height={height} className={className} />;
}
