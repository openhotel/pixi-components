import { createContext, useContext } from "react";
import type { ReactNode, FC } from "react";

type _TemplateState = {};

const _TemplateContext = createContext<_TemplateState>(undefined);

type _TemplateProps = {
  children: ReactNode;
};

export const _TemplateProvider: FC<_TemplateProps> = ({ children }) => {
  return <_TemplateContext.Provider value={{}} children={children} />;
};

export const useTemplate = (): _TemplateState => useContext(_TemplateContext);
