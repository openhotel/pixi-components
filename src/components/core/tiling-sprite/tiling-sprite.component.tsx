import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { extend } from "@pixi/react";
import { Texture } from "pixi.js";
import { TilingSprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import {
  DisplayObjectProps,
  DisplayObjectRefProps,
  Point,
} from "../../../types";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  TilingSprite,
});

export type TilingSpriteRef = {
  texture: Texture;
} & DisplayObjectRefProps<TilingSprite>;

export type TilingSpriteProps = {
  spriteSheet?: string;
  texture: string;
  tilePosition?: Point;
  width?: number;
  height?: number;
} & DisplayObjectProps<TilingSpriteRef>;

export const TilingSpriteComponent: React.FC<TilingSpriteProps> = ({
  ref,
  label = "sprite",
  spriteSheet,
  texture,
  ...props
}) => {
  const tilingSpriteRef = useRef<TilingSprite>(null);

  const $props = useDisplayObject(props);
  const { getTexture } = useTextures();

  const $texture = useMemo(
    () => getTexture({ spriteSheet, texture }),
    [getTexture, spriteSheet, texture],
  );

  const getRefProps = useCallback(
    (): TilingSpriteRef => ({
      ...getDisplayObjectRefFunctions(tilingSpriteRef.current),
      ...$props,
      label,
      component: tilingSpriteRef.current,
      texture: $texture,
    }),
    [$texture, tilingSpriteRef.current, label, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    if (!$texture || !tilingSpriteRef.current) return;
    tilingSpriteRef.current.parent.emit("child-loaded", null);
  }, [tilingSpriteRef.current, $texture]);

  return (
    <>
      {$props.maskRender}
      <pixiTilingSprite
        //@ts-ignore
        ref={tilingSpriteRef}
        //@ts-ignore
        label={label}
        {...$props}
        //@ts-ignore
        texture={$texture}
      />
    </>
  );
};
