import { useCallback, useEffect, useRef } from "react";
import { useEvents } from "./use-events";
import { Event, EventMode } from "../enums";

export const usePointerOutside = (onPointerOutside: unknown) => {
  const { on } = useEvents();

  const isInsideRef = useRef<boolean>(false);

  const onPointerDown = useCallback(() => {
    //@ts-ignore
    if (!isInsideRef.current) onPointerOutside?.();
  }, [onPointerOutside]);

  useEffect(() => {
    return on(Event.POINTER_DOWN, onPointerDown);
  }, [on]);

  const onPointerEnter = useCallback(() => {
    isInsideRef.current = true;
  }, []);
  const onPointerLeave = useCallback(() => {
    isInsideRef.current = false;
  }, []);

  return {
    onPointerEnter,
    onPointerLeave,
    eventMode: EventMode.STATIC,
  };
};
