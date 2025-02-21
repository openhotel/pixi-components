import { ContainerComponent, ContainerProps } from "../container";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SpriteComponent } from "../sprite";
import { useTextures } from "../../hooks";

export type SpriteProps = {
  spriteSheet: string;
  text: string;
  color?: number | number[];
} & ContainerProps;

export const SpriteTextComponent: React.FC<SpriteProps> = ({
  spriteSheet,
  text,
  color = [0xffffff, 0xff00ff, 0x0000ff],
  ...containerProps
}) => {
  const { getSpriteSheet } = useTextures();
  const [textSprites, setTextSprites] = useState<ReactNode[]>([]);

  useEffect(() => {
    getSpriteSheet(spriteSheet).then(($spriteSheet) => {
      let list = [];
      let lastX = 0;

      const chars = text.split("");
      for (let index = 0; index < chars.length; index++) {
        const char = chars[index];
        const charData = $spriteSheet.textures[char];
        list.push(
          <SpriteComponent
            spriteSheet={spriteSheet}
            texture={char}
            tint={
              Array.isArray(color)
                ? (color[index] ?? color[color.length - 1] ?? 0xffffff)
                : color
            }
            position={{
              x: lastX,
            }}
          />,
        );
        lastX += charData.width + 1;
      }
      setTextSprites(list);
    });
  }, [text, getSpriteSheet]);

  return (
    <ContainerComponent {...containerProps}>{textSprites}</ContainerComponent>
  );
};
