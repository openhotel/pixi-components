import { ContainerComponent, ContainerProps } from "../container";
import React, { ReactNode, useEffect, useState } from "react";
import { SpriteComponent } from "../sprite";
import { useTextures } from "../../hooks";
import { GraphicsComponent } from "../graphics";
import { GraphicType, HorizontalAlign } from "../../enums";
import { Sides, Size } from "../../types";

export type SpriteTextProps = {
  spriteSheet: string;
  text: string;

  maxWidth?: number;
  wrap?: boolean;

  horizontalAlign?: HorizontalAlign;

  color?: number | number[];
  backgroundColor?: number | number[];
  backgroundAlpha?: number | number[];
  padding?: Partial<Sides>;
  alpha?: number | number[];
} & Omit<ContainerProps, "alpha">;

export const SpriteTextComponent: React.FC<SpriteTextProps> = ({
  spriteSheet,
  text,
  maxWidth,
  wrap = true,
  horizontalAlign = HorizontalAlign.LEFT,
  color = 0xffffff,
  backgroundColor,
  backgroundAlpha,
  padding,
  alpha,
  ...containerProps
}) => {
  const { getSpriteSheet } = useTextures();

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [textSprites, setTextSprites] = useState<ReactNode[]>([]);

  useEffect(() => {
    const isWrapEnabled = wrap && maxWidth;
    const $padding = {
      left: isWrapEnabled ? 0 : (padding?.left ?? 0),
      right: isWrapEnabled ? 0 : (padding?.right ?? 0),
      top: isWrapEnabled ? 0 : (padding?.top ?? 0),
      bottom: isWrapEnabled ? 0 : (padding?.bottom ?? 0),
    };

    getSpriteSheet(spriteSheet).then(($spriteSheet) => {
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
      setTextSprites(list);
      setSize({
        width: maxWidth ?? lastX,
        height: ($spriteSheet.textures[" "].height + 1) * jumps,
      });
    });
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
      {...containerProps}
    >
      {textSprites}
      {(backgroundAlpha && !Array.isArray(backgroundColor)) ||
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
