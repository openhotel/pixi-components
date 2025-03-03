import React, { ReactNode, useCallback, useContext, useRef } from "react";
import { Spritesheet, Texture } from "pixi.js";

type TextureProps = { texture: string; spriteSheet?: string };

type TexturesState = {
  getSpriteSheet: (name: string) => Promise<Spritesheet<any>>;
  getTexture: (data: TextureProps) => Promise<Texture>;
};

const TexturesContext = React.createContext<TexturesState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const TexturesProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const textureMapRef = useRef<Record<string, Texture>>({});
  const spriteSheetMapRef = useRef<Record<string, Spritesheet<any>>>({});

  const getRawTexture = useCallback(
    (name: string) =>
      new Promise<Texture>(async (resolve) => {
        const data = await fetch(name);
        const blob = await data.blob();
        const imageBitmap = await createImageBitmap(blob);
        resolve(Texture.from(imageBitmap, true));
      }),
    [],
  );

  const getSpriteSheet = useCallback(
    (name: string): Promise<Spritesheet<any>> => {
      return new Promise((resolve) => {
        if (spriteSheetMapRef.current[name])
          return resolve(spriteSheetMapRef.current[name]);

        fetch(name)
          .then((data) => data.json())
          .then(async (data) => {
            const spritePath = name.replace(/([\w-]+\.json)/, data.meta.image);
            const texture = await getRawTexture(spritePath);

            const $spriteSheet = new Spritesheet(texture, data);
            await $spriteSheet.parse();

            spriteSheetMapRef.current[name] = $spriteSheet;
            resolve($spriteSheet);
          });
      });
    },
    [getRawTexture],
  );

  const getTexture = useCallback(
    ({
      texture: textureName,
      spriteSheet: spriteSheetName,
    }: TextureProps): Promise<Texture> => {
      return new Promise(async (resolve) => {
        if (spriteSheetName) {
          const spriteSheet = await getSpriteSheet(spriteSheetName);
          return resolve(spriteSheet.textures[textureName]);
        }

        if (textureMapRef.current[textureName])
          return resolve(textureMapRef.current[textureName]);

        const texture = await getRawTexture(textureName);
        textureMapRef.current[textureName] = texture;
        resolve(texture);
      });
    },
    [getSpriteSheet, getRawTexture],
  );

  return (
    <TexturesContext.Provider
      value={{
        getSpriteSheet,
        getTexture,
      }}
      children={children}
    />
  );
};

export const useTextures = (): TexturesState => useContext(TexturesContext);
