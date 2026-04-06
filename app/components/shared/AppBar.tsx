'use client';

import React from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import containerStyles from '../../styles/shared/container';
import Logo from './icons/Logo';
import MenuButton from './MenuButton';

const Slider = styled(motion.div).withConfig({
  shouldForwardProp: (prop) =>
    !['direction', 'offset', 'logoProps', 'renderAs', 'variants', 'initial', 'animate', 'transition', 'custom'].includes(prop),
})`
  position: fixed;
  right: 0;
  left: 0;
  will-change: transform;
  z-index: ${({ theme }) => theme.zIndex.appBar};
`;

const Container = styled.div`
  ${containerStyles};
  position: relative;
`;

const StyledLink = styled(Link)`
  display: block;
  position: absolute;
  top: 54px;
  left: 32px;
  width: 131px;
  height: 23px;

  @media screen and (max-width: 767px) {
    width: 99px;
    height: 17px;
    top: 32px;
  }
`;

const MenuWrapper = styled.div`
  position: absolute;
  top: 54px;
  right: 32px;
  margin: -20px;

  @media screen and (max-width: 767px) {
    top: 29px;
  }
`;

const getStyles = (direction = '') => {
  if (direction === 'down') return { top: 0 };
  if (direction === 'up') return { bottom: 0 };
  return {};
};

const variants = {
  hidden: { y: -131 },
  show: { y: 0 },
};

interface AppBarProps extends Omit<HTMLMotionProps<'div'>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  direction?: 'up' | 'down';
  offset?: number;
  logoProps?: React.HTMLAttributes<HTMLSpanElement>;
  renderAs?: React.ElementType;
  custom?: Record<string, unknown>;
}

const AppBar = (props: AppBarProps) => {
  const {
    direction = 'down',
    offset = 105,
    logoProps = {},
    renderAs,
    custom,
    style: styleProp = {},
    ...rootProps
  } = props;

  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      let shouldHide = false;
      let intersection = offset;
      let currentYPosition = 0;

      if (direction === 'down') {
        currentYPosition = window.scrollY;
        shouldHide = currentYPosition > intersection;
      } else if (direction === 'up') {
        currentYPosition = document.documentElement.scrollTop + window.innerHeight;
        intersection = document.documentElement.scrollHeight - offset;
      }

      shouldHide = currentYPosition > intersection;
      if (shouldHide !== hidden) setHidden(shouldHide);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, false);
    return () => window.removeEventListener('scroll', handleScroll, false);
  }, [hidden, direction, offset]);

  const styles = getStyles(direction);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [20, 150], [1, 0]);
  const scale = useTransform(scrollY, [20, 150], [1, 0.8]);
  const pointerEvents = useTransform(scrollY, (y) => (y > 150 ? 'none' : 'auto'));

  return (
    <Slider
      as={renderAs}
      variants={variants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] as const }}
      style={{ ...styles, ...styleProp, pointerEvents }}
      custom={custom}
      {...rootProps}
    >
      <Container>
        <StyledLink href="/" title="Project Match">
          <motion.div style={{ opacity, scale }}>
            <Logo {...logoProps} />
          </motion.div>
        </StyledLink>
        <MenuWrapper>
          <MenuButton title="Projects" />
        </MenuWrapper>
      </Container>
    </Slider>
  );
};

export default React.memo(AppBar);
