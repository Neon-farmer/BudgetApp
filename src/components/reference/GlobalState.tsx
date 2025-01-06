import React, { createContext, ReactNode, useReducer } from "react";

// initialValues defines the shape for state and some functions without defining those functions.
export const initialValues = {
  rValue: true,
  turnOn: () => {},
  turnOff: () => {},
};

// This creates the context provider and defines what properies (state/functions) the provider provides and must have
export const GlobalContext = createContext(initialValues);

type State = {
  rValue: boolean;
};

type Action = {
  type: "one" | "two";
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "one":
      return { rValue: true };
    case "two":
      return { rValue: false };
    default:
      return state;
  }
}

// Define the shape of an object that will be used for props
type GlobalProviderProps = {
  children: ReactNode;
};

// React.FC<GlobalProviderProps> only accepts props that fit the GlobalProviderProps shape
// GlobalProvider returns the Global Context's provider property
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [state, changestate] = useReducer(reducer, initialValues);

  return (
    <GlobalContext.Provider
      value={{
        rValue: state.rValue, // set the rValue for the provider to the state created by the reducer
        turnOn: () => changestate({ type: "one" }),
        turnOff: () => changestate({ type: "two" }),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
