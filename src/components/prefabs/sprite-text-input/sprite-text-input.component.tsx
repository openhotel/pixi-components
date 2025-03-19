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
import { Cursor, Event, EventMode, GraphicType, OS } from "../../../enums";
import {
  useComponentContext,
  useEvents,
  useInput,
  useText,
  useUpdate,
} from "../../../hooks";
import { combineAccentAndChar, getAccentCode, getOS } from "../../../utils";

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

  clearOnEnter?: boolean;

  onValueChange?: (value: string) => void;
  onEnter?: (value: string) => void;
} & Omit<
  SpriteTextProps,
  "text" | "wrap" | "color" | "backgroundAlpha" | "backgroundColor"
>;

export const SpriteTextInputComponent: React.FC<SpriteTextInputProps> = ({
  //sprite-text
  spriteSheet,
  color = 0,
  horizontalAlign,
  alpha,
  // input
  backgroundColor,
  width,
  height,
  defaultValue,
  padding,
  maxLength,
  placeholder,
  placeholderProps,
  clearOnEnter = false,
  //
  onValueChange,
  onEnter,
  // display
  label = "sprite-text-input",
  // container
  ...containerProps
}) => {
  const { on } = useEvents();
  const { update } = useUpdate();
  const { focus: focusInput, blur: blurInput } = useInput();
  //input
  const containerRef = useRef<ContainerRef>(null);
  const isFocusedRef = useRef<boolean>(false);
  const textRef = useRef<string>(defaultValue ?? "");

  //cursor
  const currentAccentCodeRef = useRef<string>(null);
  const cursorBlinkIntervalRef = useRef<number>(null);
  const cursorIndexRef = useRef<number>(textRef?.current?.length);
  const cursorVisibleRef = useRef<boolean>(false);

  const { getTextLength } = useText(spriteSheet);

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

      if (textRef?.current?.length + 1 >= maxLength) return;

      textRef.current =
        textRef.current.slice(0, cursorIndexRef.current) +
        key +
        textRef.current.slice(cursorIndexRef.current);
      onValueChange?.(textRef.current);

      cursorIndexRef.current++;
    },
    [update, onValueChange, maxLength],
  );

  const makeActions = useCallback(
    (key: string, specialKey: boolean) => {
      if (!textRef.current?.length) return;

      const textArrayFromStart = specialKey
        ? textRef.current
            .substring(0, cursorIndexRef.current)
            .split("")
            .toReversed()
        : [];
      const textArrayFromEnd = specialKey
        ? textRef.current.substring(cursorIndexRef.current).split("")
        : [];

      if (key === "Enter") {
        onEnter?.(textRef.current);
        if (clearOnEnter) textRef.current = "";
        update();
        return;
      }

      if (
        key === "Backspace" &&
        cursorIndexRef.current > 0 &&
        textRef.current?.length > 0
      ) {
        if (specialKey) {
          let sliced = 0;
          for (
            let charIndex = 0;
            charIndex < textArrayFromStart.length;
            charIndex++
          ) {
            const char = textArrayFromStart[charIndex];
            if (char === " " && charIndex !== 0) break;
            if (char === " ") {
              sliced++;
              break;
            }
            sliced++;
          }

          textRef.current =
            textRef.current.slice(0, cursorIndexRef.current - sliced) +
            textRef.current.slice(cursorIndexRef.current);
          onValueChange?.(textRef.current);

          cursorIndexRef.current -= sliced;
          return;
        }

        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current - 1) +
          textRef.current.slice(cursorIndexRef.current);
        onValueChange?.(textRef.current);

        cursorIndexRef.current--;
        return;
      }

      if (
        key === "Delete" &&
        cursorIndexRef.current < textRef.current?.length &&
        textRef.current?.length > 0
      ) {
        if (specialKey) {
          let sliced = 0;
          for (
            let charIndex = 0;
            charIndex < textArrayFromEnd.length;
            charIndex++
          ) {
            const char = textArrayFromEnd[charIndex];
            if (char === " " && charIndex !== 0) break;
            if (char === " ") {
              sliced++;
              break;
            }
            sliced++;
          }

          textRef.current =
            textRef.current.slice(0, cursorIndexRef.current) +
            textRef.current.slice(cursorIndexRef.current + sliced);
          onValueChange?.(textRef.current);
          return;
        }

        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current) +
          textRef.current.slice(cursorIndexRef.current + 1);
        onValueChange?.(textRef.current);

        return;
      }

      if (key === "ArrowLeft" && cursorIndexRef.current > 0) {
        if (specialKey) {
          for (
            let charIndex = 0;
            charIndex < textArrayFromStart.length;
            charIndex++
          ) {
            const char = textArrayFromStart[charIndex];
            if (char === " " && charIndex !== 0) break;
            if (char === " ") {
              cursorIndexRef.current--;
              break;
            }
            cursorIndexRef.current--;
          }
          return;
        }
        cursorIndexRef.current--;
        return;
      }

      if (
        key === "ArrowRight" &&
        cursorIndexRef.current < textRef.current?.length
      ) {
        if (specialKey) {
          for (
            let charIndex = 0;
            charIndex < textArrayFromEnd.length;
            charIndex++
          ) {
            const char = textArrayFromEnd[charIndex];
            if (char === " " && charIndex !== 0) break;
            if (char === " ") {
              cursorIndexRef.current++;
              break;
            }
            cursorIndexRef.current++;
          }
        } else {
          cursorIndexRef.current++;
        }
        return;
      }
    },
    [update, onValueChange],
  );

  const onKeyDown = useCallback(
    ({ key, metaKey, ctrlKey, code, shiftKey, altKey }: KeyboardEvent) => {
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

      writeChar(key);
      makeActions(key, getOS() === OS.DARWIN ? altKey : shiftKey);
      startCursorBlink();
    },
    [startCursorBlink, writeChar, makeActions, update, onEnter],
  );

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!isFocusedRef.current) return;

      startCursorBlink();
    },
    [startCursorBlink],
  );

  const onPaste = useCallback(
    (text: string) => {
      textRef.current = (textRef.current + text).substring(0, maxLength);
      cursorIndexRef.current = textRef.current.length;
      update();
    },
    [maxLength, update],
  );

  useEffect(() => {
    const removeOnKeyDown = on<unknown>(Event.KEY_DOWN, onKeyDown);
    const removeOnKeyUp = on<unknown>(Event.KEY_UP, onKeyUp);
    const removeOnPaste = on<unknown>(Event.PASTE, onPaste);

    return () => {
      removeOnKeyDown();
      removeOnKeyUp();
      removeOnPaste();
    };
  }, [on, onKeyDown, onKeyUp, onPaste]);

  const onFocus = useCallback(() => {
    isFocusedRef.current = true;
    startCursorBlink();
    focusInput();
  }, [focusInput]);

  const onBlur = useCallback(() => {
    isFocusedRef.current = false;
    stopCursorBlink();
    blurInput();
  }, [blurInput]);

  const { focus, blur, ...componentContext } = useComponentContext({
    containerRef,
    onBlur,
    onFocus,
  });

  const cursorTextWidth =
    getTextLength(textRef.current?.slice(0, cursorIndexRef.current)) - 1;

  let textCursorOverflowX = cursorTextWidth - width;
  textCursorOverflowX = textCursorOverflowX > 0 ? textCursorOverflowX : 0;

  const mask = (
    <GraphicsComponent
      type={GraphicType.RECTANGLE}
      width={width}
      height={height}
      position={{
        x: textCursorOverflowX,
      }}
    />
  );

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
        text={placeholder}
        position={{
          x: padding?.left ?? 0,
          y: padding?.top ?? 0,
        }}
        mask={mask}
        {...placeholderProps}
        visible={!textRef.current?.length}
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
        mask={mask}
      />
      {/* cursor */}
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={1}
        height={9}
        tint={color}
        pivot={{ x: -(padding?.left ?? 0) + 1, y: -(padding?.top ?? 0) + 2 }}
        position={{
          x:
            cursorIndexRef.current === 0
              ? 0
              : cursorTextWidth + 1 - textCursorOverflowX,
        }}
        eventMode={EventMode.NONE}
        visible={cursorVisibleRef.current}
      />
    </ContainerComponent>
  );
};
