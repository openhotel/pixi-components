import React, { useCallback, useEffect, useState } from "react";
import {
  SpriteTextComponent,
  SpriteTextProps,
  TextProps,
} from "../sprite-text";
import { ContainerComponent, GraphicsComponent } from "../../core";
import { Cursor, Event, EventMode, GraphicType } from "../../../enums";
import { useEvents } from "../../../hooks";
import { combineAccentAndChar, getAccentCode } from "../../../utils";

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
  const { on } = useEvents();
  const [value, setValue] = useState(defaultValue);

  const onPointerDown = useCallback((event: PointerEvent) => {
    console.log(event);
  }, []);

  let currentAccentCode;
  const onKeyDown = useCallback(
    ({ key, metaKey, ctrlKey, code, shiftKey }: KeyboardEvent) => {
      console.log(key);
      if (key === "Tab") return;
      if ((metaKey || ctrlKey) && key.toLowerCase() === "v") return;

      const accentCode = getAccentCode(code, shiftKey);
      if (accentCode) {
        currentAccentCode = accentCode;
        return;
      }
      if (currentAccentCode) {
        const combinedChar = combineAccentAndChar(currentAccentCode, key);
        if (combinedChar) key = combinedChar;
        currentAccentCode = "";
      }
      if (key.length !== 1) return;

      setValue((value) => value + key);
    },
    [setValue],
  );
  const onKeyUp = useCallback((event: KeyboardEvent) => {}, []);

  useEffect(() => {
    const removeOnKeyDown = on<unknown>(Event.KEY_DOWN, onKeyDown);
    const removeOnKeyUp = on<unknown>(Event.KEY_UP, onKeyUp);

    return () => {
      removeOnKeyDown();
      removeOnKeyUp();
    };
  }, [on]);

  return (
    <ContainerComponent
      label={label}
      {...containerProps}
      eventMode={EventMode.STATIC}
      onPointerDown={onPointerDown}
      cursor={Cursor.POINTER}
    >
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
