import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type React from "react";

import { extend } from "@pixi/react";
import { Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import type { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  Sprite,
});

export type SpriteRef = {
  texture: Texture;
} & DisplayObjectRefProps<Sprite>;

export type SpriteProps = {
  spriteSheet?: string;
  texture: string;
} & DisplayObjectProps<SpriteRef>;

export const SpriteComponent: React.FC<SpriteProps> = ({
  ref,
  label = "sprite",
  spriteSheet,
  texture,
  ...props
}) => {
  const spriteRef = useRef<Sprite>(null);

  const $props = useDisplayObject(props);
  const { getTexture } = useTextures();

  const $texture = useMemo(
    () => getTexture({ spriteSheet, texture }),
    [getTexture, spriteSheet, texture],
  );

  const getRefProps = useCallback(
    (): SpriteRef => ({
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

  return (
    <>
      <pixiSprite
        ref={spriteRef}
        label={label}
        {...$props}
        texture={$texture}
      />
      {$props.maskRender}
    </>
  );
};
