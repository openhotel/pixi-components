import { useCallback, useEffect, useRef } from "react";
import { usePointerOutside, useContext } from ".";

export const useComponentContext = ({ containerRef, onFocus, onBlur }) => {
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
    return () => remove();
  }, [addContext, onFocus, onBlur]);

  const focus = useCallback(() => focusRef.current?.(), []);
  const blur = useCallback(() => blurRef.current?.(), []);

  const { eventMode, onPointerEnter, onPointerLeave } = usePointerOutside(() =>
    blur(),
  );

  return {
    eventMode,
    onPointerDown: focus,
    onPointerEnter,
    onPointerLeave,

    focus,
    blur,
  };
};
