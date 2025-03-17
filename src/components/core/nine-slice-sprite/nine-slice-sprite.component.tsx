import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { extend } from "@pixi/react";
import { Texture } from "pixi.js";
import { NineSliceSprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  NineSliceSprite,
});

export type NineSliceSpriteRef = {
  texture: Texture;
} & DisplayObjectRefProps<NineSliceSprite>;

export type NineSliceSpriteProps = {
  spriteSheet?: string;
  texture: string;

  leftWidth: number;
  rightWidth: number;
  topHeight: number;
  bottomHeight: number;
  width?: number;
  height?: number;
} & DisplayObjectProps<NineSliceSpriteRef>;

/**
 * A: leftWidth
 * B: rightWidth
 * C: topHeight
 * D: bottomHeight
 *
 *       A                          B
 *     +---+----------------------+---+
 *   C | 1 |          2           | 3 |
 *     +---+----------------------+---+
 *     |   |                      |   |
 *     | 4 |          5           | 6 |
 *     |   |                      |   |
 *     +---+----------------------+---+
 *   D | 7 |          8           | 9 |
 *     +---+----------------------+---+
 *   When changing this objects width and/or height:
 *      areas 1 3 7 and 9 will remain unscaled.
 *      areas 2 and 8 will be stretched horizontally
 *      areas 4 and 6 will be stretched vertically
 *      area 5 will be stretched both horizontally and vertically
 */
export const NineSliceSpriteComponent: React.FC<NineSliceSpriteProps> = ({
  ref,
  label = "nine-slice-sprite",
  spriteSheet,
  texture,
  ...props
}) => {
  const nineSliceSpriteRef = useRef<NineSliceSprite>(null);

  const $props = useDisplayObject(props);
  const { getTexture } = useTextures();

  const $texture = useMemo(
    () => getTexture({ spriteSheet, texture }),
    [getTexture, spriteSheet, texture],
  );

  const getRefProps = useCallback(
    (): NineSliceSpriteRef => ({
      ...getDisplayObjectRefFunctions(nineSliceSpriteRef.current),
      ...$props,
      label,
      component: nineSliceSpriteRef.current,
      texture: $texture,
    }),
    [$texture, nineSliceSpriteRef.current, label, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    if (!$texture || !nineSliceSpriteRef.current) return;
    nineSliceSpriteRef.current.parent.emit("child-loaded", null);
  }, [nineSliceSpriteRef.current, $texture]);

  if (!$texture) return null;

  return (
    <>
      <pixiNineSliceSprite
        ref={nineSliceSpriteRef}
        {...$props}
        label={label}
        texture={$texture}
        roundPixels={true}
      />
      {$props.maskRender}
    </>
  );
};
