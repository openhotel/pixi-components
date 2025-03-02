import React, { useCallback, useEffect, useRef } from "react";
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
import { useComponentContext, useEvents, useUpdate } from "../../../hooks";
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

  onValueChange?: (value: string) => void;
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
  onValueChange,
  // display
  label = "sprite-text-input",
  // container
  ...containerProps
}) => {
  const { on } = useEvents();
  const { update } = useUpdate();
  //input
  const containerRef = useRef<ContainerRef>(null);
  const isFocusedRef = useRef<boolean>(false);
  const textRef = useRef<string>(defaultValue);
  // const [$text, $setText] = useState(defaultValue);

  //cursor
  const currentAccentCodeRef = useRef<string>(null);
  const cursorBlinkIntervalRef = useRef<number>(null);
  const cursorTextRef = useRef<ContainerRef>(null);
  const cursorIndexRef = useRef<number>(textRef.current.length);
  const cursorVisibleRef = useRef<boolean>(false);

  const startCursorBlink = useCallback(() => {
    clearInterval(cursorBlinkIntervalRef.current);
    cursorBlinkIntervalRef.current = setInterval(() => {
      cursorVisibleRef.current = !cursorVisibleRef.current;
      update();
    }, 530);
    cursorVisibleRef.current = true;
    update();
  }, [update]);

  const stopCursorBlink = useCallback(() => {
    clearInterval(cursorBlinkIntervalRef.current);
    cursorVisibleRef.current = false;
    update();
  }, [update]);

  const writeChar = useCallback(
    (key: string) => {
      if (key.length !== 1) return;

      textRef.current =
        textRef.current.slice(0, cursorIndexRef.current) +
        key +
        textRef.current.slice(cursorIndexRef.current);
      onValueChange?.(textRef.current);

      cursorIndexRef.current++;
    },
    [onValueChange],
  );

  const makeActions = useCallback(
    (key: string) => {
      if (!textRef.current.length) return;

      if (
        key === "Backspace" &&
        cursorIndexRef.current > 0 &&
        textRef.current.length > 0
      ) {
        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current - 1) +
          textRef.current.slice(cursorIndexRef.current);
        onValueChange?.(textRef.current);

        cursorIndexRef.current--;
        return;
      }

      if (
        key === "Delete" &&
        cursorIndexRef.current < textRef.current.length &&
        textRef.current.length > 0
      ) {
        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current) +
          textRef.current.slice(cursorIndexRef.current + 1);
        onValueChange?.(textRef.current);

        return;
      }

      if (key === "ArrowLeft" && cursorIndexRef.current > 0) {
        cursorIndexRef.current--;
        return;
      }

      if (
        key === "ArrowRight" &&
        cursorIndexRef.current < textRef.current.length
      ) {
        cursorIndexRef.current++;
        return;
      }
    },
    [update, onValueChange],
  );

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

      stopCursorBlink();
      writeChar(key);
      makeActions(key);
      update();
    },
    [stopCursorBlink, writeChar, makeActions, update],
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

  let textCursorOverflowX =
    (cursorTextRef?.current?.getSize?.()?.width ?? 0) - width;
  textCursorOverflowX = textCursorOverflowX > 0 ? textCursorOverflowX : 0;

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
        text={textRef?.current ?? ""}
        color={color}
        pivot={{
          x: textCursorOverflowX,
        }}
        position={{
          x: padding?.left ?? 0,
          y: padding?.top ?? 0,
        }}
        mask={
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={width}
            height={height}
            position={{
              x: textCursorOverflowX,
            }}
          />
        }
      />
      {/* cursor */}
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={1}
        height={9}
        tint={color}
        pivot={{ x: -padding?.left + 1, y: -padding?.top + 2 }}
        position={{
          x:
            cursorTextRef?.current?.getSize?.()?.width +
            1 -
            textCursorOverflowX,
        }}
        eventMode={EventMode.NONE}
        visible={cursorVisibleRef.current}
      />
      <SpriteTextComponent
        ref={cursorTextRef}
        spriteSheet={spriteSheet}
        text={textRef.current.slice(0, cursorIndexRef.current)}
        alpha={0}
        position={{
          x: padding?.left ?? 0,
          y: padding?.top ?? 0,
        }}
      />
    </ContainerComponent>
  );
};
