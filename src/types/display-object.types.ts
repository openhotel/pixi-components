import type { Ref, ReactNode } from "react";
import { Cursor, EventMode } from "../enums";
import type { Point, Size, Bounds } from ".";
import { AnimatedSprite, Container, Graphics, Sprite } from "pixi.js";

export type DisplayObject = AnimatedSprite | Sprite | Container | Graphics;

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
  visible?: boolean;

  onPointerDown?: (event: unknown) => void;
  onPointerUp?: (event: unknown) => void;
  onPointerEnter?: (event: unknown) => void;
  onPointerLeave?: (event: unknown) => void;
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
  readonly visible?: Readonly<boolean>;
} & DisplayObjectRefFunctions;

export type DisplayObjectRefFunctions = {
  readonly position: Readonly<Point>;

  getBounds: () => Bounds;
  getSize: () => Size;
};
