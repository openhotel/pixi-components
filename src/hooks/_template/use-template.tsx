import { useContext } from "react";
import type { TemplateState } from "./template.context";
import { TemplateContext } from "./template.context";

export const useTemplate = (): TemplateState => useContext(TemplateContext);
