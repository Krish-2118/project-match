'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useSpring } from 'framer-motion';
import containerStyles from '../../../styles/shared/container';

const FeaturesSection = styled.section`
  ${containerStyles};
  padding: 150px 0;
  position: relative;
  z-index: 10;
  background-color: transparent;
`;

const TerminalBoundary = styled.div`
  position: relative;
  padding-left: 60px;
  max-width: 1200px;
  margin: 0 auto;

  @media screen and (max-width: 1023px) {
    padding-left: 30px;
  }
`;

const CentralAxis = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: rgba(255, 0, 51, 0.2);
  z-index: 1;
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

const FeatureNode = styled(motion.div)`
  margin-bottom: 200px;
  position: relative;
  z-index: 2;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 1023px) {
    margin-bottom: 120px;
  }
`;

const NodePoint = styled(motion.div)`
  position: absolute;
  left: -66px; /* 60px padding + 6px half width */
  top: 0;
  width: 12px;
  height: 12px;
  background: #0e0e0e;
  border: 2px solid rgba(255, 0, 51, 0.5);
  transform: rotate(45deg);
  z-index: 3;

  @media screen and (max-width: 1023px) {
    left: -36px;
  }
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  width: 100%;
  align-items: center;

  @media screen and (max-width: 1023px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const TextContent = styled.div<{ $mobileOrder?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 1023px) {
    order: ${props => props.$mobileOrder || 1};
  }
`;

const VisualContent = styled.div<{ $mobileOrder?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 300px;
  width: 100%;

  @media screen and (max-width: 1023px) {
    order: ${props => props.$mobileOrder || 2};
  }
`;

const NodeLabel = styled.div`
  font-family: var(--font-space-grotesk), monospace;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #ff8d8a;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255, 0, 51, 0.05);
  border: 1px solid rgba(255, 0, 51, 0.2);
  align-self: flex-start;
`;

const MainTitle = styled.h2`
  font-family: var(--font-space-grotesk), monospace;
  font-size: clamp(3rem, 4.5vw, 4.5rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
  line-height: 1.05;
`;

const FeatureDesc = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: clamp(1.05rem, 1.2vw, 1.15rem);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  max-width: 500px;
`;

/* Technical Visuals */
const RingsVisual = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    {[1, 2, 3].map(i => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: `${i * 120}px`,
          height: `${i * 120}px`,
          border: `1px solid ${i === 2 ? 'rgba(255,0,51,0.5)' : 'rgba(255,255,255,0.05)'}`,
          borderRadius: '50%',
          borderStyle: i === 3 ? 'dashed' : 'solid'
        }}
        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
      />
    ))}
    <motion.div 
      style={{ width: 24, height: 24, background: '#FF0033', transform: 'rotate(45deg)', boxShadow: '0 0 40px #FF0033' }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </div>
);

