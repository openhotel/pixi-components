import { useRef, useCallback, useImperativeHandle } from "react";
import type { FC } from "react";

import { extend } from "@pixi/react";
import {
  BitmapText,
  TextStyleOptions,
  TextureStyle,
  TextureStyleOptions,
} from "pixi.js";
import { DisplayObjectProps, type DisplayObjectRefProps } from "../../../types";
import { useDisplayObject } from "../../../hooks";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  BitmapText,
});

export type BitmapTextRef = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectRefProps<BitmapText>;

export type BitmapTextProps = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectProps<BitmapTextRef>;

export const BitmapTextComponent: FC<BitmapTextProps> = ({ ref, ...props }) => {
  const textRef = useRef<BitmapText>(null);
  const $props = useDisplayObject(props);

  const getRefProps = useCallback(
    (): BitmapTextRef => ({
      ...getDisplayObjectRefFunctions(textRef.current),
      ...$props,
      text: props.text,
      component: textRef.current,
    }),
    [textRef.current, $props, props.text],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  return <pixiBitmapText ref={textRef} {...$props} />;
};
