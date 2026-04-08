'use client';

import React from 'react';
import { ThemeContext } from 'styled-components';

const useStyledTheme = () => {
  return React.useContext(ThemeContext);
};

export default useStyledTheme;
