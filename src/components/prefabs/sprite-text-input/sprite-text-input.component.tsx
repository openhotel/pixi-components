import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type { FC } from "react";
import { SpriteTextComponent } from "../sprite-text";
import type { SpriteTextProps, TextProps } from "../sprite-text";
import { ContainerComponent, GraphicsComponent } from "../../core";
import type { ContainerRef } from "../../core";
import { Cursor, Event, EventMode, GraphicType, OS } from "../../../enums";
import {
  useComponentContext,
  useEvents,
  useInput,
  useText,
  useUpdate,
} from "../../../hooks";
import { combineAccentAndChar, getAccentCode, getOS } from "../../../utils";

export type KeyboardEventExtended = KeyboardEvent & {
  target: {
    value: string;
  };
};

export type SpriteTextInputProps = {
  color?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;

  width: number;
  height: number;

  passwordChar?: string;
  placeholder?: string;
  placeholderProps?: TextProps;
  maxLength?: number;

  clearOnEnter?: boolean;

  defaultValue?: string;
  value: string;
  onChange?: (event: KeyboardEventExtended) => void;

  focusNow?: number;
  blurNow?: number;

  onFocus?: () => void;
  onBlur?: () => void;
} & Omit<
  SpriteTextProps,
  "text" | "wrap" | "color" | "backgroundAlpha" | "backgroundColor"
>;

export const SpriteTextInputComponent: FC<SpriteTextInputProps> = ({
  ref,
  //sprite-text
  spriteSheet,
  color = 0,
  horizontalAlign,
  alpha,
  // input
  backgroundColor,
  backgroundAlpha,
  width,
  height,
  padding,
  maxLength,
  placeholder,
  placeholderProps,
  clearOnEnter = false,
  //
  onChange,

  defaultValue,
  value,

  focusNow,
  blurNow,
  onFocus,
  onBlur,
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
  const textRef = useRef<string>(defaultValue ?? value ?? "");

  //cursor
  const currentAccentCodeRef = useRef<string>(null);
  const cursorBlinkIntervalRef = useRef<number>(null);
  const cursorIndexRef = useRef<number>(textRef?.current?.length);
  const cursorVisibleRef = useRef<boolean>(false);

  const { getTextLength, isCharValid } = useText(spriteSheet);

  useImperativeHandle(ref, () => containerRef.current, [ref]);

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
    (key: string, event: KeyboardEvent) => {
      if (key.length !== 1 || !isCharValid(key)) return;

      if (textRef?.current?.length + 1 >= maxLength) return;

      textRef.current =
        textRef.current.slice(0, cursorIndexRef.current) +
        key +
        textRef.current.slice(cursorIndexRef.current);

      cursorIndexRef.current++;
    },
    [update, maxLength, isCharValid],
  );

  const reset = useCallback(() => {
    textRef.current = "";
    cursorIndexRef.current = 0;
  }, []);

  const makeActions = useCallback(
    (key: string, specialKey: boolean, event: KeyboardEvent) => {
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

          cursorIndexRef.current -= sliced;
          return;
        }

        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current - 1) +
          textRef.current.slice(cursorIndexRef.current);

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
          return;
        }

        textRef.current =
          textRef.current.slice(0, cursorIndexRef.current) +
          textRef.current.slice(cursorIndexRef.current + 1);

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
    [update, reset],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      let { key, metaKey, ctrlKey, code, shiftKey, altKey } = event;
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

      writeChar(key, event);
      makeActions(key, getOS() === OS.DARWIN ? altKey : shiftKey, event);
      startCursorBlink();

      //@ts-ignore
      event.target.value = textRef.current;
      onChange?.(event as KeyboardEventExtended);
    },
    [startCursorBlink, writeChar, makeActions, update, onChange],
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

  useEffect(() => {
    textRef.current = value ?? textRef.current ?? "";
    cursorIndexRef.current = textRef.current.length;
    update();
  }, [value, update]);

  const $onFocus = useCallback(() => {
    isFocusedRef.current = true;
    startCursorBlink();
    focusInput();
    onFocus?.();
  }, [focusInput, onFocus]);

  const $onBlur = useCallback(() => {
    isFocusedRef.current = false;
    stopCursorBlink();
    blurInput();
    onBlur?.();
  }, [blurInput, onBlur]);

  const { focus, blur, ...componentContext } = useComponentContext({
    containerRef,
    onBlur: $onBlur,
    onFocus: $onFocus,
    focusNow,
    blurNow,
  });

  const cursorTextWidth =
    getTextLength(textRef.current?.slice(0, cursorIndexRef.current)) - 1;

  let textCursorOverflowX = cursorTextWidth - width;
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
        alpha={backgroundAlpha}
        tint={backgroundColor}
      />
      <SpriteTextComponent
        spriteSheet={spriteSheet}
        text={placeholder}
        position={{
          x: padding?.left ?? 0,
          y: padding?.top ?? 0,
        }}
        maskPolygon={[0, 0, width, 0, width, height, 0, height]}
        maskPosition={{
          x: textCursorOverflowX,
        }}
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
