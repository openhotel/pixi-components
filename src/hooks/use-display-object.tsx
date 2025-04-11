import { useMemo, useState } from "react";
import type { DisplayObjectProps, DisplayObjectRefProps } from "../types";
import { GraphicsComponent } from "../components";
import { GraphicType } from "../enums";

export const useDisplayObject = ({
  label,
  position,
  pivot,
  scale,
  anchor,
  maskPolygon,
  maskPosition,
  ...props
}: DisplayObjectProps<unknown>): DisplayObjectRefProps<unknown> => {
  const $scale = useMemo(
    () => ({
      x: scale?.x ?? 1,
      y: scale?.y ?? 1,
    }),
    [scale],
  );

  const $position = useMemo(
    () => ({
      x: Math.round(position?.x ?? 0),
      y: Math.round(position?.y ?? 0),
    }),
    [position, $scale],
  );

  const $pivot = useMemo(
    () => ({
      x: Math.round($scale.x > 0 ? (pivot?.x ?? 0) : -(pivot?.x ?? 0)),
      y: Math.round($scale.y > 0 ? (pivot?.y ?? 0) : -(pivot?.y ?? 0)),
    }),
    [pivot, $scale],
  );

  const $anchor = useMemo(() => {
    const baseAnchor = {
      x: anchor?.x ?? 0,
      y: anchor?.y ?? 0,
    };

    return {
      x: $scale.x > 0 ? baseAnchor.x : 1 - baseAnchor.x,
      y: $scale.y > 0 ? baseAnchor.x : 1 - baseAnchor.x,
    };
  }, [anchor, $scale]);

  const [$mask, $setMask] = useState(null);

  const maskRender = useMemo(
    () =>
      maskPolygon ? (
        <GraphicsComponent
          ref={$setMask}
          type={GraphicType.POLYGON}
          polygon={maskPolygon}
          tint={0xff00ff}
          position={maskPosition}
        />
      ) : null,
    [maskPolygon, maskPosition],
  );

  return {
    label,
    position: $position,
    pivot: $pivot,
    scale: $scale,
    anchor: $anchor,

    mask: $mask?.component,
    maskRender,

    ...props,
  } as DisplayObjectRefProps<unknown>;
};
