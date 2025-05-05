import { ContainerComponent, GraphicsComponent } from "../../core";
import type { ContainerProps, ContainerRef } from "../../core";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FC } from "react";
import { Cursor, Event, EventMode, GraphicType } from "../../../enums";
import {
  DragContainerProvider,
  useCursor,
  useDragContainer,
  useEvents,
  useWindow,
} from "../../../hooks";
import type { Point, Size } from "../../../types";

export type DragContainerComponentProps = {
  size?: Size;
  minZIndex?: number;
  maxZIndex?: number;
} & ContainerProps;

export const DragContainerComponent: FC<DragContainerComponentProps> = (
  props,
) => {
  return (
    <DragContainerProvider>
      <DragContainerComponentWrapper {...props} />
    </DragContainerProvider>
  );
};

const DragContainerComponentWrapper: FC<DragContainerComponentProps> = ({
  ref,
  children,
  position = { x: 0, y: 0 },
  size,
  minZIndex = 0,
  maxZIndex = Number.MAX_SAFE_INTEGER,
  ...containerProps
}) => {
  const { dragPolygon } = useDragContainer();
  const { on } = useEvents();
  const { getPosition: getCursorPosition, setCursor } = useCursor();
  const { getScale, getSize } = useWindow();

  const containerRef = useRef<ContainerRef>(null);
  const pointerDownRef = useRef<boolean>(false);
  const pointerEnterRef = useRef<boolean>(false);

  const $firstPosition = useRef<Point>(null);
  const $firstCursorPosition = useRef<Point>(null);

  const [$position, $setPosition] = useState<Point>({
    x: position.x ?? 0,
    y: position.y ?? 0,
  });

  useImperativeHandle(ref, () => containerRef.current, [ref]);

  useEffect(() => {
    $setPosition(($position) => ({
      x: position.x ?? $position.x ?? 0,
      y: position.y ?? $position.y ?? 0,
    }));
  }, [position.x, position.y, $setPosition]);

  const onPointerEnter = useCallback(() => {
    pointerEnterRef.current = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    pointerEnterRef.current = false;
  }, []);

  const onPointerDown = useCallback(() => {
    pointerDownRef.current = true;
    containerRef.current.component.zIndex = maxZIndex;

    $firstPosition.current = { ...containerRef.current.position };
    $firstCursorPosition.current = getCursorPosition();
    setCursor(Cursor.GRABBING);
  }, [getCursorPosition, getScale, maxZIndex]);

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      if (!pointerDownRef.current) return;

      pointerDownRef.current = false;
      containerRef.current.component.zIndex = minZIndex;

      setCursor(pointerEnterRef.current ? Cursor.GRAB : Cursor.DEFAULT);
    },
    [setCursor, minZIndex],
  );

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
        if (0 > $position.x) $position.x = 0;
      }
      if ($position.y + contentSize.height > maxSize.height) {
        $position.y = maxSize.height - contentSize.height;

        if (0 > $position.y) $position.y = 0;
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
  }, [on, onCursorMove, onPointerUp, size]);

  return useMemo(
    () => (
      <ContainerComponent
        ref={containerRef}
        sortableChildren
        position={$position}
        {...containerProps}
      >
        <GraphicsComponent
          type={GraphicType.POLYGON}
          polygon={dragPolygon}
          cursor={Cursor.GRAB}
          eventMode={EventMode.STATIC}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          zIndex={10}
          tint={0x00ff00}
          alpha={0}
        />
        {children}
      </ContainerComponent>
    ),
    [
      $position,
      containerProps,
      dragPolygon,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
    ],
  );
};
