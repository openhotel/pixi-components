import React, { ReactNode, useCallback } from "react";
import { TextureProps, TexturesContext } from "./textures.context";
import { Spritesheet, Texture } from "pixi.js";
import { useTexturesStore } from "./textures.store";

type TexturesProps = {
  children: ReactNode;
};

export const TexturesProvider: React.FunctionComponent<TexturesProps> = ({
  children,
}) => {
  const {
    getTexture: $getTexture,
    getSpriteSheet: $getSpriteSheet,
    setSpriteSheet,
    setTexture,
  } = useTexturesStore();

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
        if ($getSpriteSheet(name)) {
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

            setSpriteSheet(name, $spriteSheet);
            resolve();
          })
          .catch(reject);
      });
    },
    [getRawTexture, $getSpriteSheet, setSpriteSheet],
  );

  const loadTexture = useCallback(
    (name: string): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        if ($getTexture(name)) {
          console.warn(`Texture with name '${name}' already loaded!`);
          resolve();
          return;
        }

        try {
          setTexture(name, await getRawTexture(name));
          resolve();
        } catch (e) {
          reject();
        }
      });
    },
    [getRawTexture, $getTexture, setTexture],
  );

  const getSpriteSheet = useCallback(
    (spriteSheetName: string): Spritesheet => {
      return $getSpriteSheet(spriteSheetName) ?? null;
    },
    [$getSpriteSheet],
  );

  const getTexture = useCallback(
    ({
      texture: textureName,
      spriteSheet: spriteSheetName,
    }: TextureProps): Texture => {
      if (spriteSheetName && $getSpriteSheet(spriteSheetName))
        return (
          $getSpriteSheet(spriteSheetName)?.textures?.[textureName] ?? null
        );

      if ($getTexture(textureName)) return $getTexture(textureName);

      return null;
    },
    [getSpriteSheet, $getSpriteSheet, $getTexture],
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
