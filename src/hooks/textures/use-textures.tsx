import { useContext } from "react";
import { TexturesContext, TexturesState } from "./textures.context";

export const useTextures = (): TexturesState => useContext(TexturesContext);
