'use client';

import React from 'react';
import { ThemeContext, DefaultTheme } from 'styled-components';

type QueryFn = (theme: DefaultTheme) => string;

const useMediaQuery = (queryInput: string | QueryFn): boolean => {
  const theme = React.useContext(ThemeContext);
  // Ensure theme is not undefined before passing it to QueryFn
  // If theme is undefined, we default to an empty object for type safety,
  // though in a real styled-components app, ThemeContext should always provide a theme.
  const effectiveTheme = theme || {} as DefaultTheme; 
  let query = typeof queryInput === 'function' ? queryInput(effectiveTheme) : queryInput;
  query = query.replace(/^@media( ?)/m, '');

  const isClientSide = typeof window !== 'undefined';
  const matchMedia = isClientSide ? window.matchMedia : null;

  const [match, setMatch] = React.useState(() => {
    if (isClientSide && matchMedia) return matchMedia(query).matches;
    return false;
  });

  React.useEffect(() => {
    if (!isClientSide || !matchMedia) return;
    const queryList = matchMedia(query);
    const updateMatch = () => setMatch(queryList.matches);
    updateMatch();
    queryList.addEventListener('change', updateMatch);
    return () => queryList.removeEventListener('change', updateMatch);
  }, [query, matchMedia, isClientSide]);

  return match;
};

export default useMediaQuery;
