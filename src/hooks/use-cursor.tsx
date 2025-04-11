import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import type { ReactNode, FC } from "react";
import { useWindow } from "./use-window";
import { useEvents } from "./use-events";
import { Cursor, Event } from "../enums";
import type { Point } from "../types";
import { useApplication } from "./use-application";

type CursorState = {
  getPosition: () => Point;

  setCursor: (cursor: Cursor) => void;
};

const CursorContext = createContext<CursorState>(undefined);

type CursorProps = {
  children: ReactNode;
};

export const CursorProvider: FC<CursorProps> = ({ children }) => {
  const { application } = useApplication();
  const { normalizeValue } = useWindow();
  const { on, emit } = useEvents();

  const position = useRef<Point>({ x: 0, y: 0 });

  const onPointerMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      let targetX = 0;
      let targetY = 0;

      if (event instanceof MouseEvent) {
        targetX = event.clientX;
        targetY = event.clientY;
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
      }

      const $position = {
        x: normalizeValue(targetX),
        y: normalizeValue(targetY),
      };

      if (position.current.x === targetX && position.current.y === targetY)
        return;

      position.current = $position;
      emit(Event.CURSOR_MOVE, $position);
    },
    [normalizeValue, on, emit],
  );
  const onPointerDown = useCallback(() => {
    emit(Event.CURSOR_DOWN, position.current);
  }, [emit]);

  const setCursor = useCallback(
    (cursor: Cursor) => {
      application.canvas.style.cursor = cursor;
    },
    [application],
  );

  const getPosition = useCallback(() => position.current, []);

  useEffect(() => {
    const onRemovePointerMove = on<MouseEvent | TouchEvent>(
      Event.POINTER_MOVE,
      onPointerMove,
    );
    const onRemovePointerDown = on<MouseEvent | TouchEvent>(
      Event.POINTER_DOWN,
      onPointerDown,
    );

    return () => {
      onRemovePointerMove();
      onRemovePointerDown();
    };
  }, [onPointerMove, onPointerDown]);

  return (
    <CursorContext.Provider
      value={{
        getPosition,
        setCursor,
      }}
      children={children}
    />
  );
};

export const useCursor = (): CursorState => useContext(CursorContext);
