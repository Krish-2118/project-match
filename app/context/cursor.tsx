'use client';

import React from 'react';
import colors from '../styles/colors';

type CursorState = {
  cursorStyle: { bordered: boolean; color: string };
  position: { x: number; y: number } | null;
};

type CursorAction =
  | { type: 'UPDATE_CURSOR_STYLE'; payload: Partial<CursorState['cursorStyle']> }
  | { type: 'ADD_CURSOR_BORDER' }
  | { type: 'REMOVE_CURSOR_BORDER' }
  | { type: 'ADD_CURSOR_COLOR'; payload: string }
  | { type: 'RESET_CURSOR_COLOR' }
  | { type: 'LOCK_CURSOR_POSITION'; payload: { x: number; y: number } | null };

const INITIAL_STATE: CursorState = {
  cursorStyle: { bordered: false, color: colors.red },
  position: null,
};

const rootReducer = (state: CursorState, action: CursorAction): CursorState => {
  switch (action.type) {
    case 'UPDATE_CURSOR_STYLE':
      return { ...state, cursorStyle: { ...state.cursorStyle, ...action.payload } };
    case 'ADD_CURSOR_BORDER':
      return { ...state, cursorStyle: { ...state.cursorStyle, bordered: true } };
    case 'REMOVE_CURSOR_BORDER':
      return { ...state, cursorStyle: { ...state.cursorStyle, bordered: false } };
    case 'ADD_CURSOR_COLOR':
      return { ...state, cursorStyle: { ...state.cursorStyle, color: action.payload } };
    case 'RESET_CURSOR_COLOR':
      return { ...state, cursorStyle: { ...state.cursorStyle, color: INITIAL_STATE.cursorStyle.color } };
    case 'LOCK_CURSOR_POSITION':
      return { ...state, position: action.payload };
    default:
      return state;
  }
};

type CursorStore = { state: CursorState; dispatch: React.Dispatch<CursorAction> };

export const CursorContext = React.createContext<CursorStore | undefined>(undefined);

export const CursorContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, INITIAL_STATE);
  const store = React.useMemo(() => ({ state, dispatch }), [state]);
  return <CursorContext.Provider value={store}>{children}</CursorContext.Provider>;
};

export const useCursorContext = () => {
  const ctx = React.useContext(CursorContext);
  if (!ctx) throw new Error('useCursorContext must be used within CursorContextProvider');
  const { state, dispatch } = ctx;
  return [state, dispatch] as const;
};
