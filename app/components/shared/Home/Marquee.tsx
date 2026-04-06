'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MarqueeContainer = styled.div`
  width: 100%;
  padding: 24px 0;
  background: rgba(255, 42, 85, 0.9);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  transform: rotate(-1deg);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 50px rgba(255, 42, 85, 0.3);
  z-index: 20;
  margin: 60px 0;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.05;
    pointer-events: none;
  }
`;

const MarqueeTrack = styled(motion.div)`
  display: flex;
  white-space: nowrap;
  will-change: transform;
`;

const MarqueeText = styled.h2`
  font-family: presicav, sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  margin: 0;
  padding: 0 60px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;
  
  & span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
    margin-left: 60px;
  }

  @media screen and (max-width: 767px) {
    font-size: 1.5rem;
    padding: 0 30px;
    & span { margin-left: 30px; }
  }
`;

const REPEAT_COUNT = 4;
const TEXT = "CONNECT. • COLLABORATE. • LAUNCH.";

export default function Marquee() {
  return (
    <MarqueeContainer>
      <MarqueeTrack
        animate={{ x: [0, -2000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20
        }}
      >
        {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
          <MarqueeText key={i}>
            {TEXT} <span>{TEXT}</span>
          </MarqueeText>
        ))}
      </MarqueeTrack>
    </MarqueeContainer>
  );
}
