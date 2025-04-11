import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FC } from "react";
import { ContainerComponent } from "../../../core";
import type { ContainerProps, ContainerRef } from "../../../core";
import { Cursor, Event, EventMode } from "../../../../enums";
import { useEvents } from "../../../../hooks";
import type { Point } from "../../../../types";

type Props = {
  height: number;
  maxHeight: number;

  renderTop: FC;
  renderScrollBackground: FC;
  renderScrollBar: FC;
  renderBottom: FC;

  scrollYPosition: number;
  onScroll: (yPosition: number) => void;

  isCursorInside: () => boolean;
} & ContainerProps;

export const ScrollComponent: FC<Props> = ({
  height,
  maxHeight,

  renderTop: RenderTop,
  renderScrollBackground: RenderScrollBackground,
  renderScrollBar: RenderScrollBar,
  renderBottom: RenderBottom,

  scrollYPosition,
  onScroll,

  isCursorInside,

  ...containerProps
}) => {
  const { on } = useEvents();

  const isPointerDownScrollBarRef = useRef<boolean>(false);

  const renderTopRef = useRef<ContainerRef>(null);
  const renderBottomRef = useRef<ContainerRef>(null);
  const renderScrollBarRef = useRef<ContainerRef>(null);

  const [topHeight, setTopHeight] = useState<number>(0);
  const [bottomHeight, setBottomHeight] = useState<number>(0);
  const [scrollBarHeight, setScrollBarHeight] = useState<number>(0);

  const [goDown, setGoDown] = useState<boolean>(false);
  const [goUp, setGoUp] = useState<boolean>(false);

  const canScroll = useMemo(() => maxHeight > height, [maxHeight, height]);

  const scrollHeight = useMemo(
    () => height - topHeight - bottomHeight,
    [height, topHeight, bottomHeight],
  );

  const thumbY = useMemo(() => {
    const contentScrollableHeight = maxHeight - height;
    const thumbTrackHeight = scrollHeight - scrollBarHeight;

    if (contentScrollableHeight <= 0 || thumbTrackHeight <= 0) return 0;

    return (scrollYPosition / contentScrollableHeight) * thumbTrackHeight;
  }, [scrollYPosition, maxHeight, height, scrollHeight, scrollBarHeight]);

  useEffect(() => {
    const { height } = renderTopRef.current.getSize();
    setTopHeight(height);
    setBottomHeight(renderBottomRef.current.getSize().height);
    if (renderScrollBarRef.current)
      setScrollBarHeight(renderScrollBarRef.current.getSize().height);
  }, [
    setTopHeight,
    setBottomHeight,
    setScrollBarHeight,
    RenderTop,
    RenderBottom,
    RenderScrollBar,
  ]);

  const scroll = useCallback(
    (amount: number) => {
      if (!canScroll) return;

      let target = Math.round(scrollYPosition + amount);

      const maxScroll = maxHeight - height;
      target = Math.max(0, Math.min(target, maxScroll));

      onScroll(target);
    },
    [onScroll, canScroll, scrollBarHeight, scrollHeight, scrollYPosition],
  );

  const onWheel = useCallback(
    (event: WheelEvent) => {
      if (!isCursorInside()) return;
      scroll(event.deltaY);
    },
    [scroll, isCursorInside],
  );

  const lastPointMoveY = useRef<number>(0);

  const onCursorMove = useCallback(
    (position: Point) => {
      if (!isPointerDownScrollBarRef.current) {
        lastPointMoveY.current = position.y; // Fixes scrolling from other source than scroll bar and the "offset" being off
        return;
      }

      const deltaY = position.y - lastPointMoveY.current;
      lastPointMoveY.current = position.y;

      const contentScrollableHeight = maxHeight - height;
      const thumbTrackHeight = scrollHeight - scrollBarHeight;

      if (thumbTrackHeight <= 0 || contentScrollableHeight <= 0) return;

      const scrollAmount =
        (deltaY / thumbTrackHeight) * contentScrollableHeight;

      scroll(scrollAmount);
    },
    [scroll, maxHeight, height, scrollHeight, scrollBarHeight],
  );

  const onPointerUp = useCallback(() => {
    isPointerDownScrollBarRef.current = false;
  }, []);

  const onPointerDownScrollBar = useCallback(() => {
    isPointerDownScrollBarRef.current = true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!goDown && !goUp) return;

      scroll(goUp ? -10 : goDown ? 10 : 0);
    }, 20);

    const removeOnWheel = on(Event.WHEEL, onWheel);
    const removeOnCursorMove = on(Event.CURSOR_MOVE, onCursorMove);
    const removeOnPointerUp = on(Event.POINTER_UP, onPointerUp);

    return () => {
      clearInterval(interval);
      removeOnWheel();
      removeOnCursorMove();
      removeOnPointerUp();
    };
  }, [goDown, goUp, onCursorMove, scroll]);

  const onPointerDownTop = useCallback(() => {
    if (!canScroll) return;

    setGoUp(true);
    scroll(-20);
  }, [canScroll, setGoUp, scroll]);

  const onPointerTopUp = useCallback(() => {
    if (!canScroll) return;

    setGoUp(false);
  }, [canScroll, setGoUp]);

  const onPointerDownBottom = useCallback(() => {
    if (!canScroll) return;

    setGoDown(true);
    scroll(20);
  }, [canScroll, setGoDown, scroll]);

  const onPointerBottomUp = useCallback(() => {
    if (!canScroll) return;

    setGoDown(false);
  }, [canScroll, setGoDown]);

  return (
    <ContainerComponent {...containerProps}>
      <ContainerComponent
        ref={renderTopRef}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onPointerDownTop}
        onPointerUp={onPointerTopUp}
      >
        <RenderTop />
      </ContainerComponent>
      <ContainerComponent
        position={{
          y: topHeight,
        }}
        sortableChildren
      >
        <ContainerComponent
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
        >
          <RenderScrollBackground />
        </ContainerComponent>
        <ContainerComponent
          ref={renderScrollBarRef}
          eventMode={EventMode.STATIC}
          cursor={Cursor.GRAB}
          visible={canScroll}
          position={{
            y: thumbY,
          }}
          onPointerDown={onPointerDownScrollBar}
          zIndex={10}
        >
          <RenderScrollBar />
        </ContainerComponent>
      </ContainerComponent>
      <ContainerComponent
        ref={renderBottomRef}
        position={{
          y: height - topHeight,
        }}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onPointerDownBottom}
        onPointerUp={onPointerBottomUp}
      >
        <RenderBottom />
      </ContainerComponent>
    </ContainerComponent>
  );
};
