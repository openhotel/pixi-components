import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { extend } from "@pixi/react";
import { Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../hooks";
import { DisplayObjectProps, DisplayObjectRefProps, Size } from "../../types";

extend({
  Sprite,
});

export type SpriteRef = {
  texture: Texture;

  getSize: () => Size;
} & DisplayObjectRefProps;

export type SpriteProps = {
  spriteSheet?: string;
  texture: string;
} & DisplayObjectProps<SpriteRef>;

export const SpriteComponent: React.FC<SpriteProps> = ({
  ref,
  onDraw,
  spriteSheet,
  texture,
  ...props
}) => {
  const spriteRef = useRef<Sprite>(null);

  const $props = useDisplayObject(props);
  const { getTexture, getSpriteSheet } = useTextures();

  const [$texture, $setTexture] = useState<Texture>(undefined);

  useEffect(() => {
    if (spriteSheet)
      getSpriteSheet(spriteSheet).then((spriteSheet) =>
        $setTexture(spriteSheet.textures[texture]),
      );
    else getTexture(texture).then($setTexture);
  }, [spriteSheet, texture, getSpriteSheet, getTexture, $setTexture]);

  const $refProps = useMemo(
    (): SpriteRef => ({
      ...$props,
      texture: $texture,

      getSize: () => spriteRef.current.getSize(),
    }),
    [$props, $texture],
  );

  useImperativeHandle(ref, (): SpriteRef => $refProps, [$refProps]);

  useEffect(() => {
    if (!$refProps.texture) return;
    onDraw?.($refProps);
  }, [onDraw, $refProps.texture]);

  return <pixiSprite ref={spriteRef} {...$props} texture={$texture} />;
};
