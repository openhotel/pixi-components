import React, { useCallback, useMemo, useRef, useState } from "react";
import { HorizontalAlign, VerticalAlign } from "../../../enums";
import { ContainerComponent, ContainerProps, ContainerRef } from "../../core";
import { Bounds, Size } from "../../../types";
import { useWindow } from "../../../hooks";

export type AlignContainerProps = {
  verticalAlign?: VerticalAlign;
  horizontalAlign?: HorizontalAlign;
  size?: Size;
} & ContainerProps;

export const AlignContainerComponent: React.FC<AlignContainerProps> = ({
  verticalAlign = VerticalAlign.TOP,
  horizontalAlign = HorizontalAlign.LEFT,
  size,
  children,
  label = "align-container",
  ...props
}) => {
  const { getSize } = useWindow();
  const container = useRef<ContainerRef>(null);

  const [$bounds, $setBounds] = useState<Bounds>({
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });
  const [$size, $setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const onChildLoaded = useCallback(() => {
    if (!container.current) return;
    $setBounds(container.current.getBounds());
    $setSize(container.current.getSize());
  }, [$setSize, $setBounds]);

  const pivot = useMemo(() => {
    let x = 0;
    let y = 0;

    const windowSize = getSize();

    const $boxSize = {
      width: size?.width ?? windowSize.width,
      height: size?.height ?? windowSize.height,
    };

    switch (verticalAlign) {
      case VerticalAlign.MIDDLE:
        y = $boxSize.height / 2 - $size.height / 2;
        break;
      case VerticalAlign.BOTTOM:
        y = $boxSize.height - $size.height;
        break;
    }
    switch (horizontalAlign) {
      case HorizontalAlign.CENTER:
        x = $boxSize.width / 2 - $size.width / 2;
        break;
      case HorizontalAlign.RIGHT:
        x = $boxSize.width - $size.width;
        break;
    }
    return {
      x,
      y,
    };
  }, [getSize, $size, $bounds, size]);

  return (
    <ContainerComponent label={label} {...props}>
      <ContainerComponent
        ref={container}
        onChildLoaded={onChildLoaded}
        position={pivot}
        children={children}
      />
    </ContainerComponent>
  );
};
