import { useCallback, useRef } from "react";
import { EventMode } from "../enums";

export const useCursorInside = () => {
  const cursorInsideRef = useRef<boolean>(false);

  const onPointerEnter = useCallback(() => {
    cursorInsideRef.current = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    cursorInsideRef.current = false;
  }, []);

  const isCursorInside = useCallback(() => cursorInsideRef.current, []);

  return {
    isCursorInside,
    onPointerEnter,
    onPointerLeave,
    eventMode: EventMode.STATIC,
  };
};
