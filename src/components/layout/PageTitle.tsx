import styled from 'styled-components';

interface PageTitleProps {
  align?: 'left' | 'center' | 'right';
  marginBottom?: string;
}

export const PageTitle = styled.h1<PageTitleProps>`
  color: ${({ theme }) => theme.colors.text || '#333'};
  font-family: ${({ theme }) => theme.fonts.heading || theme.fonts.body};
  font-size: 2rem;
  font-weight: 600;
  margin: 20px 0 ${({ marginBottom = '30px' }) => marginBottom} 0;
  text-align: ${({ align = 'left' }) => align};
`;  