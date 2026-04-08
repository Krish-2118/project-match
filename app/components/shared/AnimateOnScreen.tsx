'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 1,
      ease: [0, 0.7, 0.29, 0.97] as const,
    },
  },
};

const AnimateOnScreen = ({ children }: { children: React.ReactNode }) => {
  const animation = useAnimation();
  const [inViewRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) animation.start('show');
  }, [animation, inView]);

  return (
    <motion.div
      ref={inViewRef}
      variants={variants}
      initial="hidden"
      animate={animation}
    >
      {children}
    </motion.div>
  );
};

export default React.memo(AnimateOnScreen);
