'use client';

import React from 'react';

type MenuState = { isMenuOpen: boolean };
type MenuAction = { type: 'TOGGLE_MENU' };
type MenuStore = { state: MenuState; dispatch: React.Dispatch<MenuAction> };

export const INITIAL_STATE: MenuState = { isMenuOpen: false };

const rootReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen };
    default:
      return state;
  }
};

export const MenuContext = React.createContext<MenuStore | undefined>(undefined);

export const MenuContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(rootReducer, INITIAL_STATE);
  const store = React.useMemo(() => ({ state, dispatch }), [state]);
  return <MenuContext.Provider value={store}>{children}</MenuContext.Provider>;
};

export const useMenuContext = () => {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('useMenuContext must be used within MenuContextProvider');
  const { state, dispatch } = ctx;
  return [state, dispatch] as const;
};
