import {
  ContainerComponent,
  SpriteComponent,
  GraphicsComponent,
} from "../../core";
import type { ContainerRef } from "../../core";
import { Fragment, useImperativeHandle, useMemo, useRef } from "react";
import type { FC } from "react";
import { useTextures } from "../../../hooks";
import { GraphicType, HorizontalAlign } from "../../../enums";
import type { DisplayObjectProps, Sides, Size } from "../../../types";

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

export const SpriteTextComponent: FC<SpriteTextProps> = ({
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
  ref,
  ...containerProps
}) => {
  const { getSpriteSheet } = useTextures();

  const containerRef = useRef<ContainerRef>(null);

  useImperativeHandle(ref, () => containerRef.current, [ref]);

  const sizeRef = useRef<Size>({ width: 0, height: 0 });

  const $spriteSheet = useMemo(
    () => getSpriteSheet(spriteSheet),
    [getSpriteSheet, spriteSheet],
  );

  const canLoad = useMemo(
    () => text.length > 0 && $spriteSheet,
    [text, $spriteSheet],
  );

  const textSprites = useMemo(() => {
    if (!canLoad) return null;

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
        <Fragment key={index + char}>
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
              width={charData.width + 1 + (!isLast ? $padding.right : 0)}
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
        </Fragment>,
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
    sizeRef.current = {
      width: maxWidth ?? lastX,
      height: ($spriteSheet.textures[" "].height + 1) * jumps,
    };
    if (containerRef.current)
      containerRef.current.component.parent.emit("child-loaded", null);
    return list;
  }, [
    getSpriteSheet,
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

  return useMemo(
    () =>
      canLoad ? (
        <ContainerComponent
          ref={containerRef}
          maskPolygon={
            maxWidth && !wrap
              ? [
                  0,
                  0,
                  maxWidth,
                  0,
                  maxWidth,
                  sizeRef.current.height,
                  0,
                  sizeRef.current.height,
                ]
              : null
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
              width={(sizeRef.current?.width ?? 0) + (padding?.right ?? 0)}
              height={
                (sizeRef.current?.height ?? 0) +
                (padding?.top ?? 0) +
                (padding?.bottom ?? 0)
              }
              tint={backgroundColor as number}
              alpha={backgroundAlpha as number}
              zIndex={0}
            />
          ) : null}
        </ContainerComponent>
      ) : null,
    [
      canLoad,
      maxWidth,
      wrap,
      label,
      containerProps,
      textSprites,
      backgroundColor,
      backgroundAlpha,
      padding,
    ],
  );
};
