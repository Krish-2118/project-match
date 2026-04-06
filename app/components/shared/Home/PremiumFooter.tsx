'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import containerStyles from '../../../styles/shared/container';

const IslandFooterWrapper = styled.footer`
  position: relative;
  background: radial-gradient(circle at 50% 100%, rgba(255, 42, 85, 0.06) 0%, #000000 70%);
  padding: 40px 32px 32px;
  z-index: 10;
  overflow: hidden;

  @media screen and (max-width: 767px) {
    padding: 32px 16px 24px;
  }
`;

const FloatingIsland = styled.div`
  ${containerStyles};
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  padding: 40px 40px;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 1),
              inset 0 1px 0 rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  @media screen and (max-width: 1023px) {
    padding: 40px 24px;
  }
`;

const ContentZ = styled.div`
  position: relative;
  z-index: 2;
`;

const CTAHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 40px;

  & h2 {
    font-family: var(--font-inter), sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin: 0 0 12px 0;
    line-height: 1.1;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
    max-width: 350px;
  }

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: #ffffff;
  color: #000000;
  font-family: var(--font-inter), sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #ff2a55;
    color: #ffffff;
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(255, 42, 85, 0.4);
  }
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;

  @media screen and (max-width: 1023px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;

const BrandBlock = styled.div`
  & h3 {
    font-family: var(--font-inter), sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      background: #ff2a55;
      border-radius: 4px;
    }
  }

  & p {
    font-family: var(--font-inter), sans-serif;
    color: rgba(255, 255, 255, 0.4);
    font-size: 1rem;
    line-height: 1.6;
    max-width: 300px;
    margin: 0;
  }
`;

const LinkColumn = styled.div`
  display: flex;
  flex-direction: column;

  & h4 {
    font-family: var(--font-inter), sans-serif;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 16px 0;
  }

  & a {
    font-family: var(--font-inter), sans-serif;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    text-decoration: none;
    margin-bottom: 12px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: left center;
    display: inline-block;

    &:hover {
      color: #ff2a55;
      transform: translateX(6px) scale(1.02);
      text-shadow: 0 0 15px rgba(255, 42, 85, 0.5);
    }
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  & p {
    font-family: var(--font-inter), sans-serif;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.85rem;
    margin: 0;
  }

  & .status {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #27c93f;
    font-family: var(--font-inter), sans-serif;
    font-size: 0.85rem;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #27c93f;
      box-shadow: 0 0 10px #27c93f;
    }
  }
`;

export default function PremiumFooter() {
  return (
    <IslandFooterWrapper>
      <FloatingIsland>
        <ContentZ>
          <CTAHeader>
            <div>
              <h2>READY TO BUILD?</h2>
              <p>Initialize your builder profile and join the ecosystem.</p>
            </div>
            <ActionButton href="/signup">
              BEGIN NOW
            </ActionButton>
          </CTAHeader>

          <LinkGrid>
            <BrandBlock>
              <h3>PROJECT MATCH</h3>
              <p>The definitive platform for discovering world-class developers.</p>
            </BrandBlock>

            <LinkColumn>
              <h4>Discover</h4>
              <Link href="/swipe">Engine</Link>
              <Link href="/projects">Ecosystem</Link>
            </LinkColumn>

            <LinkColumn>
              <h4>Connect</h4>
              <Link href="/github">GitHub</Link>
              <Link href="/discord">Discord</Link>
            </LinkColumn>

            <LinkColumn>
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </LinkColumn>
          </LinkGrid>

          <BottomBar>
            <p>&copy; {new Date().getFullYear()} Project Match.</p>
            <div className="status">Operational</div>
          </BottomBar>
        </ContentZ>
      </FloatingIsland>
    </IslandFooterWrapper>
  );
}
