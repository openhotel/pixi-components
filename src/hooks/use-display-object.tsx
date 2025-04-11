import { useEffect, useMemo, useState } from "react";
import type React from "react";
import type { DisplayObjectProps, DisplayObjectRefProps } from "../types";
import { Container } from "pixi.js";

export const useDisplayObject = ({
  label,
  position,
  pivot,
  scale,
  anchor,
  mask,
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

  const [$mask, $setMask] = useState<Container<any>>(null);
  const maskRender = useMemo((): React.ReactNode => {
    if (!mask) return null;
    return (
      <pixiContainer ref={$setMask} position={$position} pivot={$pivot}>
        {mask}
      </pixiContainer>
    );
  }, [mask, $position, $pivot, $setMask]);

  useEffect(() => {}, []);

  return {
    label,
    position: $position,
    pivot: $pivot,
    scale: $scale,
    anchor: $anchor,

    mask: $mask,
    maskRender,

    ...props,
  } as DisplayObjectRefProps<unknown>;
};
