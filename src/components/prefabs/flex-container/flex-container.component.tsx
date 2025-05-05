import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type { FC } from "react";
import { ContainerComponent } from "../../core";
import type { ContainerProps, ContainerRef } from "../../core";
import { useWindow } from "../../../hooks";
import { FLEX_ALIGN, FLEX_JUSTIFY } from "../../../enums";
import type { Size } from "../../../types";

type FlexContainerProps = {
  align?: FLEX_ALIGN;
  justify?: FLEX_JUSTIFY;
  size?: Partial<Size>;
  direction?: "x" | "y";
  gap?: number;
  test?: boolean;
} & ContainerProps;

export const FlexContainerComponent: FC<FlexContainerProps> = ({
  ref,
  children,
  size,
  align = FLEX_ALIGN.TOP,
  justify = FLEX_JUSTIFY.START,
  direction = "x",
  onChildLoaded,
  gap = 0,
  test,
  ...containerProps
}) => {
  // const { on } = useEvents();
  const { getSize } = useWindow();
  const containerRef = useRef<ContainerRef>(null);

  useImperativeHandle(ref, () => containerRef.current, [ref]);

  const rePosition = useCallback(() => {
    const sizeName = direction === "x" ? "width" : "height";
    const reverseDirection = direction === "x" ? "y" : "x";
    const reverseSizeName = direction === "x" ? "height" : "width";

    const windowSize = getSize();

    const $size = {
      width: size?.width ?? windowSize.width,
      height: size?.height ?? windowSize.height,
    };

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
          child.position[direction] = Math.round(lastItemPosition);
          lastItemPosition = lastItemPosition + itemSizeW + gap;
          break;
        case FLEX_JUSTIFY.END:
          child.position[direction] = Math.round(
            $size[sizeName] - itemSizeW - lastItemPosition,
          );
          lastItemPosition += itemSizeW + gap;
          break;
        case FLEX_JUSTIFY.CENTER:
          child.position[direction] = Math.round(
            lastItemPosition + totalEmptySize / 2 - gap,
          );
          lastItemPosition += itemSizeW + gap;
          break;
        case FLEX_JUSTIFY.SPACE_EVENLY:
          child.position[direction] = Math.round(
            positionForChildren / 2 +
              positionForChildren * childIndex -
              itemSizeW / 2,
          );
          break;
        case FLEX_JUSTIFY.SPACE_BETWEEN:
          const spaceBetween = totalEmptySize / (childList.length - 1);
          child.position[direction] = Math.round(lastItemPosition);
          lastItemPosition += itemSizeW + spaceBetween;
          break;
      }

      switch (align) {
        case FLEX_ALIGN.BOTTOM:
          child.position[reverseDirection] = Math.round(
            $size[reverseSizeName] - itemSizeH,
          );
          break;
        case FLEX_ALIGN.CENTER:
          child.position[reverseDirection] = Math.round(
            $size[reverseSizeName] / 2 - itemSizeH / 2,
          );
          break;
      }
    }
  }, [getSize, size, justify, align, direction, gap, children]);

  const $onChildLoaded = useCallback(
    (props) => {
      rePosition();
      onChildLoaded?.(props);
      containerRef.current.component.parent.emit("child-loaded", null);
    },
    [onChildLoaded, rePosition, containerRef],
  );

  useEffect(() => {
    rePosition();
  }, [rePosition]);

  return useMemo(
    () => (
      <ContainerComponent
        ref={containerRef}
        onChildLoaded={$onChildLoaded}
        {...containerProps}
      >
        {children}
      </ContainerComponent>
    ),
    [containerProps, $onChildLoaded, children],
  );
};
