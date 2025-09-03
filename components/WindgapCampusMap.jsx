import React from "react";

import { useWindgapGame, GameActions } from "../context/WindgapGameContext";
import {
  letterMap,
  punctuationMap1,
  punctuationMap2,
  longPunctuationMap,
} from "../utils/speechrecMappings";

import BackToTopButton from "./BackToTopButton";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

// Example: Accepts mapData as prop (from JSON)
export default function WindgapCampusMap({ mapData }) {
  const { state, dispatch } = useWindgapGame();

  // Speech recognition setup
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

  // Expanded logic for more items
  function handleVoiceCommand(phrase) {
    const char =
      letterMap[phrase] ||
      punctuationMap1[phrase] ||
      punctuationMap2[phrase] ||
      longPunctuationMap[phrase];
    if (char) {
      switch (char) {
        case "a":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted apple or selected avatar A" });
          return (
            <div className="relative">
              <Spinner show={false} size={32} className="absolute left-1/2 top-1/2" />
              <BackToTopButton />
              <div
                className="campus-map grid grid-cols-50 gap-0 border border-gray-300 bg-blue-50"
                style={{ width: width * tileSize, height: height * tileSize }}
                role="grid"
                aria-label="Campus Map"
              >
                {/* Example usage: call handleVoiceCommand with a test phrase */}
                <Tooltip text="Test voice command">
                  <button
                    onClick={() => handleVoiceCommand("acid")}
                    className="m-2 p-2 bg-green-200 rounded"
                  >
                    Test: Plant Apple ("acid")
                  </button>
                </Tooltip>
                {baseLayer.data.map((tileId, i) => {
                  const x = i % width;
                  const y = Math.floor(i / width);
                  return (
                    <div
                      key={i}
                      className="tile border border-gray-200 bg-white"
                      style={{ width: tileSize, height: tileSize }}
                      tabIndex={0}
                      aria-label={`Tile ${tileId} at (${x},${y})`}
                      role="gridcell"
                    >
                      {tileId}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        case "i":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted iceberg lettuce or selected avatar I",
          });
          break;
        case "j":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted jalapeno or selected avatar J",
          });
          break;
        case "k":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted kale or selected avatar K" });
          break;
        case "l":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted leek or selected avatar L" });
          break;
        case "m":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted mushroom or selected avatar M",
          });
          break;
        case "n":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted napa cabbage or selected avatar N",
          });
          break;
        case "o":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted onion or selected avatar O" });
          break;
        case "p":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted potato or selected avatar P",
          });
          break;
        case "q":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted quince or selected avatar Q",
          });
          break;
        case "r":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted radish or selected avatar R",
          });
          break;
        case "s":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted spinach or selected avatar S",
          });
          break;
        case "t":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted tomato or selected avatar T",
          });
          break;
        case "u":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted ugli fruit or selected avatar U",
          });
          break;
        case "v":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted vanilla bean or selected avatar V",
          });
          break;
        case "w":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted watermelon or selected avatar W",
          });
          break;
        case "x":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted xigua (Chinese melon) or selected avatar X",
          });
          break;
        case "y":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Planted yam or selected avatar Y" });
          break;
        case "z":
          dispatch({
            type: GameActions.SHOW_DIALOG,
            dialog: "Planted zucchini or selected avatar Z",
          });
          break;
        case ".":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Added salt (dot)" });
          break;
        case ",":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Added pepper (comma)" });
          break;
        case "+":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Added ingredient (plus)" });
          break;
        case "-":
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: "Removed ingredient (minus)" });
          break;
        default:
          dispatch({ type: GameActions.SHOW_DIALOG, dialog: `Triggered action for: ${char}` });
      }
    } else {
      dispatch({ type: GameActions.SHOW_DIALOG, dialog: `No mapping found for phrase: ${phrase}` });
    }
  }

  // Voice command handler using speech recognition mappings
  function handleVoiceCommand(phrase) {
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
  }

  // Render tiles as grid (simple Canvas, can be upgraded to SVG/WebGL)
  const tileSize = mapData.tilewidth || 32;
  const width = mapData.width;
  const height = mapData.height;
  const baseLayer = mapData.layers.find((l) => l.name === "base layer");

  // Click handler for tiles
  function handleTileClick(x, y, tileId) {
    dispatch({ type: GameActions.SET_LOCATION, location: { x, y, tileId } });
    dispatch({
      type: GameActions.SHOW_DIALOG,
      dialog: `You clicked tile ${tileId} at (${x},${y})`,
    });
  }

  return (
    <div
      className="campus-map grid grid-cols-50 gap-0 border border-gray-300 bg-blue-50"
      style={{ width: width * tileSize, height: height * tileSize }}
    >
      {/* Example usage: call handleVoiceCommand with a test phrase */}
      {/* Remove or replace this with actual speech input integration */}
      <button onClick={() => handleVoiceCommand("acid")} className="m-2 p-2 bg-green-200 rounded">
        Test: Plant Apple ("acid")
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
