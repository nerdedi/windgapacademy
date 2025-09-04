import React from "react";

import { useWindgapGame, GameActions } from "../context/WindgapGameContext";
import {
  letterMap,
  punctuationMap1,
  punctuationMap2,
  longPunctuationMap,
} from "../utils/speechrecMappings";

// UI helpers removed (not used in this component)

// Example: Accepts mapData as prop (from JSON)
export default function WindgapCampusMap({ mapData }) {
  const { state: _state, dispatch } = useWindgapGame();

  // Speech recognition setup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not supported");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const phrase = event.results[i][0].transcript.trim().toLowerCase();
          handleVoiceCommand(phrase);
        }
      }
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      recognition.start(); // Restart for continuous listening
    };
    recognition.start();
    return () => recognition.stop();
  }, []);

  // (Removed duplicated/incorrect expanded handler to avoid redeclarations and
  // accidental JSX returns inside an event handler.)

  // Voice command handler using speech recognition mappings
  const handleVoiceCommand = React.useCallback((phrase) => {
    const char =
      letterMap[phrase] ||
      punctuationMap1[phrase] ||
      punctuationMap2[phrase] ||
      longPunctuationMap[phrase];
    if (char) {
      // Example logic: select avatar, plant vegetable, or trigger food item action
      if (char === "a") {
        // Plant apple or select avatar 'A'
        dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted apple or selected avatar A" });
      } else if (char === "b") {
        // Plant broccoli or select avatar 'B'
        dispatch({
          type: GameActions.SHOW_DIALOG,
          dialog: "Planted broccoli or selected avatar B",
        });
      } else {
        dispatch({ type: GameActions.SHOW_DIALOG, dialog: `Triggered action for: ${char}` });
      }
    } else {
      dispatch({ type: GameActions.SHOW_DIALOG, dialog: `No mapping found for phrase: ${phrase}` });
    }
  }, [dispatch]);

  // Render tiles as grid (simple Canvas, can be upgraded to SVG/WebGL)

  // Click handler for tiles
  function handleTileClick(x, y, tileId) {
    dispatch({ type: GameActions.SET_LOCATION, location: { x, y, tileId } });
    dispatch({
      type: GameActions.SHOW_DIALOG,
      dialog: `You clicked tile ${tileId} at (${x},${y})`,
    });
  }

  // Guard baseLayer/data to avoid runtime errors when mapData is incomplete
  const tileSize = mapData?.tilewidth || 32;
  const width = mapData?.width || 10;
  const height = mapData?.height || 10;
  const baseLayer = (mapData?.layers && mapData.layers.find((l) => l.name === "base layer")) || {
    data: [],
  };

  return (
    <div
      className="campus-map grid grid-cols-50 gap-0 border border-gray-300 bg-blue-50"
      style={{ width: width * tileSize, height: height * tileSize }}
    >
      {/* Example usage: call handleVoiceCommand with a test phrase */}
      {/* Remove or replace this with actual speech input integration */}
      <button onClick={() => handleVoiceCommand("acid")} className="m-2 p-2 bg-green-200 rounded">
        Test: Plant Apple (acid)
      </button>
      {baseLayer.data.map((tileId, i) => {
        const x = i % width;
        const y = Math.floor(i / width);
        return (
          <div
            key={i}
            className="tile w-8 h-8 border border-gray-200 inline-block cursor-pointer hover:bg-blue-200"
            aria-label={`Tile ${tileId} at (${x},${y})`}
            tabIndex={0}
            onClick={() => handleTileClick(x, y, tileId)}
            role="button"
          >
            {/* Optionally render tile image or color based on tileId */}
            {tileId !== 0 ? <span className="text-xs">{tileId}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
