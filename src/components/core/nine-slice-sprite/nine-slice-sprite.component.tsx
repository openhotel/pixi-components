import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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

//TODO Not working as expected because this https://github.com/pixijs/pixijs/issues/11309
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
  const spriteRef = useRef<NineSliceSprite>(null);

  const { renderedMask, ...$props } = useDisplayObject(props);
  const { getTexture } = useTextures();

  const [$texture, $setTexture] = useState<Texture>(null);

  useEffect(() => {
    getTexture({ spriteSheet, texture }).then($setTexture);
  }, [spriteSheet, texture, getTexture, $setTexture]);

  const getRefProps = useCallback(
    (): NineSliceSpriteRef => ({
      ...getDisplayObjectRefFunctions(spriteRef.current),
      ...$props,
      label,
      component: spriteRef.current,
      texture: $texture,
    }),
    [$texture, spriteRef.current, label, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    if (!$texture || !spriteRef.current) return;
    spriteRef.current.parent.emit("child-loaded", null);
  }, [spriteRef.current, $texture]);

  if (!$texture) return null;

  return (
    <>
      {renderedMask}
      <pixiNineSliceSprite
        ref={spriteRef}
        {...$props}
        label={label}
        texture={$texture}
        roundPixels={true}
      />
    </>
  );
};
