import { Ref } from "react";
import { Cursor, EventMode } from "../enums";
import { Point, Size, Bounds } from ".";

export type DisplayObjectProps<DisplayRef> = {
  ref?: Ref<DisplayRef>;

  position?: Partial<Point>;
  pivot?: Partial<Point>;
  scale?: Partial<Point>;
  anchor?: Partial<Point>;
  eventMode?: EventMode;
  cursor?: Cursor;
  tint?: number;
  alpha?: number;
  zIndex?: number;
  sortableChildren?: boolean;

  onPointerDown?: (event: PointerEvent) => void;
};

export type DisplayObjectRefProps<PixiDisplay> = {
  /**
   * Prevent the use of this in favor of adding more props!
   * @deprecated
   */
  component: PixiDisplay;
  //
  readonly position: Readonly<Point>;
  readonly pivot: Readonly<Point>;
  readonly scale: Readonly<Point>;
  readonly anchor: Readonly<Point>;
  readonly eventMode?: Readonly<EventMode>;
  readonly cursor?: Readonly<Cursor>;
  readonly tint?: Readonly<number>;
  readonly alpha?: Readonly<number>;
  readonly zIndex?: Readonly<number>;
  readonly sortableChildren?: Readonly<boolean>;
} & DisplayObjectRefFunctions;

export type DisplayObjectRefFunctions = {

  readonly position: Readonly<Point>;

  getBounds: () => Bounds;
  getSize: () => Size;
};
