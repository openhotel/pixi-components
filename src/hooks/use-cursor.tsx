import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWindow } from "./use-window";
import { useEvents } from "./use-events";
import { Event } from "../enums";
import { Point } from "../types";

type CursorState = {
  position: Point;
};

const CursorContext = React.createContext<CursorState>(undefined);

type CursorProps = {
  children: ReactNode;
};

export const CursorProvider: React.FunctionComponent<CursorProps> = ({
  children,
}) => {
  const { normalizeValue } = useWindow();
  const { on, emit } = useEvents();

  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

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

      setPosition((position) => {
        if (position.x === targetX && position.y === targetY) return position;

        emit(Event.CURSOR_MOVE, $position);
        return $position;
      });
    },
    [normalizeValue, on, emit],
  );

  useEffect(() => {
    const onRemovePointerMove = on<MouseEvent | TouchEvent>(
      Event.POINTER_MOVE,
      onPointerMove,
    );

    return () => {
      onRemovePointerMove();
    };
  }, [onPointerMove]);

  return (
    <CursorContext.Provider
      value={{
        position,
      }}
      children={children}
    />
  );
};

export const useCursor = (): CursorState => useContext(CursorContext);
