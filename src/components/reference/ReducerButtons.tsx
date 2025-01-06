import React, { useReducer, useRef, useContext } from "react";
import { useClickOutside } from "./UseClickOutside";
import { GlobalContext } from "./GlobalState";
import styled from "styled-components";

export const ReducerButtons = () => {
  const ref = useRef<HTMLDivElement>(null!);

  const { rValue, turnOn, turnOff } = useContext(GlobalContext);

  useClickOutside(ref, () => {
    console.log("clicked outside");
  });

  return (
    <Wrapper ref={ref}>
      {rValue && <h1>Visible</h1>}
      <button onClick={turnOn}>Action One</button>
      <button onClick={turnOff}>Action Two</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: green;
`;
