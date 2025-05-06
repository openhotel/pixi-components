import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
    setMaxHeight((maxHeight) => {
      const targetMaxHeight = contentRef.current.getSize().height;

      if (targetMaxHeight === maxHeight) return maxHeight;

      setScrollYPosition((scrollYPosition) =>
        //assign the new max height if scroll is exceeding the new max
        scrollYPosition > targetMaxHeight && maxHeight > targetMaxHeight
          ? targetMaxHeight
          : scrollYPosition,
      );
      return targetMaxHeight;
    });
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

  /*Allows the calc of the real height*/
  const renderMaxContent = useMemo(
    () => (
      <ContainerComponent
        visible={false}
        ref={contentRef}
        // onChildLoaded={onChildLoaded}
      >
        {children}
      </ContainerComponent>
    ),
    [children],
  );

  const renderContent = useMemo(
    () => (
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
      </ContainerComponent>
    ),
    [
      containerProps,
      cursorInsideProps,
      size,
      maxHeight,
      onScroll,
      isCursorInside,
      scrollYPosition,
      scrollbar,
      cursorInsideContentProps,
      children,
    ],
  );

  return useMemo(
    () => (
      <>
        {renderMaxContent}
        {renderContent}
      </>
    ),
    [renderMaxContent, renderContent],
  );
};