const LedgerVisual = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '240px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,0,51,0.2)' }}>
    {[40, 70, 30, 90, 50, 80, 20, 100, 60].map((h, i) => (
      <motion.div
        key={i}
        style={{ width: '16px', background: i === 7 || i === 3 ? '#FF0033' : 'rgba(255,255,255,0.08)', height: '0%' }}
        whileInView={{ height: `${h}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
      />
    ))}
  </div>
);

const TerminalVisual = () => (
  <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(14,14,14,0.8)', padding: '32px', border: '1px solid rgba(255,0,51,0.3)', position: 'relative', backdropFilter: 'blur(10px)' }}>
    <div style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, background: '#FF0033' }} />
    <motion.div 
       style={{ color: '#ff8d8a', fontFamily: 'var(--font-space-grotesk), monospace', fontSize: '0.9rem', lineHeight: 2.2, whiteSpace: 'pre' }}
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: true }}
    >
      {`[SYS] Match verified...
[NET] Provisioning node.sys
[GIT] Cloning originator/repo.git
[NPM] Resolving 1,402 dependencies
[OUT] Webhook tunnel established
[OK ] Env completely volatile.`}
    </motion.div>
    <motion.div 
      style={{ width: '12px', height: '18px', background: '#FF0033', marginTop: '16px', display: 'inline-block' }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
    />
  </div>
);



const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });

  return (
    <FeaturesSection id="discovery-engine" ref={containerRef}>
      <SectionHeaderTitle />
      <TerminalBoundary>
        
        <CentralAxis>
          <GlowProgress style={{ scaleY: pathLength }} />
        </CentralAxis>
        
        {/* BLOCK 1 */}
        <FeatureNode initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", when: "beforeChildren" }} viewport={{ once: false, margin: "-150px" }}>
          <NodePoint initial={{ rotate: 45, backgroundColor: '#0e0e0e', borderColor: 'rgba(255, 0, 51, 0.5)', scale: 1 }} whileInView={{ rotate: 135, backgroundColor: '#FF0033', borderColor: '#FF0033', scale: 1.3, boxShadow: '0 0 20px rgba(255, 42, 85, 1)' }} transition={{ duration: 0.5, ease: "easeOut" }} />
          <SplitGrid>
            <TextContent $mobileOrder={1}>
              <NodeLabel>PROTOCOL.ALPHA</NodeLabel>
              <MainTitle>Algorithmic<br/>Symmetry</MainTitle>
              <FeatureDesc>
                We bypass surface-level bios. The system ingests your commit syntax, codebase dependencies, and architectural paradigms to synthesize your exact developer fingerprint—perfectly pairing you with engineering counterparts whose skill-graphs fill your exact operational blindspots.
              </FeatureDesc>
            </TextContent>
            <VisualContent $mobileOrder={2}>
              <RingsVisual />
            </VisualContent>
          </SplitGrid>
        </FeatureNode>

        {/* BLOCK 2 */}
        <FeatureNode initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", when: "beforeChildren" }} viewport={{ once: false, margin: "-150px" }}>
          <NodePoint initial={{ rotate: 45, backgroundColor: '#0e0e0e', borderColor: 'rgba(255, 0, 51, 0.5)', scale: 1 }} whileInView={{ rotate: 135, backgroundColor: '#FF0033', borderColor: '#FF0033', scale: 1.3, boxShadow: '0 0 20px rgba(255, 42, 85, 1)' }} transition={{ duration: 0.5, ease: "easeOut" }} />
          <SplitGrid>
            <VisualContent $mobileOrder={2}>
              <LedgerVisual />
            </VisualContent>
            <TextContent $mobileOrder={1}>
              <NodeLabel>PROTOCOL.BETA</NodeLabel>
              <MainTitle>Proof of<br/>Execution</MainTitle>
              <FeatureDesc>
                Talk is cheap. Your rank on this grid is immutable, calculated solely by raw deployment data, live repositories, and peer-verified commits. Enter a ledger of verifiable impact, completely detached from generic tags and bloated resumes.
              </FeatureDesc>
            </TextContent>
          </SplitGrid>
        </FeatureNode>

        {/* BLOCK 3 */}
        <FeatureNode initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut", when: "beforeChildren" }} viewport={{ once: false, margin: "-150px" }}>
          <NodePoint initial={{ rotate: 45, backgroundColor: '#0e0e0e', borderColor: 'rgba(255, 0, 51, 0.5)', scale: 1 }} whileInView={{ rotate: 135, backgroundColor: '#FF0033', borderColor: '#FF0033', scale: 1.3, boxShadow: '0 0 20px rgba(255, 42, 85, 1)' }} transition={{ duration: 0.5, ease: "easeOut" }} />
          <SplitGrid>
            <TextContent $mobileOrder={1}>
              <NodeLabel>PROTOCOL.GAMMA</NodeLabel>
              <MainTitle>Instantaneous<br/>Provisioning</MainTitle>
              <FeatureDesc>
                Turn matches into tactical motion. ProjectMatch spawns fully-synced Discord instances, initializes shared GitHub repositories, and provisions cloud dev spaces in under a second. We completely eliminate the administrative friction of boarding.
              </FeatureDesc>
            </TextContent>
            <VisualContent $mobileOrder={2}>
              <TerminalVisual />
            </VisualContent>
          </SplitGrid>
        </FeatureNode>

      </TerminalBoundary>
    </FeaturesSection>
  );
};

const SectionHeaderTitle = () => (
  <div style={{
    fontFamily: 'var(--font-space-grotesk), monospace',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.5em',
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    marginBottom: '80px',
    textAlign: 'center'
  }}>
    --- THE DISCOVERY ENGINE ---
  </div>
);

export default React.memo(Features);
