import { useContext } from "react";
import type { TexturesState } from "./textures.context";
import { TexturesContext } from "./textures.context";

export const useTextures = (): TexturesState => useContext(TexturesContext);
