import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo);

  const handleVideoSrcSet = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcSet);
    return () => {
      window.removeEventListener("resize", handleVideoSrcSet);
    };
  }, []);

  // Framer Motion handles animation declaratively below

  return (
    <motion.section
      className="w-full nav-height bg-black relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <div className="h-5/6 w-full flex-center flex-col">
        <motion.p
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          Windgap Academy
        </motion.p>
        <div className="md:w-10/12 w-9/12">
          <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: -50 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <a href="#highlights" className="btn">
          Explore
        </a>
        <p className="font-normal text-xl">Empowering learning for everyone</p>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
