import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import type React from "react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import type {
  DisplayObject,
  DisplayObjectProps,
  DisplayObjectRefProps,
} from "../../../types";
import { useDisplayObject } from "../../../hooks";
import { getDisplayObjectRefFunctions } from "../../../utils";

extend({
  Container,
});

export type ContainerRef = {
  readonly sortableChildren?: Readonly<boolean>;

  getChildren: () => DisplayObject[];
} & DisplayObjectRefProps<Container<any>>;

export type ContainerProps = {
  children?: React.ReactNode;
  onChildLoaded?: (ref: React.Ref<unknown>) => void;
  sortableChildren?: boolean;
} & DisplayObjectProps<ContainerRef>;

export const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  label = "container",
  ref,
  onChildLoaded,
  ...props
}) => {
  const $ref = useRef<Container>(null);

  const $props = useDisplayObject(props);

  const getRefProps = useCallback(
    (): ContainerRef => ({
      ...getDisplayObjectRefFunctions($ref.current),
      ...$props,
      label,
      component: $ref.current,

      getChildren: () => $ref.current.children,
    }),
    [$ref.current, label, $props],
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

  return (
    <>
      {$props?.maskRender}
      <pixiContainer ref={$ref} label={label} children={children} {...$props} />
    </>
  );
};
