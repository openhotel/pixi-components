import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContainerComponent,
  ContainerProps,
  ContainerRef,
} from "../../../core";
import { Cursor, Event, EventMode } from "../../../../enums";
import { useEvents } from "../../../../hooks";

type Props = {
  height: number;
  maxHeight: number;

  renderTop: React.FC;
  renderScrollBackground: React.FC;
  renderScrollBar: React.FC;
  renderBottom: React.FC;

  onScroll: (yPosition: number) => void;

  isCursorInside: () => boolean;
} & ContainerProps;

export const ScrollComponent: React.FC<Props> = ({
  height,
  maxHeight,

  renderTop: RenderTop,
  renderScrollBackground: RenderScrollBackground,
  renderScrollBar: RenderScrollBar,
  renderBottom: RenderBottom,

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

  const [scrollYPosition, setScrollYPosition] = useState<number>(0);

  const [goDown, setGoDown] = useState<boolean>(false);
  const [goUp, setGoUp] = useState<boolean>(false);

  const canScroll = useMemo(() => maxHeight > height, [maxHeight, height]);

  const scrollHeight = useMemo(
    () => height - topHeight - bottomHeight,
    [height, topHeight, bottomHeight],
  );

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
    (amount: () => number) => {
      if (!canScroll) return;

      setScrollYPosition((positionY) => {
        let target = Math.round(positionY + amount());

        if (0 >= target) target = 0;
        if (target > scrollHeight - scrollBarHeight)
          target = scrollHeight - scrollBarHeight;

        onScroll(target);
        return target;
      });
    },
    [onScroll, canScroll, scrollBarHeight, scrollHeight, setScrollYPosition],
  );

  const onWheel = useCallback(
    (event: WheelEvent) => {
      if (!isCursorInside()) return;
      scroll(() => event.deltaY);
    },
    [scroll, isCursorInside],
  );

  const lastPointMoveY = useRef<number>(0);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (isPointerDownScrollBarRef.current)
        scroll(() => event.clientY - lastPointMoveY.current);
      lastPointMoveY.current = event.clientY;
    },
    [scroll, scrollYPosition],
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

      scroll(() => (goUp ? -10 : goDown ? 10 : 0));
    }, 20);

    const removeOnWheel = on(Event.WHEEL, onWheel);
    const removeOnPointerMove = on(Event.POINTER_MOVE, onPointerMove);
    const removeOnPointerUp = on(Event.POINTER_UP, onPointerUp);

    return () => {
      clearInterval(interval);
      removeOnWheel();
      removeOnPointerMove();
      removeOnPointerUp();
    };
  }, [goDown, goUp, onPointerMove, scroll]);

  const onPointerDownTop = useCallback(() => {
    if (!canScroll) return;

    setGoUp(true);
    scroll(() => -20);
  }, [canScroll, setGoUp, scroll]);

  const onPointerTopUp = useCallback(() => {
    if (!canScroll) return;

    setGoUp(false);
  }, [canScroll, setGoUp]);

  const onPointerDownBottom = useCallback(() => {
    if (!canScroll) return;

    setGoDown(true);
    scroll(() => 20);
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
            y: scrollYPosition,
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
