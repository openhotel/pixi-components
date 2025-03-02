import { useTextures } from ".";
import { useCallback, useEffect, useState } from "react";
import { Spritesheet } from "pixi.js";

export const useText = (spriteSheet: string) => {
  const { getSpriteSheet } = useTextures();

  const [$spriteSheet, $setSpriteSheet] = useState<Spritesheet>(null);

  const getTextLength = useCallback(
    (text: string) => {
      if (!$spriteSheet) return 0;
      return text.split("").reduce((length, char) => {
        return length + $spriteSheet.textures[char].width + 1;
      }, 0);
    },
    [$spriteSheet],
  );

  useEffect(() => {
    getSpriteSheet(spriteSheet).then($setSpriteSheet);
  }, [spriteSheet, getSpriteSheet, $setSpriteSheet]);

  return {
    getTextLength,
  };
};
