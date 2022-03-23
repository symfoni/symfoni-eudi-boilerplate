import React from "react";
import { useSymfoni } from "./useSymfoni";
// var debug = require("debug")("provider:SymfoniProvider");

export type SymfoniContextInterface = ReturnType<typeof useSymfoni>;
export const SymfoniContext = React.createContext<SymfoniContextInterface>(undefined!);

export const SymfoniProvider = ({ ...props }) => {
  const symfoni = useSymfoni();

  const context = {
    ...symfoni,
  };

  const Loading = () => <h1>Laster</h1>;
  return (
    <SymfoniContext.Provider value={context}>
      {symfoni.loading ? <Loading></Loading> : props.children}
    </SymfoniContext.Provider>
  );
};
