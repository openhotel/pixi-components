import React, { useState } from "react";
import {
  SpriteTextComponent,
  SpriteTextProps,
  TextProps,
} from "../sprite-text";
import { ContainerComponent, GraphicsComponent } from "../../core";
import { GraphicType } from "../../../enums";

export type SpriteTextInputProps = {
  color?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;

  width: number;
  height: number;

  passwordChar?: string;
  defaultValue?: string;
  placeholder?: string;
  placeholderProps?: TextProps;
  maxLength?: number;
} & Omit<
  SpriteTextProps,
  "text" | "wrap" | "color" | "backgroundAlpha" | "backgroundColor"
>;

export const SpriteTextInputComponent: React.FC<SpriteTextInputProps> = ({
  //sprite-text
  spriteSheet,
  color,
  horizontalAlign,
  alpha,
  // input
  backgroundColor,
  width,
  height,
  defaultValue,
  padding,
  // display
  label = "sprite-text-input",
  // container
  ...containerProps
}) => {
  const [value, setValue] = useState(defaultValue);

  console.log(backgroundColor);
  return (
    <ContainerComponent label={label} {...containerProps}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={width + (padding?.left ?? 0) + (padding?.right ?? 0)}
        height={height + (padding?.top ?? 0) + (padding?.bottom ?? 0)}
        tint={backgroundColor}
      />
      <SpriteTextComponent
        spriteSheet={spriteSheet}
        text={value}
        color={color}
        position={{
          x: padding?.left ?? 0,
          y: padding?.top ?? 0,
        }}
      />
    </ContainerComponent>
  );
};
