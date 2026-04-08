'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BaseDecal = styled(motion.div)`
  position: fixed;
  top: 50%;
  font-family: var(--font-inter), monospace, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  pointer-events: none;
  z-index: 50;

  @media screen and (max-width: 1400px) {
    display: none;
  }

  & span {
    color: #ff2a55;
    opacity: 0.5;
  }
`;

const LeftDecal = styled(BaseDecal)`
  left: 32px;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: left center;
`;

const RightDecal = styled(BaseDecal)`
  right: 32px;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: right center;
`;

const GridLineTarget = styled.div`
  position: absolute;
  width: 1px;
  height: 100vh;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  top: 0;
  pointer-events: none;
  z-index: 5;

  @media screen and (max-width: 1400px) {
    display: none;
  }
`;

export default function PerimeterDecals() {
  return (
    <>
      <GridLineTarget style={{ left: '80px' }} />
      <LeftDecal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        SYS.01 {"//"} <span>MATCH ENGINE ALPHA</span> {"//"} OPERATIONAL
      </LeftDecal>

      <RightDecal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
      >
        LATENCY: 12MS {"//"} <span>GLOBAL GUILDS ACTIVE</span> {"//"} V.1.0
      </RightDecal>
      <GridLineTarget style={{ right: '80px' }} />
    </>
  );
}
