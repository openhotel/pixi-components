import { useRef, useCallback, useImperativeHandle } from "react";
import type { FC } from "react";

import { extend } from "@pixi/react";
import {
  HTMLText,
  TextStyleOptions,
  TextureStyle,
  TextureStyleOptions,
} from "pixi.js";
import { DisplayObjectProps, type DisplayObjectRefProps } from "../../../types";
import { useDisplayObject } from "../../../hooks";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  HtmlText: HTMLText,
});

export type HtmlTextRef = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectRefProps<HTMLText>;

export type HtmlTextProps = {
  text: string;
  style?: Partial<TextStyleOptions>;
  textureStyle?: TextureStyle | TextureStyleOptions;
} & DisplayObjectProps<HtmlTextRef>;

export const HtmlTextComponent: FC<HtmlTextProps> = ({ ref, ...props }) => {
  const textRef = useRef<HTMLText>(null);
  const $props = useDisplayObject(props);

  const getRefProps = useCallback(
    (): HtmlTextRef => ({
      ...getDisplayObjectRefFunctions(textRef.current),
      ...$props,
      text: props.text,
      component: textRef.current,
    }),
    [textRef.current, $props, props.text],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  return <pixiHtmlText ref={textRef} {...$props} />;
};
