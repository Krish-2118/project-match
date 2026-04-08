'use client';

import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useCursorContext } from '../../context/cursor';
import { motion, useSpring } from 'framer-motion';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10000;
  
  @media (hover: none) and (pointer: coarse) {
    display: none;
  }
`;

const TacticalDot = styled(motion.div)<{ $color?: string }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${({ $color }) => $color || '#FF0033'};
  border-radius: 0;
  margin: -2px 0 0 -2px;
  box-shadow: 0 0 10px ${({ $color }) => $color || '#FF0033'};
`;

const Reticle = styled(motion.div)<{ $color?: string; $bordered?: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  
  /* Four corners geometry */
  &::before, &::after, & span::before, & span::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid ${({ $color }) => $color || 'rgba(255, 0, 51, 0.6)'};
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Corner placements */
  &::before { top: 0; left: 0; border-right: none; border-bottom: none; }
  &::after { top: 0; right: 0; border-left: none; border-bottom: none; }
  & span::before { bottom: 0; left: 0; border-right: none; border-top: none; }
  & span::after { bottom: 0; right: 0; border-left: none; border-top: none; }

  /* Hover Expansion & Rotation */
  ${({ $bordered }) => $bordered && css`
    width: 60px;
    height: 60px;
    margin: -30px 0 0 -30px;
    
    &::before, &::after, & span::before, & span::after {
      border-color: #FF0033;
      border-width: 3px;
      width: 12px;
      height: 12px;
      box-shadow: 0 0 10px rgba(255, 0, 51, 0.4);
    }
  `}
  
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              height 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              margin 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Cursor = () => {
  const [{ cursorStyle, position }] = useCursorContext();
  
  // High-speed spring for center dot
  const mouseX = useSpring(typeof window !== 'undefined' ? window.innerWidth / 2 : 0, { stiffness: 1000, damping: 40 });
  const mouseY = useSpring(typeof window !== 'undefined' ? window.innerHeight / 2 : 0, { stiffness: 1000, damping: 40 });
  
  // Cinematic, slightly delayed spring for outer reticle brackets
  const ringX = useSpring(typeof window !== 'undefined' ? window.innerWidth / 2 : 0, { stiffness: 150, damping: 15 });
  const ringY = useSpring(typeof window !== 'undefined' ? window.innerHeight / 2 : 0, { stiffness: 150, damping: 15 });
  
  // Reticle Rotation (starts at 45deg, spins to 135deg on hover)
  const ringRotate = useSpring(45, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientX);
      ringX.set(event.clientX);
      ringY.set(event.clientY);
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    if (position) {
      mouseX.set(position.x);
      mouseY.set(position.y);
      ringX.set(position.x);
      ringY.set(position.y);
    } else {
      document.addEventListener('mousemove', onMouseMove);
      return () => document.removeEventListener('mousemove', onMouseMove);
    }
  }, [position, mouseX, mouseY, ringX, ringY]);

  // Apply rotation logic based on hover
  useEffect(() => {
    if (cursorStyle.bordered) {
      ringRotate.set(135); // Spin 90 degrees gracefully
    } else {
      ringRotate.set(45);
    }
  }, [cursorStyle.bordered, ringRotate]);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <CursorWrapper>
      <Reticle 
        style={{ x: ringX, y: ringY, rotate: ringRotate }} 
        $color={cursorStyle.color} 
        $bordered={cursorStyle.bordered}
      >
        <span />
      </Reticle>
      <motion.div style={{ position: 'absolute', x: mouseX, y: mouseY }}>
        <TacticalDot $color={cursorStyle.color} />
      </motion.div>
    </CursorWrapper>
  );
};

export default React.memo(Cursor);
