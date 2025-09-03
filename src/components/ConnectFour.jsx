import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import BackToTopButton from "../../components/BackToTopButton";
import Spinner from "../../components/Spinner";
import Tooltip from "../../components/Tooltip";
import {
  letterMap,
  punctuationMap1,
  punctuationMap2,
  longPunctuationMap,
} from "../../utils/speechrecMappings";

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const PLAYER = ["zombie", "human"];
const COLORS = ["#4B5320", "#C0C0C0"]; // Example colors for zombie/human

function getInitialBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}
function checkWinner(board) {
  // Horizontal, vertical, diagonal checks
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (!cell) continue;
      // Horizontal
      if (
        c + 3 < COLS &&
        cell === board[r][c + 1] &&
        cell === board[r][c + 2] &&
        cell === board[r][c + 3]
      )
        return cell;
      // Vertical
      if (
        r + 3 < ROWS &&
        cell === board[r + 1][c] &&
        cell === board[r + 2][c] &&
        cell === board[r + 3][c]
      )
        return cell;
      // Diagonal /
      if (
        r + 3 < ROWS &&
        c + 3 < COLS &&
        cell === board[r + 1][c + 1] &&
        cell === board[r + 2][c + 2] &&
        cell === board[r + 3][c + 3]
      )
        return cell;
      // Diagonal \
      if (
        r - 3 >= 0 &&
        c + 3 < COLS &&
        cell === board[r - 1][c + 1] &&
        cell === board[r - 2][c + 2] &&
        cell === board[r - 3][c + 3]
      )
        return cell;
    }
  }
  return null;
}

export default function ConnectFour() {
  // Speech recognition setup
  useEffect(() => {
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

  // Expanded logic for game actions
  function handleVoiceCommand(phrase) {
    const char =
      letterMap[phrase] ||
      punctuationMap1[phrase] ||
      punctuationMap2[phrase] ||
      longPunctuationMap[phrase];
    if (char) {
      switch (char) {
        case "r":
          handleReset();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
          handleColumnClick(Number(char) - 1);
          break;
        default:
          alert(`Triggered game action for: ${char}`);
      }
    } else {
      alert(`No mapping found for phrase: ${phrase}`);
    }
  }

  // Game state
  const [board, setBoard] = useState(getInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 or 1
  const [winner, setWinner] = useState(null);

  function handleColumnClick(col) {
    if (winner) return;
    const newBoard = board.map((row) => row.slice());
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === EMPTY) {
        newBoard[r][col] = PLAYER[currentPlayer];
        setBoard(newBoard);
        const w = checkWinner(newBoard);
        if (w) setWinner(w);
        setCurrentPlayer((currentPlayer + 1) % PLAYER.length);
        return;
      }
    }
    // Column full
  }

  function handleReset() {
    setBoard(getInitialBoard());
    setCurrentPlayer(0);
    setWinner(null);
  }

  // Simple visual cell renderer
  function renderCell(cell, r, c) {
    const color = cell === PLAYER[0] ? COLORS[0] : cell === PLAYER[1] ? COLORS[1] : "transparent";
    return (
      <div
        key={`${r}-${c}`}
        className="cf-cell"
        style={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #ccc",
          background: "#0066cc",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: color,
            boxShadow: color !== "transparent" ? "inset 0 -4px 6px rgba(0,0,0,0.2)" : "none",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Connect Four</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={handleReset}>Reset</button>
        <span style={{ marginLeft: 12 }}>
          {winner ? `Winner: ${winner}` : `Current: ${PLAYER[currentPlayer]}`}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 48px)`, gap: 6 }}>
        {/* Column click overlays */}
        {Array.from({ length: COLS }).map((_, c) => (
          <button key={`col-${c}`} onClick={() => handleColumnClick(c)} style={{ height: 24 }}>
            Drop
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 48px)`,
          gap: 6,
        }}
      >
        {board.map((row, r) => row.map((cell, c) => renderCell(cell, r, c)))}
      </div>

      <div style={{ marginTop: 12 }}>
        <BackToTopButton />
      </div>
    </div>
  );
}
