import React from "react";
import styled from "styled-components";

export const Nav = () => {
  return <Wrapper>nav</Wrapper>;
};

const Wrapper = styled.div`
  background: var(--background2);
  border-top: 1px solid var(--border1);
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 12%;
`;
