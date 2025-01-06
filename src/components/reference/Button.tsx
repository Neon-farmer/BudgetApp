import React from "react";

type Props = {
  children: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Button: React.FC<Props> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
