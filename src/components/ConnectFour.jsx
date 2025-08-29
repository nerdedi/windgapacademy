import React, { useState, useEffect } from 'react';
import Spinner from "../../components/Spinner";
import Tooltip from "../../components/Tooltip";
import BackToTopButton from "../../components/BackToTopButton";
import { letterMap, punctuationMap1, punctuationMap2, longPunctuationMap } from '../../utils/speechrecMappings';
import { motion } from 'framer-motion';

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const PLAYER = ['zombie', 'human'];
const COLORS = ['#4B5320', '#C0C0C0']; // Example colors for zombie/human

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
      if (c + 3 < COLS && cell === board[r][c+1] && cell === board[r][c+2] && cell === board[r][c+3]) return cell;
      // Vertical
      if (r + 3 < ROWS && cell === board[r+1][c] && cell === board[r+2][c] && cell === board[r+3][c]) return cell;
      // Diagonal /
      if (r + 3 < ROWS && c + 3 < COLS && cell === board[r+1][c+1] && cell === board[r+2][c+2] && cell === board[r+3][c+3]) return cell;
      // Diagonal \
      if (r - 3 >= 0 && c + 3 < COLS && cell === board[r-1][c+1] && cell === board[r-2][c+2] && cell === board[r-3][c+3]) return cell;
    }
  }
  return null;
}

export default function ConnectFour() {
  // Speech recognition setup
  useEffect(() => {
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

  // Expanded logic for game actions
  function handleVoiceCommand(phrase) {
    const char = letterMap[phrase] || punctuationMap1[phrase] || punctuationMap2[phrase] || longPunctuationMap[phrase];
    if (char) {
      switch (char) {
        case 'r':
          handleReset();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          handleColumnClick(Number(char) - 1);
          break;
        default:
          alert(`Triggered game action for: ${char}`);
      }
      } else {
        alert(`No mapping found for phrase: ${phrase}`);
      }
    }
