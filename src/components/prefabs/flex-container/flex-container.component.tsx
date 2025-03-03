import React, { useCallback, useEffect, useRef } from "react";
import { ContainerComponent, ContainerProps, ContainerRef } from "../../core";
import { useEvents, useWindow } from "../../../hooks";
import { Event, FLEX_ALIGN, FLEX_JUSTIFY } from "../../../enums";
import { Size } from "../../../types";

type FlexContainerProps = {
  align?: FLEX_ALIGN;
  justify?: FLEX_JUSTIFY;
  size?: Size;
  direction?: "x" | "y";
} & ContainerProps;

export const FlexContainerComponent: React.FC<FlexContainerProps> = ({
  children,
  size,
  align = FLEX_ALIGN.TOP,
  justify = FLEX_JUSTIFY.START,
  direction = "x",
  onChildLoaded,
  ...containerProps
}) => {
  const { on } = useEvents();
  const { getSize } = useWindow();
  const containerRef = useRef<ContainerRef>(null);

  const rePosition = useCallback(() => {
    const sizeName = direction === "x" ? "width" : "height";
    const reverseDirection = direction === "x" ? "y" : "x";
    const reverseSizeName = direction === "x" ? "height" : "width";

    const $size = size ?? getSize();

    const childList = containerRef.current?.getChildren();

    const positionForChildren = $size[sizeName] / childList.length;

    const totalItemSize = childList.reduce(
      (total, child) => total + child.getSize()[sizeName],
      0,
    );
    const totalEmptySize = $size[sizeName] - totalItemSize;
    let lastItemPosition = 0;

    for (let childIndex = 0; childIndex < childList.length; childIndex++) {
      let child = childList[childIndex];

      if (justify === FLEX_JUSTIFY.END)
        child = childList.toReversed()[childIndex];

      const itemSizeH = child.getSize()[reverseSizeName];
      const itemSizeW = child.getSize()[sizeName];

      switch (justify) {
        case FLEX_JUSTIFY.START:
          child.position[direction] = lastItemPosition;
          lastItemPosition = lastItemPosition + itemSizeW;
          break;
        case FLEX_JUSTIFY.END:
          child.position[direction] =
            $size[sizeName] - itemSizeW - lastItemPosition;
          lastItemPosition += itemSizeW;
          break;
        case FLEX_JUSTIFY.CENTER:
          child.position[direction] = lastItemPosition + totalEmptySize / 2;
          lastItemPosition += itemSizeW;
          break;
        case FLEX_JUSTIFY.SPACE_EVENLY:
          child.position[direction] =
            positionForChildren / 2 +
            positionForChildren * childIndex -
            itemSizeW / 2;

          break;
      }

      switch (align) {
        case FLEX_ALIGN.BOTTOM:
          child.position[reverseDirection] = $size[reverseSizeName] - itemSizeH;
          break;
        case FLEX_ALIGN.CENTER:
          child.position[reverseDirection] =
            $size[reverseSizeName] / 2 - itemSizeH / 2;
          break;
      }
    }
  }, [children, getSize, size, justify, align, direction]);

  const onResize = useCallback(() => {
    rePosition();
  }, [rePosition]);

  const $onChildLoaded = useCallback(
    (props) => {
      rePosition();
      onChildLoaded?.(props);
    },
    [onChildLoaded],
  );

  useEffect(() => {
    const removeOnResize = on(Event.RESIZE, onResize);

    rePosition();
    return () => {
      removeOnResize();
    };
  }, [on, onResize, rePosition]);

  return (
    <ContainerComponent
      ref={containerRef}
      onChildLoaded={$onChildLoaded}
      {...containerProps}
    >
      {children}
    </ContainerComponent>
  );
};
