import { useCallback, useEffect, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import { ContainerComponent, GraphicsComponent } from "../../core";
import type { ContainerRef, ContainerProps } from "../../core";
import { useCursorInside, useEvents } from "../../../hooks";
import { Cursor, Event, EventMode, GraphicType } from "../../../enums";
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
    const removeOnPointerDown = on(Event.POINTER_DOWN, onPointerDown);
    const removeOnPointerUp = on(Event.POINTER_UP, onPointerDown);

    setMaxHeight(contentRef.current.getSize().height);

    return () => {
      removeOnPointerDown();
      removeOnPointerUp();
    };
  }, [on, onPointerDown, onPointerUp, setMaxHeight]);

  const onScroll = useCallback(
    (yPosition: number) => {
      setScrollYPosition(yPosition);
    },
    [setScrollYPosition],
  );

  const onChildLoaded = useCallback(() => {
    console.log(contentRef.current.getSize());
  }, [children]);

  return (
    <ContainerComponent {...containerProps} {...cursorInsideProps}>
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={size.width}
        height={size.height}
      />
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
        ref={contentRef}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        mask={
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={size.width}
            height={size.height}
            position={{
              y: scrollYPosition,
            }}
          />
        }
        pivot={{
          y: scrollYPosition,
        }}
        onChildLoaded={onChildLoaded}
        {...cursorInsideContentProps}
      >
        {children}
      </ContainerComponent>
    </ContainerComponent>
  );
};
