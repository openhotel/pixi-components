import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type React from "react";

import { extend } from "@pixi/react";
import { Texture, Sprite, Spritesheet, AnimatedSprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import type { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
import { getDisplayObjectRefFunctions } from "../../../utils";
import { PlayStatus } from "../../../enums";

extend({
  AnimatedSprite,
});

export type AnimatedSpriteRef = {
  spriteSheet: Spritesheet;
} & DisplayObjectRefProps<Sprite>;

export type AnimatedSpriteProps = {
  spriteSheet: string;
  animation: string;

  animationSpeed?: number;
  playStatus?: PlayStatus;

  onComplete?: () => void | Promise<void>;
  onFrameChange?: (currentFrame: number) => void | Promise<void>;
} & DisplayObjectProps<AnimatedSpriteRef>;

export const AnimatedSpriteComponent: React.FC<AnimatedSpriteProps> = ({
  ref,
  label = "animated-sprite",
  spriteSheet,
  animation,
  playStatus = PlayStatus.PLAY_AND_STOP,
  ...props
}) => {
  const animatedSpriteRef = useRef<AnimatedSprite>(null);

  const $props = useDisplayObject(props);
  const { getSpriteSheet } = useTextures();

  const $spriteSheet = useMemo(
    () => getSpriteSheet(spriteSheet),
    [getSpriteSheet, spriteSheet],
  );

  const getRefProps = useCallback(
    (): AnimatedSpriteRef => ({
      ...getDisplayObjectRefFunctions(animatedSpriteRef.current),
      ...$props,
      label,
      component: animatedSpriteRef.current,
      spriteSheet: $spriteSheet,
    }),
    [$spriteSheet, animatedSpriteRef.current, label, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  useEffect(() => {
    if (!$spriteSheet) return;
    animatedSpriteRef.current.parent.emit("child-loaded", null);
  }, [animatedSpriteRef.current, $spriteSheet]);

  useEffect(() => {
    if (!$spriteSheet) return;

    const animatedSprite = animatedSpriteRef.current;

    switch (playStatus) {
      case PlayStatus.PLAY:
        animatedSprite.loop = true;
        animatedSprite.play();
        break;
      case PlayStatus.STOP:
        animatedSprite.stop();
        break;
      case PlayStatus.PLAY_AND_STOP:
        animatedSprite.loop = false;
        animatedSprite.play();
        break;
    }
  }, [$spriteSheet, playStatus, animation]);

  return (
    <>
      <pixiAnimatedSprite
        ref={animatedSpriteRef}
        {...$props}
        label={label}
        textures={$spriteSheet?.animations?.[animation] ?? [Texture.EMPTY]}
      />
      {$props.maskRender}
    </>
  );
};
