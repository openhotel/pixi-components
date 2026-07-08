import { useRef, useCallback, useImperativeHandle } from "react";
import type { FC } from "react";

import { extend } from "@pixi/react";
import {
  Text,
  TextStyleOptions,
  TextureStyle,
  TextureStyleOptions,
} from "pixi.js";
import { DisplayObjectProps, type DisplayObjectRefProps } from "../../../types";
import { useDisplayObject } from "../../../hooks";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  Text,
});

export type TextRef = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectRefProps<Text>;

export type TextProps = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectProps<TextRef>;

export const TextComponent: FC<TextProps> = ({ ref, ...props }) => {
  const textRef = useRef<Text>(null);
  const $props = useDisplayObject(props);

  const getRefProps = useCallback(
    (): TextRef => ({
      ...getDisplayObjectRefFunctions(textRef.current),
      ...$props,
      text: props.text,
      component: textRef.current,
    }),
    [textRef.current, $props, props.text],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  return <pixiText ref={textRef} {...$props} />;
};
