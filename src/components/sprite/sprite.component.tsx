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
import { useTextures, useDisplayObject } from "../../hooks";
import { DisplayObjectProps, DisplayObjectRefFunctions } from "../../types";
import { getDisplayObjectRefFunctions } from "../../utils";

extend({
  Sprite,
});

export type SpriteRef = {
  texture: Texture;
} & DisplayObjectRefFunctions<Sprite>;

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
  const { getTexture, getSpriteSheet } = useTextures();

  const [$texture, $setTexture] = useState<Texture>(undefined);

  useEffect(() => {
    if (spriteSheet)
      getSpriteSheet(spriteSheet).then((spriteSheet) =>
        $setTexture(spriteSheet.textures[texture]),
      );
    else getTexture(texture).then($setTexture);
  }, [spriteSheet, texture, getSpriteSheet, getTexture, $setTexture]);

  const getRefProps = useCallback(
    (): SpriteRef => ({
      ...getDisplayObjectRefFunctions(spriteRef.current),
      component: spriteRef.current,
      texture: $texture,
    }),
    [$texture, spriteRef.current],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    const refProps = getRefProps();
    if (!$texture || !refProps.component) return;
    spriteRef.current.parent.emit("child-loaded", refProps);
  }, [getRefProps, $texture]);

  return <pixiSprite ref={spriteRef} {...$props} texture={$texture} />;
};
