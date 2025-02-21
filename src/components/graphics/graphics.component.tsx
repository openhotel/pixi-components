import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { DisplayObjectProps, DisplayObjectRefProps } from "../../types";
import { useDisplayObject } from "../../hooks";
import { GraphicType } from "../../enums";

extend({
  Graphics,
});

export type GraphicsRef = {} & DisplayObjectRefProps;

export type GraphicsProps = {
  type: GraphicType;
  polygon?: number[];
  radius?: number;
  length?: number;
  width?: number;
  height?: number;
} & DisplayObjectProps<GraphicsRef>;

export const GraphicsComponent: React.FC<GraphicsProps> = ({
  ref,
  onDraw,
  type,
  polygon,
  radius,
  length,
  width,
  height,
  ...props
}) => {
  const graphicsRef = useRef<Graphics>(null);

  const $props = useDisplayObject(props);

  const $refProps = useMemo(
    (): GraphicsRef => ({
      ...$props,
    }),
    [$props],
  );

  useImperativeHandle(ref, (): GraphicsRef => $refProps, [$refProps]);

  useEffect(() => {
    const graphics = graphicsRef.current;

    graphics.clear();
    switch (type) {
      case GraphicType.POLYGON:
        graphics.poly(polygon).fill({ color: 0xffffff });
        return;
      case GraphicType.CIRCLE:
        graphics.circle(radius, radius, radius).fill({ color: 0xffffff });
        return;
      case GraphicType.CAPSULE:
        graphics
          .rect(0, radius, radius * 2, length)
          .circle(radius, radius, radius)
          .circle(radius, radius + length, radius)
          .fill({ color: 0xffffff });
        return;
      case GraphicType.TRIANGLE:
        graphics
          .poly([width / 2, 0, width, height, 0, height])
          .fill({ color: 0xffffff });
        return;
      case GraphicType.RECTANGLE:
        graphics
          .poly([0, 0, width, 0, width, height, 0, height])
          .fill({ color: 0xffffff });
        return;
    }
  }, [type, polygon, radius, length, width, height]);

  return <pixiGraphics ref={graphicsRef} draw={null} {...$props} />;
};
