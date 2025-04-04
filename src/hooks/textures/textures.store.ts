import { create } from "zustand";
import { Spritesheet, Texture } from "pixi.js";

export const useTexturesStore = create<{
  textures: Record<string, Texture>;
  spriteSheets: Record<string, Spritesheet<any>>;

  getTexture: (texture: string) => Texture | null;
  getSpriteSheet: (spriteSheet: string) => Spritesheet<any> | null;

  setTexture: (name: string, texture: Texture) => void;
  setSpriteSheet: (name: string, spriteSheet: Spritesheet<any>) => void;
}>((set, get) => ({
  textures: {},
  spriteSheets: {},

  getTexture: (texture: string) => get().textures[texture] ?? null,
  getSpriteSheet: (spriteSheet: string) =>
    get().spriteSheets[spriteSheet] ?? null,

  setTexture: (name: string, texture: Texture) =>
    set((state) => ({
      ...state,
      textures: {
        ...state.textures,
        [name]: texture,
      },
    })),
  setSpriteSheet: (name: string, spriteSheet: Spritesheet<any>) =>
    set((state) => ({
      ...state,
      spriteSheets: {
        ...state.spriteSheets,
        [name]: spriteSheet,
      },
    })),
}));
