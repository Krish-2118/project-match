'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import AnimateOnScreen from '../AnimateOnScreen';
import containerStyles from '../../../styles/shared/container';

const ContentSection = styled(motion.section)`
  ${containerStyles};
  display: flex;
  flex-direction: column;
  padding-top: 140px;
  padding-bottom: 140px;
  position: relative;
  z-index: 10;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;

  & h2 {
    font-family: var(--font-inter), sans-serif;
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -0.04em;
    line-height: 1.05;
    background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    font-size: clamp(1.1rem, 1.5vw, 1.3rem);
    color: rgba(255, 255, 255, 0.6);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;

  @media screen and (max-width: 1023px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const PillarCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 48px 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 42, 85, 0.3);
    transform: translateY(-8px);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.5), 
                0 0 40px rgba(255, 42, 85, 0.1);
  }

  & .num {
    font-family: var(--font-inter), sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #ff2a55;
    margin-bottom: 32px;
    letter-spacing: 0.2em;
    opacity: 0.8;
  }

  & h3 {
    font-family: var(--font-inter), sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 20px;
    letter-spacing: -0.04em;
    line-height: 1.1;
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    flex: 1;
  }

  /* Sweep reflection purely on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,42,85,0.1), transparent);
    transform: skewX(-20deg);
    transition: all 0.7s ease;
  }

  &:hover::before {
    left: 200%;
  }

  /* Bottom accent line */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: #ff2a55;
    transition: width 0.5s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const PILLARS = [
  { 
    id: 'PHILOSOPHY',
    title: 'Code Over Claims', 
    desc: 'Traditional resumes are obsolete noise. We evaluate you strictly on your commit history, architectural choices, and actual shipped code.'
  },
  { 
    id: 'CULTURE',
    title: 'Radical Execution', 
    desc: 'Ideas are abundant and worthless without execution. We exist solely to unite visionary originators with relentless, high-caliber builders.'
  },
  { 
    id: 'SCALE',
    title: 'Global Guilds', 
    desc: 'Stop compromising with local talent pools. Access a curated, worldwide network of verified specialists ready to integrate immediately.'
  }
];

const About = () => {
  return (
    <AnimateOnScreen>
      <ContentSection id="about">
        <SectionHeader>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            A New Standard for High-Velocity Execution.
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Ideas are abundant; execution is the differentiator. We remove friction by instantly connecting you with builders who share your exact technical intent.
          </motion.p>
        </SectionHeader>

        <PillarsGrid>
          {PILLARS.map((pillar, i) => (
            <PillarCard 
              key={pillar.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            >
              <div className="num">{pillar.id}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </PillarCard>
          ))}
        </PillarsGrid>
      </ContentSection>
    </AnimateOnScreen>
  );
};

export default React.memo(About);
