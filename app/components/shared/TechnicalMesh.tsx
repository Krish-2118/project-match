'use client';

import React from 'react';
import styled from 'styled-components';

const MeshContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: 
    radial-gradient(circle at 2px 2px, rgba(255, 42, 85, 0.05) 1px, transparent 0);
  background-size: 40px 40px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, transparent 0%, #000 80%);
  }
`;

export default function TechnicalMesh() {
  return <MeshContainer />;
}
