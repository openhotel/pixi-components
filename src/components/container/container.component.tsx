import React, {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import {DisplayObjectProps, DisplayObjectRefProps} from "../../types";
import { useDisplayObject } from "../../hooks";
import { getDisplayObjectRefFunctions } from "../../utils";

extend({
  Container,
});

export type ContainerRef = {} & DisplayObjectRefProps<Container<any>>;

export type ContainerProps = {
  children?: ReactNode;
  mask?: ReactNode;
  onChildLoaded?: (ref: Ref<unknown>) => void;
} & DisplayObjectProps<ContainerRef>;

export const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  ref,
  mask,
  onChildLoaded,
  ...props
}) => {
  const $ref = useRef<Container>(null);
  const maskRef = useRef<Container>(null);
  const [isMaskReady, setIsMaskReady] = useState(false);

  const $props = useDisplayObject(props);

  const getRefProps = useCallback(
    (): ContainerRef => ({
      ...getDisplayObjectRefFunctions($ref.current),
      ...$props,
      component: $ref.current,
    }),
    [$ref.current, $props],
  );

  useImperativeHandle(ref, getRefProps, [getRefProps]);

  const $onChildLoaded = useCallback(
    (ref) => {
      $ref.current.parent.emit("child-loaded", null);
      onChildLoaded?.(ref);
    },
    [$ref.current, onChildLoaded],
  );

  useEffect(() => {
    $ref?.current?.on("child-loaded", $onChildLoaded);

    return () => {
      $ref?.current?.off("child-loaded", $onChildLoaded);
    };
  }, [$ref.current]);

  // Render the mask into the PixiJS tree and capture its ref
  const renderedMask = useMemo(() => {
    if (!mask) return null;
    return (
      <pixiContainer
        ref={(instance) => {
          maskRef.current = instance;
          setIsMaskReady(!!instance);
        }}
        position={$props.position}
        pivot={$props.pivot}
      >
        {mask}
      </pixiContainer>
    );
  }, [mask, $props, setIsMaskReady]);

  return (
    <>
      {renderedMask}
      <pixiContainer
        ref={$ref}
        mask={isMaskReady ? maskRef.current : null}
        children={children}
        {...$props}
      />
    </>
  );
};
