'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styled from 'styled-components';
import { useMenuContext } from '../../context/menu';
import useCursorStyle from '../../hooks/useCursorStyle';
import useStyledTheme from '../../hooks/useStyledTheme';
import useMediaQuery from '../../hooks/useMediaQuery';
import routes from '../../utils/constants/routes';
import Arrow from './icons/Arrow';
import SocialMedia from './SocialMedia';
import MenuButton from './MenuButton';
import Backdrop from './Backdrop';
import containerStyles from '../../styles/shared/container';
import { secondaryFontStyle } from '../../styles/shared/text';

// --- Animations ---
const listVariants = {
  show: { transition: { delayChildren: 0.5, staggerChildren: 0.1 } },
};
const listItemsVariants = {
  hidden: { x: -100, opacity: 0 },
  show: { opacity: 1, x: 0 },
};
const linkVariants: Variants = {
  initial: ({ isMobile }: { isMobile: boolean }) => (isMobile ? { x: 0 } : { x: -74 }),
  hover: ({ isMobile, color }: { isMobile: boolean; color: string }) => (isMobile ? { color } : { x: 0 }),
};
const videoRevealVariants: Variants = { hidden: { width: 0 }, show: { width: '100%' } };
const videoVariants: Variants = {
  hidden: { opacity: 0, transition: { delay: 0.05 } },
  show: { opacity: 1 },
};
const transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const };

// --- Styled Components ---
const StyledBackdrop = styled(Backdrop)`
  background: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.background};
`;

const Container = styled.div`
  ${containerStyles};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Row = styled.div`
  width: 100%;
  padding: 54px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled(Row)`
  & h3 {
    margin: -20px;
    margin-left: 0;
    ${secondaryFontStyle};
  }

  @media screen and (max-width: 767px) {
    padding: 29px 0;
    & h3 { font-size: 1.125rem; line-height: 1.2777777778; }
  }
`;

const Footer = styled(Row)`
  justify-content: flex-start;

  @media screen and (max-width: 1023px) {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
  }

  @media screen and (max-width: 767px) {
    padding: 32px 0;
  }
`;

const FooterText = styled.p`
  ${secondaryFontStyle};
  line-height: 24px;
  margin: 0;
  flex-shrink: 0;

  &.link {
    display: inline-block;
    margin-right: 64px;
    &:hover { color: ${({ theme }) => theme.text}; }
  }

  &.copyright {
    font-size: 0.875rem;
    line-height: 1.0714285714;
  }

  @media screen and (max-width: 1023px) {
    font-size: 0.875rem;
    line-height: 1.0714285714;
    &.copyright {
      position: absolute;
      right: 0;
      bottom: 54px;
      font-size: 0.6875rem;
      line-height: 1.1818181818;
    }
  }

  @media screen and (max-width: 767px) {
    &.copyright { bottom: 32px; }
  }
`;

const StyledSocialMedia = styled(SocialMedia)`
  justify-content: flex-end;
  width: 100%;
  & a svg path { fill: ${({ theme }) => theme.background}; }

  @media screen and (max-width: 1023px) {
    width: unset;
    justify-content: flex-start;
  }
`;

const Navigation = styled.nav`
  height: 462px;

  @media screen and (max-width: 1023px) {
    position: absolute;
    top: 94px;
  }
`;

const List = styled(motion.ul)`
  display: inline-block;
  & li {
    display: block;
    overflow: hidden;
    float: left;
    clear: left;
  }
`;

const NavLink = styled(motion.create(Link))`
  display: flex;
  align-items: center;
  font-size: 3.5625rem;
  line-height: 1.5964912281;
  font-weight: 900;
  text-transform: uppercase;
  will-change: transform;

  @media screen and (max-width: 767px) {
    font-size: 1.75rem;
    line-height: 1.7857142857;
  }
`;

const ArrowContainer = styled.span`
  display: block;
  overflow: hidden;
  width: 68px;
  height: 57px;
  padding-right: 6px;
  margin-right: 6px;
  & svg { float: right; width: 101px; height: 57px; }

  @media screen and (max-width: 1023px) { display: none; }
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;

  @media screen and (max-width: 1023px) { display: none; }
`;

const VideoReveal = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  will-change: width;
  transform: translateZ(0);
  background: ${({ theme }) => theme.colors.red};
`;

const Video = styled(motion.video)`
  position: absolute;
  height: 100%;
  margin: 0;
  will-change: opacity;
  transform: translateZ(0);
  z-index: -1;
