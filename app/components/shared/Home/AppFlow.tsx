'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';
import containerStyles from '../../../styles/shared/container';

const AppFlowSection = styled.section`
  ${containerStyles};
  padding: 120px 0;
  position: relative;
  overflow: visible;
  background-color: transparent;
`;

const SectionHeader = styled.div`
  margin-bottom: 140px;
  text-align: center;

  & h2 {
    font-family: var(--font-space-grotesk), monospace;
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -0.05em;
    line-height: 1.05;
    color: #ffffff;
    text-transform: uppercase;
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    font-size: clamp(1.1rem, 1.5vw, 1.3rem);
    color: #adaaaa;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 120px;
  
  @media screen and (max-width: 1023px) {
    gap: 80px;
    padding-left: 20px;
  }
`;

const CentralAxis = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: rgba(255, 0, 51, 0.2);
  transform: translateX(-50%);
  z-index: 1;

  @media screen and (max-width: 1023px) {
    left: 20px;
  }
`;

const GlowProgress = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #FF0033;
  box-shadow: 0 0 15px #FF0033;
  transform-origin: top;
`;

const TimelineNodeWrapper = styled(motion.div)<{ $align: 'left' | 'right' }>`
  position: relative;
  width: 50%;
  padding: ${({ $align }) => $align === 'left' ? '0 60px 0 0' : '0 0 0 60px'};
  align-self: ${({ $align }) => $align === 'left' ? 'flex-start' : 'flex-end'};
  z-index: 2;

  @media screen and (max-width: 1023px) {
    width: 100%;
    padding: 0 0 0 40px;
    align-self: flex-start;
  }
`;

// Extracting Node Point so we can target it via framer-motion variants
const NodePoint = styled(motion.div)<{ $align: 'left' | 'right' }>`
  position: absolute;
  top: 5px;
  ${({ $align }) => $align === 'left' ? 'right: -6px;' : 'left: -6px;'}
  width: 12px;
  height: 12px;
  background: #0e0e0e;
  border: 2px solid rgba(255, 0, 51, 0.5);
  z-index: 3;

  @media screen and (max-width: 1023px) {
    left: -26px;
    right: auto;
  }
`;

const NakedContent = styled.div<{ $align: 'left' | 'right' }>`
  text-align: ${({ $align }) => $align === 'left' ? 'right' : 'left'};

  @media screen and (max-width: 1023px) {
    text-align: left;
  }

  & .num {
    font-family: var(--font-space-grotesk), monospace;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: 0.3em;
    color: #FF0033;
  }

  & h3 {
    font-family: var(--font-space-grotesk), monospace;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 20px;
    letter-spacing: -0.04em;
    line-height: 1.05;
    text-transform: uppercase;
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    font-size: clamp(1rem, 1.2vw, 1.15rem);
    color: #adaaaa;
    line-height: 1.6;
  }
`;

const STEPS = [
  {
    num: 'PHASE.01',
    title: 'Initialize Sync',
    desc: 'Authorized GitHub OAuth sync kicks off. Our engine recursively parses your commit history to extract deep technical intent.',
    align: 'left'
  },
  {
    num: 'PHASE.02',
    title: 'Match Engine',
    desc: 'Swipe through high-signal builder proposals. The system matches operational velocity and complementary stack architectures.',
    align: 'right'
  },
  {
    num: 'PHASE.03',
    title: 'Deploy Squad',
    desc: 'Zero-friction boarding to project environments. Discord, GitHub, and dev-spaces provisioned in real-time.',
    align: 'left'
  },
];

// Variants for the nodes


export default function AppFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <AppFlowSection ref={containerRef} id="product-flow">
      <SectionHeader>
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          EXECUTION FLOW
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          A non-linear, high-velocity onboarding sequence engineered for modern originators.
        </motion.p>
      </SectionHeader>

      <TimelineContainer>
        <CentralAxis>
          <GlowProgress style={{ scaleY: pathLength }} />
        </CentralAxis>

        {STEPS.map((step, i) => (
          <TimelineNodeWrapper 
            key={i}
            $align={step.align as 'left' | 'right'}
            initial={{ opacity: 0, x: step.align === 'left' ? -30 : 30 }}
            whileInView="visible"
            variants={{
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren" }
              }
            }}
            viewport={{ once: false, margin: "-150px" }}
          >
            {/* The dot illuminates automatically because it is a child of the whileInView parent */}
            <NodePoint $align={step.align as 'left' | 'right'} initial={{ rotate: 45, backgroundColor: '#0e0e0e', borderColor: 'rgba(255, 0, 51, 0.5)', scale: 1 }} whileInView={{ rotate: 135, backgroundColor: '#ff2a55', borderColor: '#ff2a55', scale: 1.2, boxShadow: '0 0 20px rgba(255, 42, 85, 1)', transition: { duration: 0.6, ease: "easeOut" } }} />
            <NakedContent $align={step.align as 'left' | 'right'}>
              <div className="num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </NakedContent>
          </TimelineNodeWrapper>
        ))}
      </TimelineContainer>
    </AppFlowSection>
  );
}
