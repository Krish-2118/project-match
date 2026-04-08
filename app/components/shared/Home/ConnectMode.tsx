'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import containerStyles from '../../../styles/shared/container';

const ConnectSection = styled.section`
  ${containerStyles};
  padding: 80px 0;
  perspective: 2000px;
  position: relative;
`;

const ContentWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  transform-style: preserve-3d;
`;

const ProjectCard = styled(motion.div)`
  width: 100%;
  padding: 80px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 48px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8),
              0 0 40px rgba(255, 42, 85, 0.03);
  transition: all 0.5s ease;

  &:hover {
    border-color: rgba(255, 42, 85, 0.3);
    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8),
                0 0 40px rgba(255, 42, 85, 0.15);
  }

  /* Accent hover effects inside the card */
  .badge-accent {
    transition: all 0.4s ease;
  }

  &:hover .badge-accent {
    color: #ff2a55;
    border-color: rgba(255, 42, 85, 0.3);
    box-shadow: 0 0 20px rgba(255, 42, 85, 0.2);
  }

  @media screen and (max-width: 767px) {
    padding: 40px;
  }
`;

const Badge = styled.div`
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.8);
  font-family: var(--font-inter), sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
`;

const MainTitle = styled.h2`
  font-family: var(--font-inter), sans-serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
  line-height: 1.05;
`;

const MainDesc = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 48px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 42, 85, 0.4);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 42, 85, 0.1);
  }

  & .label {
    font-family: var(--font-inter), sans-serif;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.05em;
    transition: color 0.3s ease;
  }

  &:hover .label {
    color: rgba(255, 42, 85, 0.9);
  }

  & .value {
    font-family: var(--font-inter), sans-serif;
    color: #ffffff;
    font-weight: 600;
    font-size: 1.15rem;
  }
`;

export default function ConnectMode() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for the 3D hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Use springs to smooth the violent shaking
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5 safely
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    // Reset back to center when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <ConnectSection 
      ref={containerRef} 
      id="connect-mode"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ContentWrapper>
        <motion.div
           style={{
             rotateX,
             rotateY,
             transformStyle: "preserve-3d",
             perspective: 1500
           }}
        >
          <ProjectCard>
            <Badge className="badge-accent">Connect Mode</Badge>
            <MainTitle>Active Discovery</MainTitle>
            <MainDesc>
              Browse high-signal projects looking for your exact skill-graph. Apply to restricted project squads or fork open repositories instantly.
            </MainDesc>
  
            <MetaGrid>
              <MetaItem>
                <div className="label">Featured Hub</div>
                <div className="value">AI Research Platform</div>
              </MetaItem>
              <MetaItem>
                <div className="label">Roles Required</div>
                <div className="value">ML Engineer, UI Architect</div>
              </MetaItem>
              <MetaItem>
                <div className="label">Tech Stack</div>
                <div className="value">Next.js, Python, Pinecone</div>
              </MetaItem>
            </MetaGrid>
          </ProjectCard>
        </motion.div>
      </ContentWrapper>
    </ConnectSection>
  );
}
