import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SpriteTextComponent,
  SpriteTextProps,
  TextProps,
} from "../sprite-text";
import {
  ContainerComponent,
  ContainerRef,
  GraphicsComponent,
} from "../../core";
import { Cursor, Event, EventMode, GraphicType } from "../../../enums";
import { useComponentContext, useEvents } from "../../../hooks";
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

  //input
  const containerRef = useRef<ContainerRef>(null);
  const isFocusedRef = useRef<boolean>(false);
  const [value, setValue] = useState(defaultValue);

  //cursor
  const currentAccentCodeRef = useRef<string>(null);
  const cursorBlinkIntervalRef = useRef<number>(null);
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);

  const startCursorBlink = useCallback(() => {
    clearInterval(cursorBlinkIntervalRef.current);
    cursorBlinkIntervalRef.current = setInterval(() => {
      setCursorVisible((visible) => !visible);
    }, 530);
    setCursorVisible(true);
  }, [setCursorVisible]);

  const stopCursorBlink = useCallback(() => {
    clearInterval(cursorBlinkIntervalRef.current);
    setCursorVisible(false);
  }, [setCursorVisible]);

  const onKeyDown = useCallback(
    ({ key, metaKey, ctrlKey, code, shiftKey }: KeyboardEvent) => {
      if (!isFocusedRef.current) return;

      if (key === "Tab") return;
      if ((metaKey || ctrlKey) && key.toLowerCase() === "v") return;

      const accentCode = getAccentCode(code, shiftKey);
      if (accentCode) {
        currentAccentCodeRef.current = accentCode;
        return;
      }
      if (currentAccentCodeRef.current) {
        const combinedChar = combineAccentAndChar(
          currentAccentCodeRef.current,
          key,
        );
        if (combinedChar) key = combinedChar;
        currentAccentCodeRef.current = "";
      }
      if (key.length !== 1) return;

      stopCursorBlink();
      setValue((value) => value + key);
    },
    [stopCursorBlink, setValue],
  );

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!isFocusedRef.current) return;

      startCursorBlink();
    },
    [startCursorBlink],
  );

  useEffect(() => {
    const removeOnKeyDown = on<unknown>(Event.KEY_DOWN, onKeyDown);
    const removeOnKeyUp = on<unknown>(Event.KEY_UP, onKeyUp);

    return () => {
      removeOnKeyDown();
      removeOnKeyUp();
    };
  }, [on, onKeyDown, onKeyUp]);

  //<<<<<<<<<<<<<<<

  const onFocus = useCallback(() => {
    isFocusedRef.current = true;
    startCursorBlink();
  }, []);
  const onBlur = useCallback(() => {
    isFocusedRef.current = false;
    stopCursorBlink();
  }, []);

  const { focus, blur, ...componentContext } = useComponentContext({
    containerRef,
    onBlur,
    onFocus,
  });

  return (
    <ContainerComponent
      label={label}
      ref={containerRef}
      {...containerProps}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      {...componentContext}
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
      {/* cursor */}
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={1}
        height={9}
        tint={color}
        pivot={{ x: -padding?.left + 1, y: -padding?.top + 2 }}
        eventMode={EventMode.NONE}
        visible={cursorVisible}
      />
    </ContainerComponent>
  );
};
