'use client';

import React from 'react';
import styled from 'styled-components';
import useCursorStyle from '../../hooks/useCursorStyle';
import { Instagram, Facebook, Vimeo } from './icons';
import StickyCursor from './StickyCursor';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Link = styled.a`
  display: block;
  width: 24px;
  height: 24px;
`;

const medias = [
  { component: Instagram, url: 'https://www.instagram.com/match/' },
  { component: Facebook, url: 'https://www.facebook.com/match/' },
  { component: Vimeo, url: 'https://vimeo.com/match' },
];

const SocialMedia = (props: React.HTMLAttributes<HTMLElement>) => {
  const { addCursorBorder, removeCursorBorder } = useCursorStyle();

  return (
    <Container {...props}>
      {medias.map(({ component: Component, url }) => (
        <StickyCursor key={url}>
          <Link
            target="_blank"
            href={url}
            rel="noopener noreferrer"
            onMouseEnter={addCursorBorder}
            onMouseLeave={removeCursorBorder}
          >
            <Component />
          </Link>
        </StickyCursor>
      ))}
    </Container>
  );
};

export default React.memo(SocialMedia);
