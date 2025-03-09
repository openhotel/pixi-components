import React, { ReactNode, useCallback, useContext, useRef } from "react";
import { Spritesheet, Texture } from "pixi.js";

type TextureProps = { texture: string; spriteSheet?: string };

type TexturesState = {
  loadSpriteSheet: (name: string) => Promise<void>;
  loadTexture: (name: string) => Promise<void>;

  getSpriteSheet: (name: string) => Spritesheet<any>;
  getTexture: (data: TextureProps) => Texture;
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

  const loadSpriteSheet = useCallback(
    (name: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (spriteSheetMapRef.current[name]) {
          console.warn(`SpriteSheet with name '${name}' already loaded!`);
          resolve();
          return;
        }

        fetch(name)
          .then((data) => data.json())
          .then(async (data) => {
            const spritePath = name.replace(/([\w-]+\.json)/, data.meta.image);
            const texture = await getRawTexture(spritePath);

            const $spriteSheet = new Spritesheet(texture, data);
            await $spriteSheet.parse();

            spriteSheetMapRef.current[name] = $spriteSheet;
            resolve();
          })
          .catch(reject);
      });
    },
    [getRawTexture],
  );

  const loadTexture = useCallback(
    (name: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if (textureMapRef.current[name]) {
          console.warn(`Texture with name '${name}' already loaded!`);
          resolve();
          return;
        }

        try {
          textureMapRef.current[name] = await getRawTexture(name);
          resolve();
        } catch (e) {
          reject();
        }
      });
    },
    [getRawTexture],
  );

  const getSpriteSheet = useCallback((spriteSheetName: string): Spritesheet => {
    return spriteSheetMapRef.current[spriteSheetName] ?? null;
  }, []);

  const getTexture = useCallback(
    ({
      texture: textureName,
      spriteSheet: spriteSheetName,
    }: TextureProps): Texture => {
      if (spriteSheetName && getSpriteSheet(spriteSheetName))
        return getSpriteSheet(spriteSheetName)?.textures?.[textureName] ?? null;

      if (textureMapRef.current[textureName])
        return textureMapRef.current[textureName];

      return null;
    },
    [getSpriteSheet],
  );

  return (
    <TexturesContext.Provider
      value={{
        loadSpriteSheet,
        loadTexture,
        getSpriteSheet,
        getTexture,
      }}
      children={children}
    />
  );
};

export const useTextures = (): TexturesState => useContext(TexturesContext);
