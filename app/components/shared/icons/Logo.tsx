'use client';

import React from 'react';
import styled from 'styled-components';
import useCursorStyle from '../../../hooks/useCursorStyle';

const LogoText = styled.span`
  font-family: presicav, sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 0.1em;
  user-select: none;
`;

const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.red};
  flex-shrink: 0;
  vertical-align: middle;
  margin-left: 2px;
`;

const Logo = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { ...rootProps } = props;
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  return (
    <LogoText
      onMouseEnter={addCursorBorder}
      onMouseLeave={removeCursorBorder}
      {...rootProps}
    >
      MATCH<Dot />
    </LogoText>
  );
};

export default Logo;
