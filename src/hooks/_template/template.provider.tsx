import React from "react";
import { TemplateContext } from "./template.context";

type TemplateProps = {
  children: React.ReactNode;
};

export const TemplateProvider: React.FunctionComponent<TemplateProps> = ({
  children,
}) => {
  return <TemplateContext.Provider value={{}} children={children} />;
};
