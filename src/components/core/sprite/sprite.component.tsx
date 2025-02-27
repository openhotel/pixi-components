import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { extend } from "@pixi/react";
import { Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
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
  spriteSheet,
  texture,
  ...props
}) => {
  const spriteRef = useRef<Sprite>(null);

  const $props = useDisplayObject(props);
  const { getTexture } = useTextures();

  const [$texture, $setTexture] = useState<Texture>(Texture.EMPTY);

  useEffect(() => {
    getTexture({ spriteSheet, texture }).then($setTexture);
  }, [spriteSheet, texture, getTexture, $setTexture]);

  const getRefProps = useCallback(
    (): SpriteRef => ({
      ...getDisplayObjectRefFunctions(spriteRef.current),
      ...$props,
      component: spriteRef.current,
      texture: $texture,
    }),
    [$texture, spriteRef.current, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    if (!$texture || !spriteRef.current) return;
    spriteRef.current.parent.emit("child-loaded", null);
  }, [spriteRef.current, $texture]);

  return <pixiSprite ref={spriteRef} {...$props} texture={$texture} />;
};
