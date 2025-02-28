import React, { ReactNode, useContext as $useContext } from "react";

type ContextState = {};

const ContextContext = React.createContext<ContextState>(undefined);

type ContextProps = {
  children: ReactNode;
};

export const ContextProvider: React.FunctionComponent<ContextProps> = ({
  children,
}) => {
  return <ContextContext.Provider value={{}} children={children} />;
};

export const useContext = (): ContextState => $useContext(ContextContext);
