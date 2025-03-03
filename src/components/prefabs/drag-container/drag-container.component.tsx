import {
  ContainerComponent,
  ContainerProps,
  ContainerRef,
  GraphicsComponent,
} from "../../core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cursor, Event, EventMode, GraphicType } from "../../../enums";
import { useCursor, useEvents, useWindow } from "../../../hooks";
import { Point, Size } from "../../../types";

export type DragContainerComponentProps = {
  dragPolygon: number[];
  size?: Size;
} & ContainerProps;

export const DragContainerComponent: React.FC<DragContainerComponentProps> = ({
  dragPolygon = [],
  children,
  position = { x: 0, y: 0 },
  size,
}) => {
  const { on } = useEvents();
  const { getPosition: getCursorPosition } = useCursor();
  const { getScale, getSize } = useWindow();

  const containerRef = useRef<ContainerRef>(null);
  const pointerDownRef = useRef<boolean>(false);

  const $firstPosition = useRef<Point>(null);
  const $firstCursorPosition = useRef<Point>(null);

  const [$position, $setPosition] = useState<Point>({
    x: position.x ?? 0,
    y: position.y ?? 0,
  });

  const onPointerDown = useCallback(() => {
    pointerDownRef.current = true;

    $firstPosition.current = { ...containerRef.current.position };
    $firstCursorPosition.current = getCursorPosition();
  }, [getCursorPosition, getScale]);
  const onPointerUp = useCallback((event: PointerEvent) => {
    pointerDownRef.current = false;
  }, []);
  const onCursorMove = useCallback(
    (cursorPosition: Point) => {
      if (!pointerDownRef.current) return;

      const firstPosition = $firstPosition.current;
      const firstCursorPosition = $firstCursorPosition.current;

      const position = {
        x: firstPosition.x + cursorPosition.x - firstCursorPosition.x,
        y: firstPosition.y + cursorPosition.y - firstCursorPosition.y,
      };
      if (0 > position.x) {
        position.x = 0;
        $firstCursorPosition.current.x += position.x;
      }
      if (0 > position.y) {
        position.y = 0;
        $firstCursorPosition.current.y += position.y;
      }

      const contentSize = containerRef.current.getSize();
      const maxSize = size ?? getSize();

      if (position.x + contentSize.width > maxSize.width) {
        firstCursorPosition.x += position.x + contentSize.width - maxSize.width;
        position.x = maxSize.width - contentSize.width;
      }
      if (position.y + contentSize.height > maxSize.height) {
        firstCursorPosition.y +=
          position.y + contentSize.height - maxSize.height;
        position.y = maxSize.height - contentSize.height;
      }

      $setPosition(position);
    },
    [getCursorPosition, $setPosition, size, getSize],
  );

  const onResize = useCallback((maxSize: Size) => {
    const contentSize = containerRef.current.getSize();

    $setPosition((position) => {
      const $position = { ...position };
      if ($position.x + contentSize.width > maxSize.width) {
        $position.x = maxSize.width - contentSize.width;
      }
      if ($position.y + contentSize.height > maxSize.height) {
        $position.y = maxSize.height - contentSize.height;
      }

      return $position;
    });
  }, []);

  useEffect(() => {
    const onRemoveCursorMove = on(Event.CURSOR_MOVE, onCursorMove);
    const onRemovePointerUp = on(Event.POINTER_UP, onPointerUp);
    const onRemoveResize = size ? null : on(Event.RESIZE, onResize);

    return () => {
      onRemoveCursorMove();
      onRemovePointerUp();
      onRemoveResize?.();
    };
  }, [on, onCursorMove, onPointerUp]);

  return (
    <ContainerComponent
      ref={containerRef}
      sortableChildren={true}
      position={$position}
    >
      <GraphicsComponent
        type={GraphicType.POLYGON}
        polygon={dragPolygon}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        onPointerDown={onPointerDown}
        zIndex={10}
        alpha={0}
      />
      {children}
    </ContainerComponent>
  );
};
