import React from 'react';
import Spinner from "../../components/Spinner";
import Tooltip from "../../components/Tooltip";
import { letterMap, punctuationMap1, punctuationMap2, longPunctuationMap } from '../../utils/speechrecMappings';
import { motion } from 'framer-motion';

function AvatarBuilder() {
  // Speech recognition setup
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const phrase = event.results[i][0].transcript.trim().toLowerCase();
          handleVoiceCommand(phrase);
        }
      }
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    recognition.onend = () => {
      recognition.start(); // Restart for continuous listening
    };
    recognition.start();
    return () => recognition.stop();
  }, []);

  // Expanded logic for avatar selection/customization
  function handleVoiceCommand(phrase) {
    const char = letterMap[phrase] || punctuationMap1[phrase] || punctuationMap2[phrase] || longPunctuationMap[phrase];
    if (char) {
      switch (char) {
        case 'a':
          alert('Selected avatar: Alice (voice command)');
          break;
        case 'b':
          alert('Selected avatar: Bob (voice command)');
          break;
        case 'w':
          alert('Selected avatar: Winnie (voice command)');
          break;
        // Add more avatar mappings as needed
        default:
          alert(`Triggered avatar action for: ${char}`);
      }
    } else {
      alert(`No mapping found for phrase: ${phrase}`);
    }
  }
  return (
    <motion.section
      className="card shadow-xl p-8 rounded-2xl mx-auto my-16 max-w-3xl relative bg-white/80 backdrop-blur-lg grid grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
  <div className="avatarbuilder-bg" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:-1,background:"url('/assets/backgrounds/avatarbuilder-bg.svg') center/cover no-repeat"}}></div>
  <Spinner show={false} size={32} className="absolute left-1/2 top-1/2" />
      <div className="col-span-4 flex items-center justify-between mb-4">
        <motion.h2
          id="avatar-heading"
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Avatar Builder
        </motion.h2>
        <div className="live-preview-window rounded-xl shadow-lg bg-gradient-to-br from-yellow-100 to-blue-100 flex items-center justify-center" style={{width:120,height:120}}>
          <Tooltip text="Avatar Preview">
            <img id="avatar-preview" src="/assets/images/avatar-default.png" alt="Avatar Preview" className="w-24 h-24 rounded-full" />
          </Tooltip>
          <div className="avatar-overlay"></div>
        </div>
      </div>
      <aside className="col-span-1 flex flex-col gap-4">
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Hair</motion.div>
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Outfits</motion.div>
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Accessories</motion.div>
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Facial Features</motion.div>
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Body Type</motion.div>
        <motion.div className="feature-card bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Wheelchair</motion.div>
      </aside>
      <main className="col-span-2 flex flex-col items-center justify-center">
        <motion.div id="customization-area" className="drag-drop-area bg-gray-100 rounded shadow p-4" whileHover={{ scale: 1.02 }}>
          Drag & Drop Customization
        </motion.div>
      </main>
      <aside className="col-span-1 flex flex-col gap-4">
        <motion.div className="color-picker bg-white rounded shadow p-4" whileHover={{ scale: 1.05 }}>Colour Pickers</motion.div>
        <motion.div className="unlockable-packs bg-white rounded shadow p-4 mt-4" whileHover={{ scale: 1.05 }}>Unlockable Style Packs</motion.div>
      </aside>
      <div className="col-span-4 flex gap-4 mt-6">
        <motion.button id="avatar-save" className="btn-primary nav-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>Save Avatar</motion.button>
        <motion.button id="avatar-reset" className="btn-secondary nav-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>Reset</motion.button>
        <motion.button id="avatar-apply" className="btn-secondary nav-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>Apply</motion.button>
        <motion.button id="avatar-random" className="btn-secondary nav-btn" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>Randomise</motion.button>
      </div>
    </motion.section>
  );
}

export default AvatarBuilder;
