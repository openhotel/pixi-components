import {
  ContainerComponent,
  SpriteComponent,
  GraphicsComponent,
  ContainerRef,
} from "../../core";
import React, { useEffect, useMemo, useState } from "react";
import { useTextures } from "../../../hooks";
import { GraphicType, HorizontalAlign } from "../../../enums";
import { DisplayObjectProps, Sides, Size } from "../../../types";
import { Spritesheet } from "pixi.js";

export type TextProps = {
  color?: number | number[];
  backgroundColor?: number | number[];
  backgroundAlpha?: number | number[];
  padding?: Partial<Sides>;
  alpha?: number | number[];
};

export type SpriteTextProps = {
  spriteSheet: string;
  text: string;

  maxWidth?: number;
  wrap?: boolean;

  horizontalAlign?: HorizontalAlign;
} & TextProps &
  Omit<DisplayObjectProps<ContainerRef>, "alpha">;

export const SpriteTextComponent: React.FC<SpriteTextProps> = ({
  spriteSheet,
  text = "",
  maxWidth,
  wrap = true,
  horizontalAlign = HorizontalAlign.LEFT,
  color = 0xffffff,
  backgroundColor,
  backgroundAlpha,
  padding,
  alpha,
  label = "sprite-text",
  ...containerProps
}) => {
  const { getSpriteSheet } = useTextures();

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [$spriteSheet, $setSpriteSheet] = useState<Spritesheet>(null);

  useEffect(() => {
    getSpriteSheet(spriteSheet).then($setSpriteSheet);
  }, [spriteSheet, $setSpriteSheet, getSpriteSheet]);

  const textSprites = useMemo(() => {
    if (!$spriteSheet) return null;

    const isWrapEnabled = wrap && maxWidth;
    const $padding = {
      left: isWrapEnabled ? 0 : (padding?.left ?? 0),
      right: isWrapEnabled ? 0 : (padding?.right ?? 0),
      top: isWrapEnabled ? 0 : (padding?.top ?? 0),
      bottom: isWrapEnabled ? 0 : (padding?.bottom ?? 0),
    };

    let list = [];
    let lastX = $padding?.left ?? 0;
    let lastY = $padding?.top ?? 0;

    let jumps = 1;

    const chars = text.split("");
    for (let index = 0; index < chars.length; index++) {
      const isFirst = index === 0;
      const isLast = index === chars.length - 1;

      const char = chars[index];
      const charData = $spriteSheet.textures[char];
      if (!charData) continue;
      list.push(
        <React.Fragment key={index + char}>
          <SpriteComponent
            spriteSheet={spriteSheet}
            texture={char}
            tint={
              Array.isArray(color)
                ? (color[index] ?? color[color.length - 1] ?? 0xffffff)
                : color
            }
            alpha={
              Array.isArray(alpha)
                ? (alpha[index] ?? alpha[alpha.length - 1] ?? 1)
                : alpha
            }
            zIndex={1}
            position={{
              x: lastX,
              y: lastY,
            }}
          />
          {(backgroundColor && Array.isArray(backgroundColor)) ||
          (backgroundAlpha && Array.isArray(backgroundAlpha)) ? (
            <GraphicsComponent
              type={GraphicType.RECTANGLE}
              width={
                charData.width +
                1 +
                (isFirst ? $padding.left : 0) +
                (isLast ? $padding.right : 0)
              }
              height={charData.height + $padding.top + $padding.bottom + 1}
              tint={
                Array.isArray(backgroundColor)
                  ? (backgroundColor[index] ??
                    backgroundColor[backgroundColor.length - 1] ??
                    0xffffff)
                  : backgroundColor
              }
              alpha={
                Array.isArray(backgroundAlpha)
                  ? (backgroundAlpha[index] ??
                    backgroundAlpha[backgroundAlpha.length - 1] ??
                    1)
                  : backgroundAlpha
              }
              zIndex={0}
              position={{
                x: lastX - (isFirst ? $padding.left : 0),
                y: lastY - $padding.top,
              }}
            />
          ) : null}
        </React.Fragment>,
      );
      lastX += charData.width + 1;

      if (
        wrap &&
        maxWidth &&
        lastX + $spriteSheet?.textures?.[chars?.[index + 1]]?.width + 1 >=
          maxWidth
      ) {
        lastX = $padding?.left ?? 0;
        lastY += charData.height + 1;
        jumps++;
      }
    }
    setSize({
      width: maxWidth ?? lastX,
      height: ($spriteSheet.textures[" "].height + 1) * jumps,
    });
    return list;
  }, [
    getSpriteSheet,
    setSize,
    text,
    backgroundAlpha,
    backgroundColor,
    padding,
    alpha,
    color,
    maxWidth,
    wrap,
    $spriteSheet,
  ]);

  return (
    <ContainerComponent
      mask={
        maxWidth && !wrap ? (
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={maxWidth}
            height={size.height}
          />
        ) : null
      }
      sortableChildren={true}
      label={label}
      {...containerProps}
    >
      {textSprites}
      {(backgroundColor && !Array.isArray(backgroundColor)) ||
      (backgroundAlpha && !Array.isArray(backgroundAlpha)) ? (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={size.width}
          height={size.height}
          tint={backgroundColor as number}
          alpha={backgroundAlpha as number}
          zIndex={0}
        />
      ) : null}
    </ContainerComponent>
  );
};
