import React, { createContext, useReducer, useContext } from "react";

// Windgap Academy game views
export const GameViews = {
  CAMPUS: "CAMPUS",
  MINI_GAME: "MINI_GAME",
  CALM_SPACE: "CALM_SPACE",
  INVENTORY: "INVENTORY",
  WINNIE_HOME: "WINNIE_HOME",
};

// Action types
export const GameActions = {
  FETCH_MAP_DATA: "FETCH_MAP_DATA",
  MOVE: "MOVE",
  SET_LOCATION: "SET_LOCATION",
  START_MINI_GAME: "START_MINI_GAME",
  END_MINI_GAME: "END_MINI_GAME",
  SHOW_ONBOARDING: "SHOW_ONBOARDING",
  HIDE_ONBOARDING: "HIDE_ONBOARDING",
  OPEN_CALM_SPACE: "OPEN_CALM_SPACE",
  CLOSE_CALM_SPACE: "CLOSE_CALM_SPACE",
  UPDATE_TOKENS: "UPDATE_TOKENS",
  SHOW_DIALOG: "SHOW_DIALOG",
  HIDE_DIALOG: "HIDE_DIALOG",
};

const initialState = {
  view: GameViews.CAMPUS,
  location: null,
  tokens: 0,
  onboardingVisible: false,
  dialog: null,
  miniGameActive: false,
  calmSpaceActive: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case GameActions.FETCH_MAP_DATA:
      return { ...state };
    case GameActions.MOVE:
      return { ...state, location: action.location };
    case GameActions.SET_LOCATION:
      return { ...state, location: action.location };
    case GameActions.START_MINI_GAME:
      return { ...state, view: GameViews.MINI_GAME, miniGameActive: true };
    case GameActions.END_MINI_GAME:
      return { ...state, view: GameViews.CAMPUS, miniGameActive: false };
    case GameActions.SHOW_ONBOARDING:
      return { ...state, onboardingVisible: true };
    case GameActions.HIDE_ONBOARDING:
      return { ...state, onboardingVisible: false };
    case GameActions.OPEN_CALM_SPACE:
      return { ...state, view: GameViews.CALM_SPACE, calmSpaceActive: true };
    case GameActions.CLOSE_CALM_SPACE:
      return { ...state, view: GameViews.CAMPUS, calmSpaceActive: false };
    case GameActions.UPDATE_TOKENS:
      return { ...state, tokens: action.tokens };
    case GameActions.SHOW_DIALOG:
      return { ...state, dialog: action.dialog };
    case GameActions.HIDE_DIALOG:
      return { ...state, dialog: null };
    default:
      return state;
  }
}

const WindgapGameContext = createContext();

export function WindgapGameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <WindgapGameContext.Provider value={{ state, dispatch }}>
      {children}
    </WindgapGameContext.Provider>
  );
}

export function useWindgapGame() {
  return useContext(WindgapGameContext);
}