`;

const Address = styled.address`
  margin-top: 17px;
  margin-bottom: 23px;
`;

const CloseButton = styled(MenuButton)`
  margin: -20px;
  & span { color: ${({ theme }) => theme.background}; }
  &::before, &::after {
    margin-top: 0;
    background: ${({ theme }) => theme.background};
  }
  &::before { transform: translateY(-50%) rotate(-45deg); }
  &::after { transform: translateY(-50%) rotate(45deg); }
`;

// --- Menu Component ---
const Menu = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoContainerRef = React.useRef<HTMLDivElement>(null);
  const [revealVideo, setRevealVideo] = React.useState<string | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);
  const theme = useStyledTheme();
  const [{ isMenuOpen }] = useMenuContext();
  const { addCursorBorder, removeCursorBorder, addCursorColor, resetCursorColor } = useCursorStyle();
  const isMobile = useMediaQuery(
    ({ breakpoints }) => `(max-width:${breakpoints.sizes.small || 1023}px)`,
  );

  const handleAnimationComplete = React.useCallback(() => {
    if (theme?.text) {
      addCursorColor(theme.text);
    }
  }, [addCursorColor, theme]);

  const handleExitComplete = React.useCallback(() => {
    resetCursorColor();
  }, [resetCursorColor]);

  const handleHoverStart = React.useCallback((event: MouseEvent | PointerEvent | TouchEvent) => {
    addCursorBorder();
    const target = event.currentTarget as HTMLAnchorElement | null;
    setRevealVideo(target?.getAttribute('data-name') ?? null);
  }, [addCursorBorder]);

  const handleHoverEnd = React.useCallback(() => {
    removeCursorBorder();
    setRevealVideo(null);
  }, [removeCursorBorder]);

  React.useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen && containerRef.current && videoContainerRef.current) {
        const offset = 256;
        const { width } = containerRef.current.getBoundingClientRect();
        const left = (window.innerWidth - width) / 2 + offset;
        videoContainerRef.current.style.left = `${left}px`;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isMenuOpen && (
        <StyledBackdrop onAnimationComplete={handleAnimationComplete}>
          <Container ref={containerRef}>
            <Header>
              <h3>Explore</h3>
              <CloseButton title="Close" />
            </Header>
            <Navigation>
              <List
                variants={listVariants}
                initial="hidden"
                animate="show"
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                {routes.map(route => (
                  <motion.li
                    key={route.id}
                    variants={listItemsVariants}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <NavLink
                      href={route.path}
                      key={`${route.id}_${isMobile}`}
                      data-name={route.id}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={handleHoverEnd}
                      custom={{ isMobile, color: theme?.text }}
                      initial="initial"
                      whileHover="hover"
                      variants={linkVariants}
                      transition={transition}
                    >
                      <ArrowContainer>
                        <Arrow fillColor={theme?.background} />
                      </ArrowContainer>
                      {route.title}
                    </NavLink>
                  </motion.li>
                ))}
              </List>
            </Navigation>
            <Footer>
              <FooterText
                className="link"
                as="a"
                href="mailto:hello@projectmatch.io"
                onMouseEnter={addCursorBorder}
                onMouseLeave={removeCursorBorder}
              >
                hello@projectmatch.io
              </FooterText>
              <FooterText
                className="link"
                as="a"
                href="/auth/signin"
                onMouseEnter={addCursorBorder}
                onMouseLeave={removeCursorBorder}
              >
                Member Login
              </FooterText>
              <FooterText className="copyright">© Project Match 2024</FooterText>
              {isMobile && (
                <Address>
                  <FooterText>Empowering builders<br /> to create the future.</FooterText>
                </Address>
              )}
              <StyledSocialMedia />
            </Footer>
          </Container>
          {!isMobile && (
            <VideoContainer ref={videoContainerRef}>
              <VideoReveal
                variants={videoRevealVariants}
                transition={transition}
                initial="show"
                animate={isHovering ? 'hidden' : 'show'}
              />
              {routes.map(route => (
                <Video
                  key={route.id}
                  src={`/videos/${route.video}`}
                  variants={videoVariants}
                  initial="hidden"
                  animate={route.id === revealVideo ? 'show' : 'hidden'}
                  transition={transition}
                  loop
                  autoPlay
                />
              ))}
            </VideoContainer>
          )}
        </StyledBackdrop>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Menu);
