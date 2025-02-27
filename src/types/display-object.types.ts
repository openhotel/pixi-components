import { ReactNode, Ref } from "react";
import { Cursor, EventMode } from "../enums";
import { Point, Size, Bounds } from ".";
import { Container } from "pixi.js";

export type DisplayObjectProps<DisplayRef> = {
  ref?: Ref<DisplayRef>;

  label?: string;

  mask?: ReactNode;
  position?: Partial<Point>;
  pivot?: Partial<Point>;
  scale?: Partial<Point>;
  anchor?: Partial<Point>;
  eventMode?: EventMode;
  cursor?: Cursor;
  tint?: number;
  alpha?: number;
  zIndex?: number;

  onPointerDown?: (event: PointerEvent) => void;
};

export type DisplayObjectRefProps<PixiDisplay> = {
  /**
   * Prevent the use of this in favor of adding more props!
   * @deprecated
   */
  component: PixiDisplay;
  //
  readonly label: Readonly<string>;

  readonly mask?: Container<any>;
  readonly maskRender?: ReactNode;

  readonly position: Readonly<Point>;
  readonly pivot: Readonly<Point>;
  readonly scale: Readonly<Point>;
  readonly anchor: Readonly<Point>;
  readonly eventMode?: Readonly<EventMode>;
  readonly cursor?: Readonly<Cursor>;
  readonly tint?: Readonly<number>;
  readonly alpha?: Readonly<number>;
  readonly zIndex?: Readonly<number>;
} & DisplayObjectRefFunctions;

export type DisplayObjectRefFunctions = {
  readonly position: Readonly<Point>;

  getBounds: () => Bounds;
  getSize: () => Size;
};
