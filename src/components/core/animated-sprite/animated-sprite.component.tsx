import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { extend } from "@pixi/react";
import { Texture, Sprite, Spritesheet, AnimatedSprite } from "pixi.js";
import { useTextures, useDisplayObject } from "../../../hooks";
import { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
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
  spriteSheet,
  animation,
  playStatus = PlayStatus.PLAY_AND_STOP,
  ...props
}) => {
  const animatedSpriteRef = useRef<AnimatedSprite>(null);

  const $props = useDisplayObject(props);
  const { getSpriteSheet } = useTextures();

  const [$spriteSheet, $setSpriteSheet] = useState<Spritesheet>(null);

  useEffect(() => {
    getSpriteSheet(spriteSheet).then($setSpriteSheet);
  }, [spriteSheet, $setSpriteSheet]);

  const getRefProps = useCallback(
    (): AnimatedSpriteRef => ({
      ...getDisplayObjectRefFunctions(animatedSpriteRef.current),
      ...$props,
      component: animatedSpriteRef.current,
      spriteSheet: $spriteSheet,
    }),
    [$spriteSheet, animatedSpriteRef.current, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  const isReady = useMemo(
    () => animatedSpriteRef.current && $spriteSheet,
    [animatedSpriteRef.current, $spriteSheet],
  );

  useEffect(() => {
    if (!isReady) return;
    animatedSpriteRef.current.parent.emit("child-loaded", null);
  }, [animatedSpriteRef.current, isReady]);

  useEffect(() => {
    if (!isReady) return;

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
  }, [isReady, playStatus, animation]);

  return (
    <pixiAnimatedSprite
      ref={animatedSpriteRef}
      {...$props}
      textures={$spriteSheet?.animations?.[animation] ?? [Texture.EMPTY]}
    />
  );
};
