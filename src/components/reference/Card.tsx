import React from "react";

type Props = {
  name: string;
  ability: string;
};

export const Card = ({ name, ability }: Props) => {
  return (
    <div>
      <h1>{name}</h1>
      <h3>{ability}</h3>
    </div>
  );
};
