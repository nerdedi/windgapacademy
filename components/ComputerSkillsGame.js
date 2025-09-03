import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

const ComputerSkillsGame = () => {
  const typedElement = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: [
        "Welcome to the Computer Skills Game!",
        "Drag the pink box to the target area.",
        "Practice your mouse skills!",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  // Animate box to target when dropped inside target area
  const handleDragEnd = (event, info) => {
    const targetLeft = 350;
    const targetTop = 200;
    const boxLeft = info.point.x;
    const boxTop = info.point.y;
    // Check if dropped inside target area
    if (
      boxLeft > targetLeft &&
      boxLeft < targetLeft + 120 &&
      boxTop > targetTop &&
      boxTop < targetTop + 120
    ) {
      controls.start({
        x: targetLeft,
        y: targetTop,
        scale: 0.8,
        rotate: 180,
        backgroundColor: "#888",
        borderColor: "black",
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      });
      setTimeout(() => {
        controls.start({
          opacity: 0,
          scale: 0.1,
          transition: { duration: 0.3 },
        });
      }, 2000);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem", position: "relative", height: 500 }}>
      <span ref={typedElement} />
      <motion.div
        drag
        animate={controls}
        initial={{
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          backgroundColor: "deeppink",
          borderColor: "#fff",
        }}
        onDragEnd={handleDragEnd}
        style={{
          width: 100,
          height: 100,
          position: "absolute",
          left: 0,
          top: 0,
          cursor: "grab",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          border: "4px solid #fff",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 350,
          top: 200,
          width: 120,
          height: 120,
          border: "2px dashed #888",
          borderRadius: 12,
          background: "rgba(200,200,255,0.1)",
          zIndex: 1,
        }}
      >
        <span style={{ position: "absolute", top: "40%", left: "10%", color: "#888" }}>
          Target Area
        </span>
      </div>
    </div>
  );
};

export default ComputerSkillsGame;
