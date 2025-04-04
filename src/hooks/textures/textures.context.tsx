import React from "react";
import { Spritesheet, Texture } from "pixi.js";

export type TextureProps = { texture: string; spriteSheet?: string };

export type TexturesState = {
  loadSpriteSheet: (name: string) => Promise<void>;
  loadTexture: (name: string) => Promise<void>;

  getSpriteSheet: (name: string) => Spritesheet<any>;
  getTexture: (data: TextureProps) => Texture;
};

export const TexturesContext = React.createContext<TexturesState>(undefined);
