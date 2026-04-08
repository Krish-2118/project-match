'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styled from 'styled-components';

const BackgroundOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.menu};
  overflow: hidden;
`;

const backdropTransition = { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] as const };
const backdropVariants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
};

const Backdrop = (props: Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'>) => {
  React.useEffect(() => {
    const overflowY = window.getComputedStyle(document.body).overflowY;
    document.body.style.overflowY = 'hidden';
    return () => { document.body.style.overflowY = overflowY; };
  }, []);

  return (
    <BackgroundOverlay
      variants={backdropVariants}
      transition={backdropTransition}
      initial="initial"
      animate="animate"
      exit="initial"
      {...props}
    />
  );
};

export default Backdrop;
