import React, {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import { DisplayObjectProps, DisplayObjectRefProps } from "../../types";
import { useDisplayObject } from "../../hooks";

extend({
  Container,
});

export type ContainerRef = {} & DisplayObjectRefProps;

export type ContainerProps = {
  children?: ReactNode;
  mask?: ReactNode;
} & DisplayObjectProps<ContainerRef>;

export const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  ref,
  onDraw,
  mask,
  ...props
}) => {
  const maskRef = useRef<Container>(null);
  const [isMaskReady, setIsMaskReady] = useState(false);

  const $props = useDisplayObject(props);

  const $refProps = useMemo(
    (): ContainerRef => ({
      ...$props,
    }),
    [$props],
  );

  useImperativeHandle(ref, (): ContainerRef => $refProps, [$refProps]);

  useEffect(() => {
    onDraw?.($refProps);
  }, [onDraw, $refProps]);

  // Render the mask into the PixiJS tree and capture its ref
  const renderedMask = useMemo(() => {
    if (!mask) return null;
    return (
      <pixiContainer
        ref={(instance) => {
          maskRef.current = instance;
          setIsMaskReady(!!instance);
        }}
      >
        {mask}
      </pixiContainer>
    );
  }, [mask]);

  return (
    <>
      {renderedMask}
      <pixiContainer
        mask={isMaskReady ? maskRef.current : null}
        children={children}
        {...$props}
      />
    </>
  );
};
