import React, { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children?: ReactNode;
};

export const SectionWrapper = ({ children }: Props) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  background-color: var(--background2);
  border: 1px solid var(--border1);
  border-radius: 10px;
  width: 90%;
  padding: 20px;
  margin: 10px;
  box-shadow: 1px 1px 4px hsla(0, 0%, 50%, 40%);
`;
