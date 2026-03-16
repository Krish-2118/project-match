'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import useCursorStyle from '../../../hooks/useCursorStyle';
import AnimateOnScreen from '../AnimateOnScreen';
import SocialMedia from '../SocialMedia';
import containerStyles from '../../../styles/shared/container';
import { secondaryFontStyle } from '../../../styles/shared/text';

const ContactSection = styled(motion.section)`
  ${containerStyles};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 285px;
  color: ${({ theme }) => theme.colors.red};

  & .column {
    width: 33.333%;
    &:last-child { justify-content: flex-end; }
    & a:hover { color: ${({ theme }) => theme.text}; }
  }

  & .contact-text {
    ${secondaryFontStyle};
    line-height: 28px;
    display: inline-block;
  }

  & address { padding: 0 8px; }

  @media screen and (max-width: 1200px) {
    & .column { width: 41.666%; &:last-child { width: 16.666%; } }
  }

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    & .column {
      width: 100%;
      &:last-child { width: 100%; justify-content: flex-start; padding: 1px 0; }
    }
    & address { padding: 0; }
  }

  @media screen and (max-width: 767px) {
    padding: 0 32px 156px;
    & address { padding: 17px 0 42px; }
    & .contact-text { font-size: 1.125rem; line-height: 21px; }
  }
`;

const Contact = () => {
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  return (
    <AnimateOnScreen>
      <ContactSection>
        <div className="column">
          <a
            className="contact-text"
            href="mailto:hello@projectmatch.io"
            onMouseEnter={addCursorBorder}
            onMouseLeave={removeCursorBorder}
          >
            hello@projectmatch.io
          </a>
          <br />
          <div style={{ marginTop: '2rem' }}>
            <Link
              href="/auth/signin"
              className="contact-text"
              onMouseEnter={addCursorBorder}
              onMouseLeave={removeCursorBorder}
              style={{ marginRight: '2rem', borderBottom: '2px solid' }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="contact-text"
              onMouseEnter={addCursorBorder}
              onMouseLeave={removeCursorBorder}
              style={{ borderBottom: '2px solid' }}
            >
              Join Now
            </Link>
          </div>
        </div>
        <address className="column contact-text">
          Built with ❤️ for the<br /> builder community worldwide.
        </address>
        <SocialMedia className="column" />
      </ContactSection>
    </AnimateOnScreen>
  );
};

export default React.memo(Contact);
