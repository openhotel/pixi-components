import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type { FC } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import type { DisplayObjectProps, DisplayObjectRefProps } from "../../../types";
import { useDisplayObject } from "../../../hooks";
import { GraphicType } from "../../../enums";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  Graphics,
});

export type GraphicsRef = {} & DisplayObjectRefProps<Graphics>;

export type GraphicsProps = {
  type: GraphicType;
  polygon?: number[];
  radius?: number;
  length?: number;
  width?: number;
  height?: number;
} & DisplayObjectProps<GraphicsRef>;

export const GraphicsComponent: FC<GraphicsProps> = ({
  ref,
  label = "graphics",
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
      ...$props,
      label,
      component: graphicsRef.current,
    }),
    [graphicsRef.current, label, $props],
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
    [type, polygon, radius, length, width, height],
  );

  useEffect(() => {
    if (!graphicsRef.current) return;
    graphicsRef.current.parent.emit("child-loaded", null);
  }, [graphicsRef.current]);

  return (
    <>
      <pixiGraphics
        ref={graphicsRef}
        label={label}
        draw={$onDraw}
        {...$props}
      />
      {$props.maskRender}
    </>
  );
};
