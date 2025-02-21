import React, { ReactNode, useCallback, useContext, useState } from "react";
import { Spritesheet, Texture } from "pixi.js";

type TexturesState = {
  getSpriteSheet: (name: string) => Promise<Spritesheet<any>>;
  getTexture: (name: string) => Promise<Texture>;
};

const TexturesContext = React.createContext<TexturesState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const TexturesProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const [textureMap, setTextureMap] = useState<Record<string, Texture>>({});
  const [spriteSheetMap, setSpriteSheetMap] = useState<
    Record<string, Spritesheet<any>>
  >({});

  const getTexture = useCallback(
    (name: string): Promise<Texture> => {
      return new Promise(async (resolve) => {
        if (textureMap[name]) return resolve(textureMap[name]);

        const data = await fetch(name);
        const blob = await data.blob();
        const imageBitmap = await createImageBitmap(blob);
        const texture = Texture.from(imageBitmap);

        setTextureMap((map) => {
          return {
            ...map,
            [name]: texture,
          };
        });
        resolve(texture);
      });
    },
    [setTextureMap],
  );

  const getSpriteSheet = useCallback(
    (name: string): Promise<Spritesheet<any>> => {
      return new Promise((resolve) => {
        if (spriteSheetMap[name]) return resolve(spriteSheetMap[name]);

        fetch(name)
          .then((data) => data.json())
          .then(async (data) => {
            const imagePath = name.replace(/([\w-]+\.json)/, data.meta.image);
            const texture = await getTexture(imagePath);
            const $spriteSheet = new Spritesheet(texture, data);
            await $spriteSheet.parse();

            setSpriteSheetMap((map) => {
              return {
                ...map,
                [name]: $spriteSheet,
              };
            });
            resolve($spriteSheet);
          });
      });
    },
    [setSpriteSheetMap, getTexture],
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
