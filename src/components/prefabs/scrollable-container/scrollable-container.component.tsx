import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContainerProps, ContainerRef } from "../../core";
import { ContainerComponent } from "../../core";
import { useCursorInside, useEvents } from "../../../hooks";
import { Cursor, Event } from "../../../enums";
import type { Size } from "../../../types";
import { ScrollComponent } from "./scroll";

type Props = {
  size: Size;
  scrollbar: {
    renderTop: FC;
    renderScrollBackground: FC;
    renderScrollBar: FC;
    renderBottom: FC;
  };
  children: ReactNode;
} & ContainerProps;

export const ScrollableContainerComponent: FC<Props> = ({
  size,
  scrollbar,
  children,
  ...containerProps
}) => {
  const contentRef = useRef<ContainerRef>(null);

  const { isCursorInside, ...cursorInsideProps } = useCursorInside();
  const { isCursorInside: isCursorInsideContent, ...cursorInsideContentProps } =
    useCursorInside();

  const [scrollYPosition, setScrollYPosition] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(size.height);

  const { on } = useEvents();

  const onPointerDown = useCallback(() => {}, []);
  const onPointerUp = useCallback(() => {}, []);

  useEffect(() => {
    //reset scroll every time children is rerendered
    setScrollYPosition(0);
    //assign new height if children is rerendered
    setMaxHeight(contentRef.current.getSize().height);
  }, [setScrollYPosition, setMaxHeight, children]);

  useEffect(() => {
    const removeOnPointerDown = on(Event.POINTER_DOWN, onPointerDown);
    const removeOnPointerUp = on(Event.POINTER_UP, onPointerDown);

    return () => {
      removeOnPointerDown();
      removeOnPointerUp();
    };
  }, [on, onPointerDown, onPointerUp]);

  const onScroll = useCallback(
    (yPosition: number) => {
      setScrollYPosition(yPosition);
    },
    [setScrollYPosition],
  );

  return (
    <ContainerComponent {...containerProps} {...cursorInsideProps}>
      {/*<GraphicsComponent*/}
      {/*  type={GraphicType.RECTANGLE}*/}
      {/*  width={size.width}*/}
      {/*  height={maxHeight}*/}
      {/*  eventMode={EventMode.NONE}*/}
      {/*  alpha={0}*/}
      {/*  tint={0xff00ff}*/}
      {/*/>*/}
      <ScrollComponent
        height={size.height}
        position={{
          x: size.width,
        }}
        maxHeight={maxHeight}
        onScroll={onScroll}
        isCursorInside={isCursorInside}
        scrollYPosition={scrollYPosition}
        {...scrollbar}
      />
      <ContainerComponent
        cursor={Cursor.POINTER}
        sortableChildren
        maskPolygon={[
          0,
          0,
          size.width,
          0,
          size.width,
          size.height,
          0,
          size.height,
        ]}
        pivot={{
          y: scrollYPosition,
        }}
        {...cursorInsideContentProps}
      >
        {children}
      </ContainerComponent>
      {/*Allows the calc of the real height*/}
      <ContainerComponent visible={false} ref={contentRef}>
        {children}
      </ContainerComponent>
    </ContainerComponent>
  );
};
