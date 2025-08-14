import React from 'react';
import styled, { keyframes } from 'styled-components';

interface OrbitalSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Keyframe animations
const spin3D = keyframes`
  from {
    transform: rotate3d(.5,.5,.5, 360deg);
  }
  to {
    transform: rotate3d(0deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
`;

const SpinnerBox = styled.div<{ size: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '200px';
      case 'lg': return '400px';
      default: return '300px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '200px';
      case 'lg': return '400px';
      default: return '300px';
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  position: relative;
`;

const Orbit = styled.div<{ size: string; duration: string; delay?: string }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  animation: ${spin3D} ${({ duration }) => duration} linear ${({ delay }) => delay || '0s'} infinite;
`;

const BlueOrbit = styled(Orbit)<{ size: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '110px';
      case 'lg': return '220px';
      default: return '165px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '110px';
      case 'lg': return '220px';
      default: return '165px';
    }
  }};
  border: 1px solid rgba(145, 218, 255, 0.65);
`;

const GreenOrbit = styled(Orbit)<{ size: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '80px';
      case 'lg': return '160px';
      default: return '120px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '80px';
      case 'lg': return '160px';
      default: return '120px';
    }
  }};
  border: 1px solid rgba(145, 255, 191, 0.65);
`;

const RedOrbit = styled(Orbit)<{ size: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '60px';
      case 'lg': return '120px';
      default: return '90px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '60px';
      case 'lg': return '120px';
      default: return '90px';
    }
  }};
  border: 1px solid rgba(255, 202, 145, 0.65);
`;

const WhiteOrbit = styled.div<{ size: string; duration: string; delay?: string; rotation?: string }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '40px';
      case 'lg': return '80px';
      default: return '60px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '40px';
      case 'lg': return '80px';
      default: return '60px';
    }
  }};
  border: 2px solid #ffffff;
  animation: ${spin3D} ${({ duration }) => duration} linear ${({ delay }) => delay || '0s'} infinite;
  ${({ rotation }) => rotation && `transform: ${rotation};`}
`;

const LoadingMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  margin: 0;
  text-align: center;
`;

export const OrbitalSpinner: React.FC<OrbitalSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  return (
    <SpinnerContainer>
      <SpinnerBox size={size}>
        <BlueOrbit 
          size={size} 
          duration="3s" 
          delay="0.2s" 
        />
        <GreenOrbit 
          size={size} 
          duration="2s" 
          delay="0s" 
        />
        <RedOrbit 
          size={size} 
          duration="1s" 
          delay="0s" 
        />
        <WhiteOrbit 
          size={size} 
          duration="10s" 
          delay="0s" 
          rotation="rotate3D(1, 1, 1, 90deg)"
        />
        <WhiteOrbit 
          size={size} 
          duration="10s" 
          delay="0s" 
          rotation="rotate3D(1, 2, 0.5, 90deg)"
        />
        <WhiteOrbit 
          size={size} 
          duration="10s" 
          delay="0s" 
          rotation="rotate3D(0.5, 1, 2, 90deg)"
        />
      </SpinnerBox>
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </SpinnerContainer>
  );
};

export default OrbitalSpinner;
