'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import styled from 'styled-components';
import useCursorStyle from '../../../hooks/useCursorStyle';
import useWindowSize from '../../../hooks/useWindowSize';
import useStyledTheme from '../../../hooks/useStyledTheme';

// --- Styles ---
const BannerSection = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  margin-bottom: 305px;
  background: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: pan-y;

  & canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
  }

  @media screen and (max-width: 767px) {
    margin-bottom: 90px;
  }
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  opacity: 0.07;
  pointer-events: none;

  & span {
    border: 1px solid currentColor;
  }
`;

const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 1;
`;

const VideoContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  & video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 1;
  }
`;

const BannerTitle = styled(motion.h1)`
  position: absolute;
  bottom: 0;
  left: -10px;
  font-size: 14rem;
  color: rgba(255, 255, 255, 0.04);
  pointer-events: none;
  line-height: 0.8;
  z-index: 2;

  & span {
    display: block;
    will-change: transform;
  }

  @media screen and (max-width: 1023px) {
    left: -10px;
    bottom: 0;
    font-size: 10rem;
    line-height: 0.8;
  }

  @media screen and (max-width: 767px) {
    left: -6px;
    bottom: 0;
    max-width: calc(100% + 6px);
    font-size: 6rem;
    line-height: 0.8;
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 5;
  text-align: center;
  max-width: 900px;
  padding: 0 32px;
`;

const HeroTagline = styled(motion.p)`
  font-family: presicav, sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 1.5rem;
`;

const HeroCTA = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2.5rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.a<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  font-family: presicav, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.05em;
  border-radius: 4px;
  transition: all 0.25s ease;
  cursor: pointer;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.colors.red};
    color: #fff;
    &:hover { background: #c41e14; transform: translateY(-2px); }
  `
      : `
    &:hover { background: ${theme.text}; color: ${theme.background}; transform: translateY(-2px); }
  `}
`;

// --- Canvas Eraser (simplified) ---
const CanvasOverlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.background});
  z-index: 3;
  pointer-events: none;
`;

// --- Animations ---
const titleAnimation: Variants = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const itemTitleAnimation: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: { duration: 0.9, ease: [0.6, 0.05, 0.01, 0.9] as const } },
};

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] as const } },
};

// --- Component ---
const Banner = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();
  const theme = useStyledTheme();
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  // Canvas eraser effect
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !windowSize.width || !windowSize.height || !theme) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const erase = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let x: number, y: number;

      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      // Only erase if within canvas bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 60, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Attach to window so it works even when hovering over text with higher z-index
    window.addEventListener('mousemove', erase as EventListener);
    window.addEventListener('touchstart', erase as EventListener, { passive: false });
    window.addEventListener('touchmove', erase as EventListener, { passive: false });

    return () => {
      window.removeEventListener('mousemove', erase as EventListener);
      window.removeEventListener('touchstart', erase as EventListener);
      window.removeEventListener('touchmove', erase as EventListener);
    };
  }, [windowSize.width, windowSize.height, theme]);

  return (
    <BannerSection style={{ height: windowSize.height || '100vh' }}>
      {/* Background grid for texture */}
      <BackgroundGrid>
        {Array.from({ length: 48 }).map((_, i) => <span key={i} />)}
      </BackgroundGrid>

      {/* Gradient orbs */}
      <GradientOrb style={{ width: 600, height: 600, background: 'rgba(234,40,30,0.12)', top: '10%', left: '60%', transform: 'translate(-50%,-50%)' }} />
      <GradientOrb style={{ width: 400, height: 400, background: 'rgba(234,40,30,0.08)', bottom: '10%', left: '20%', transform: 'translate(-50%,50%)' }} />

      {/* Video background */}
      <VideoContainer>
        <video src="/videos/landing.mp4" loop autoPlay muted playsInline />
      </VideoContainer>

      {/* Smooth bottom transition */}
      <BottomGradient />

      {/* Hero text center */}
      <HeroContent variants={staggerChildren} initial="hidden" animate="show">
        <HeroTagline variants={fadeUp}>The platform for builders</HeroTagline>
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          BUILD GREAT<br />THINGS TOGETHER
        </motion.h1>
        <motion.p
          variants={fadeUp}
          style={{
            marginTop: '1.5rem',
            fontSize: '1.2rem',
            lineHeight: 1.5,
            opacity: 0.7,
            maxWidth: 560,
            margin: '1.5rem auto 0',
          }}
        >
          Match with ambitious developers, designers, and visionaries to build
          the next big thing.
        </motion.p>
        <HeroCTA variants={fadeUp}>
          <CTAButton href="/signup" variant="primary">Get Started — Free</CTAButton>
          <CTAButton href="#how-it-works" variant="secondary">See How It Works</CTAButton>
        </HeroCTA>
      </HeroContent>

      {/* Canvas eraser overlay */}
      <CanvasOverlay
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        onMouseEnter={addCursorBorder}
        onMouseLeave={removeCursorBorder}
      />

      {/* Large title watermark at bottom */}
      <BannerTitle variants={titleAnimation} initial="initial" animate="animate">
        <motion.span variants={itemTitleAnimation}>FIND</motion.span>
        <motion.span variants={itemTitleAnimation}>MATCH</motion.span>
      </BannerTitle>
    </BannerSection>
  );
};

export default React.memo(Banner);
