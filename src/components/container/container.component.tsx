import React, {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
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
} & DisplayObjectProps<ContainerRef>;

export const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  ref,
  onDraw,
  ...props
}) => {
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

  return <pixiContainer children={children} {...$props} />;
};
