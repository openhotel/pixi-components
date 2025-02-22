import { useMemo } from "react";
import { DisplayObjectProps, DisplayObjectRefProps } from "../types";

export const useDisplayObject = ({
  position,
  pivot,
  scale,
  anchor,
  ...props
}: DisplayObjectProps<unknown>): DisplayObjectRefProps<unknown> => {
  const $position = useMemo(
    () => ({
      x: Math.round(position?.x ?? 0),
      y: Math.round(position?.y ?? 0),
    }),
    [position],
  );

  const $pivot = useMemo(
    () => ({
      x: Math.round(pivot?.x ?? 0),
      y: Math.round(pivot?.y ?? 0),
    }),
    [pivot],
  );

  const $scale = useMemo(
    () => ({
      x: scale?.x ?? 1,
      y: scale?.y ?? 1,
    }),
    [scale],
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

  return {
    position: $position,
    pivot: $pivot,
    scale: $scale,
    anchor: $anchor,

    ...props,
  } as DisplayObjectRefProps<unknown>;
};
