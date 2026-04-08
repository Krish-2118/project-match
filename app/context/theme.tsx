'use client';

import React from 'react';

const storageKey = '@ProjectMatchTheme:Theme';
type ThemeState = { theme: 'dark' | 'light' };
type ThemeAction = { type: 'TOGGLE_THEME' } | { type: 'SET_THEME'; payload: 'dark' | 'light' };
type ThemeStore = { state: ThemeState; dispatch: React.Dispatch<ThemeAction> };

const INITIAL_STATE: ThemeState = { theme: 'dark' };

const rootReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, newTheme);
      return { ...state, theme: newTheme };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export const ThemeContext = React.createContext<ThemeStore | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, INITIAL_STATE);
  const store = React.useMemo(() => ({ state, dispatch }), [state]);

  React.useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) as 'dark' | 'light' | null;
    dispatch({ type: 'SET_THEME', payload: saved || 'dark' });
  }, []);

  return <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeContextProvider');
  const { state, dispatch } = ctx;
  return [state, dispatch] as const;
};
