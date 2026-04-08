'use client';

import React from 'react';
import styled from 'styled-components';
import { useMenuContext } from '../../context/menu';
import useCursorStyle from '../../hooks/useCursorStyle';
import StickyCursor from './StickyCursor';
import { secondaryFontStyle } from '../../styles/shared/text';

const Button = styled.button`
  position: relative;
  display: block;
  text-align: left;
  width: 75px;
  height: 63px;
  padding: 20px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 20px;
    width: 35px;
    height: 7px;
    display: block;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.text};
  }

  &::before { margin-top: -8px; }
  &::after { margin-top: 8px; }

  & span {
    ${secondaryFontStyle};
    position: absolute;
    top: 50%;
    right: 80px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
    pointer-events: none;
    color: ${({ theme }) => theme.text};
  }

  &:hover span { opacity: 1; }

  @media screen and (max-width: 1023px) {
    & span { display: none; }
  }

  @media screen and (max-width: 767px) {
    width: 66px;

    &::before, &::after {
      width: 26px;
      height: 5px;
    }

    &::before { margin-top: -6px; }
    &::after { margin-top: 6px; }
  }
`;

const MenuButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { title?: string; sticky?: boolean }>(
  ({ sticky = true, title = '', ...props }, ref) => {
    const [, dispatch] = useMenuContext();
    const { addCursorBorder, removeCursorBorder } = useCursorStyle();

    const handleOnToggle = React.useCallback(() => {
      dispatch({ type: 'TOGGLE_MENU' });
    }, [dispatch]);

    return (
      <StickyCursor sticky={sticky}>
        <Button
          onMouseEnter={addCursorBorder}
          onMouseLeave={removeCursorBorder}
          onClick={handleOnToggle}
          ref={ref}
          {...props}
        >
          <span>{title}</span>
        </Button>
      </StickyCursor>
    );
  }
);

MenuButton.displayName = 'MenuButton';
export default React.memo(MenuButton);
