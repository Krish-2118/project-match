'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import containerStyles from '../../../styles/shared/container';
import AnimateOnScreen from '../AnimateOnScreen';

const HeroSection = styled.section`
  ${containerStyles};
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000000;
  padding-top: 80px; 
`;

const TerminalOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  /* Red Monolith Core Glow */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 0, 51, 0.15) 0%,
      rgba(255, 0, 51, 0) 70%
    );
    filter: blur(80px);
  }
`;

const RadarGrid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: 
    linear-gradient(to right, rgba(255,0,51,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,0,51,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1100px;
  width: 100%;
`;

const TacticalBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(255, 0, 51, 0.05);
  border: 1px solid rgba(255, 0, 51, 0.4);
  border-radius: 0px; /* Zero border radius */
  margin-bottom: 50px;
  position: relative;
  
  &::before {
    content: '[';
    color: #FF0033;
    font-family: monospace;
    font-size: 1.2rem;
  }
  
  &::after {
    content: ']';
    color: #FF0033;
    font-family: monospace;
    font-size: 1.2rem;
  }

  span {
    font-size: 0.85rem;
    font-family: var(--font-space-grotesk), monospace;
    color: #ff8d8a;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    font-weight: 700;
  }
  
  .dot {
    width: 6px;
    height: 6px;
    background: #FF0033;
    box-shadow: 0 0 10px #FF0033;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-space-grotesk), monospace;
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: #ffffff;
  margin-bottom: 32px;
  text-transform: uppercase;
  
  span.accent {
    color: #ffffff;
    display: inline-block;
    transition: all 0.3s ease;
    
    &:hover {
      color: #FF0033;
      text-shadow: 0 0 40px rgba(255, 0, 51, 0.6);
    }
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.7;
  color: #adaaaa;
  max-width: 650px;
  margin: 0 auto 60px;
  font-family: var(--font-inter), sans-serif;
  border-left: 2px solid rgba(255,0,51,0.5);
  padding-left: 20px;
  text-align: left;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryAction = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 40px;
  font-family: var(--font-space-grotesk), monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #000;
  background: #FF0033;
  border-radius: 0; /* Kinetic Monolith */
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 0, 51, 0.4);

  &:hover {
    background: #ffffff;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
  }

  span {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const SecondaryAction = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 38px;
  font-family: var(--font-space-grotesk), monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: #FF0033;
    color: #FF0033;
    background: rgba(255, 0, 51, 0.05);
  }
`;

const Hero = () => {
  return (
    <AnimateOnScreen>
      <HeroSection>
        <TerminalOverlay />
        <RadarGrid />
        
        <ContentWrapper>
          <TacticalBadge
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="dot" />
            <span>PROJECT_MATCH // CORE</span>
          </TacticalBadge>
          
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            ENGINEER THE <br />
            <span className="accent">EXTRAORDINARY</span>
          </Title>
          
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Description
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              The definitive ecosystem for high-intent engineers and visionary founders to forge transformational products.
            </Description>
          </div>
          
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <PrimaryAction href="/signup">
              <span>
                INITIALIZE_SYNC
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </PrimaryAction>
            
            <SecondaryAction href="#discovery-engine">
              EXPLORE_SYSTEM
            </SecondaryAction>
          </ButtonGroup>
        </ContentWrapper>
      </HeroSection>
    </AnimateOnScreen>
  );
};

export default React.memo(Hero);
