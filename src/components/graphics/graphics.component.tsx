import React, { useCallback, useImperativeHandle, useRef } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { DisplayObjectProps, DisplayObjectRefFunctions } from "../../types";
import { useDisplayObject } from "../../hooks";
import { GraphicType } from "../../enums";
import { getDisplayObjectRefFunctions } from "../../utils";

extend({
  Graphics,
});

export type GraphicsRef = {} & DisplayObjectRefFunctions<Graphics>;

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

  const getRefProps = useCallback(
    (): GraphicsRef => ({
      ...getDisplayObjectRefFunctions(graphicsRef.current),
      component: graphicsRef.current,
    }),
    [graphicsRef.current],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  const $onDraw = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      switch (type) {
        case GraphicType.POLYGON:
          graphics.poly(polygon).fill({ color: 0xffffff });
          break;
        case GraphicType.CIRCLE:
          graphics.circle(radius, radius, radius).fill({ color: 0xffffff });
          break;
        case GraphicType.CAPSULE:
          graphics
            .rect(0, radius, radius * 2, length)
            .circle(radius, radius, radius)
            .circle(radius, radius + length, radius)
            .fill({ color: 0xffffff });
          break;
        case GraphicType.TRIANGLE:
          graphics
            .poly([width / 2, 0, width, height, 0, height])
            .fill({ color: 0xffffff });
          break;
        case GraphicType.RECTANGLE:
          graphics
            .poly([0, 0, width, 0, width, height, 0, height])
            .fill({ color: 0xffffff });
          break;
      }
    },
    [type, polygon, radius, length, width, height, getRefProps],
  );

  return <pixiGraphics ref={graphicsRef} draw={$onDraw} {...$props} />;
};
