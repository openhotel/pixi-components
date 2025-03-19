import { useTextures } from ".";
import { useCallback, useMemo } from "react";

export const useText = (spriteSheet: string) => {
  const { getSpriteSheet } = useTextures();

  const $spriteSheet = useMemo(
    () => getSpriteSheet(spriteSheet),
    [getSpriteSheet, spriteSheet],
  );

  const getTextLength = useCallback(
    (text: string) => {
      if (!$spriteSheet) return 0;
      return text.split("").reduce((length, char) => {
        return length + $spriteSheet.textures[char].width + 1;
      }, 0);
    },
    [$spriteSheet],
  );

  return {
    getTextLength,
  };
};
