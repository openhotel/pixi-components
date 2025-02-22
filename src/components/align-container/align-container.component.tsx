import React, { useCallback, useMemo, useRef, useState } from "react";
import { HorizontalAlign, VerticalAlign } from "../../enums";
import { ContainerComponent, ContainerProps, ContainerRef } from "..";
import { Bounds, Size } from "../../types";
import { useWindow } from "../../hooks";

export type AlignContainerProps = {
  verticalAlign?: VerticalAlign;
  horizontalAlign?: HorizontalAlign;
  width?: number;
  height?: number;
} & ContainerProps;

export const AlignContainerComponent: React.FC<AlignContainerProps> = ({
  verticalAlign = VerticalAlign.TOP,
  horizontalAlign = HorizontalAlign.LEFT,
  width,
  height,
  children,
  ...props
}) => {
  const { size: windowSize } = useWindow();
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

    const $boxSize = {
      width: width ?? windowSize.width,
      height: height ?? windowSize.height,
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
  }, [windowSize, $size, $bounds, width, height]);

  return (
    <ContainerComponent {...props}>
      <ContainerComponent
        ref={container}
        onChildLoaded={onChildLoaded}
        position={pivot}
        children={children}
      />
    </ContainerComponent>
  );
};
