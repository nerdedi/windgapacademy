import { motion } from "framer-motion";
import React, { useRef } from "react";

import { explore1Img, explore2Img, exploreVideo } from "../utils";

const Features = () => {
  const videoRef = useRef();

  return (
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-wdith">
        <div className="mb-12 w-full">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="section-heading"
          >
            Explore the full story.
          </motion.h1>
        </div>
        <div className="flex flex-col justify-center items-center overflow-hidden">
          <div className="mt-32 mb-24 pl-24">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-5xl lg:text-7xl font-semibold"
            >
              Windgap Learning.
            </motion.h2>
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="text-5xl lg:text-7xl font-semibold"
            >
              Forged in innovation.
            </motion.h2>
          </div>
          <div className="flex-center flex-col sm:px-10">
            <div className="relative h-[50vh] w-full flex items-center">
              <motion.video
                playsInline
                className="w-full h-full object-cover object-center"
                preload="none"
                muted
                autoPlay
                ref={videoRef}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <source src={exploreVideo} type="video/mp4" />
              </motion.video>
            </div>
            <div className="flex flex-col w-full relative">
              <div className="feature-video-container">
                <motion.div
                  className="overflow-hidden flex-1 h-[50vh]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  <img src={explore1Img} alt="innovation" className="feature-video" />
                </motion.div>
                <motion.div
                  className="overflow-hidden flex-1 h-[50vh]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                  <img src={explore2Img} alt="innovation 2" className="feature-video" />
                </motion.div>
              </div>
              <div className="feature-text-container">
                <motion.div
                  className="flex-1 flex-center"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                >
                  <p className="feature-text">
                    Windgap Academy is{" "}
                    <span className="text-blue-500">designed for every learner</span>, using the
                    latest technology for engaging education.
                  </p>
                </motion.div>
                <motion.div
                  className="flex-1 flex-center"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                >
                  <p className="feature-text">
                    Our platform is <span className="text-blue-500">lightweight and powerful.</span>
                    You'll notice the difference the moment you start learning.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
