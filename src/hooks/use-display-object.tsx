import { ReactNode, useMemo, useRef, useState } from "react";
import { DisplayObjectProps, DisplayObjectRefProps } from "../types";
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

  const [isMaskReady, setIsMaskReady] = useState<boolean>(false);
  const maskRef = useRef<Container<any>>(null);
  const maskRender = useMemo((): ReactNode => {
    if (!mask) return null;
    return (
      <pixiContainer
        ref={(instance) => {
          maskRef.current = instance;
          setIsMaskReady(true);
        }}
        position={$position}
        pivot={$pivot}
      >
        {mask}
      </pixiContainer>
    );
  }, [mask, $position, $pivot, maskRef, setIsMaskReady]);

  console.log(mask, isMaskReady, maskRef.current);
  return {
    position: $position,
    pivot: $pivot,
    scale: $scale,
    anchor: $anchor,

    mask: maskRef?.current,
    maskRender: isMaskReady ? maskRender : null,

    ...props,
  } as DisplayObjectRefProps<unknown>;
};
