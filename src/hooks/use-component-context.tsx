import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePointerOutside, useContext } from ".";
import type { ContainerRef } from "../components";

type Props = {
  containerRef: RefObject<ContainerRef>;
  onFocus: () => void;
  onBlur: () => void;
  focusNow?: number;
  blurNow?: number;
};

export const useComponentContext = ({
  containerRef,
  onFocus,
  onBlur,
  focusNow,
  blurNow,
}: Props) => {
  const { add: addContext } = useContext();

  const focusRef = useRef<Function>(null);
  const blurRef = useRef<Function>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const { remove, focus, blur } = addContext(
      containerRef.current,
      onFocus,
      onBlur,
    );

    focusRef.current = focus;
    blurRef.current = blur;

    if (focusNow) focus();
    if (blurNow) blur();

    return () => remove();
  }, [addContext, onFocus, onBlur, focusNow, blurNow]);

  const focus = useCallback(() => focusRef.current?.(), []);
  const blur = useCallback(() => blurRef.current?.(), []);

  const { eventMode, onPointerEnter, onPointerLeave } = usePointerOutside(() =>
    blur(),
  );

  useEffect(() => {
    if (!focusNow) return;
    focus();
  }, [focus, focusNow]);

  useEffect(() => {
    if (!blurNow) return;
    blur();
  }, [blur, blurNow]);

  return {
    eventMode,
    onPointerDown: focus,
    onPointerEnter,
    onPointerLeave,

    focus,
    blur,
  };
};
