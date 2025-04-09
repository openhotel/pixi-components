import { useTextures } from ".";
import { useCallback, useMemo } from "react";

export const useText = (spriteSheet: string) => {
  const { getSpriteSheet } = useTextures();

  const $spriteSheet = useMemo(
    () => getSpriteSheet(spriteSheet),
    [getSpriteSheet, spriteSheet],
  );

  const isCharValid = useCallback(
    (char: string) => Boolean($spriteSheet.textures[char]),
    [$spriteSheet],
  );

  const getTextLength = useCallback(
    (text: string) => {
      if (!$spriteSheet) return 0;
      return text.split("").reduce((length, char) => {
        const charWidth = $spriteSheet.textures[char]?.width;
        if (!charWidth) return length;
        return length + charWidth + 1;
      }, 0);
    },
    [$spriteSheet],
  );

  return {
    isCharValid,
    getTextLength,
  };
};
