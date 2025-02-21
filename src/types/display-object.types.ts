import { Point } from "./point.types";
import { Ref } from "react";
import { Cursor, EventMode } from "../enums";

export type DisplayObjectProps<DisplayRef> = {
  ref?: Ref<DisplayRef>;

  position?: Partial<Point>;
  pivot?: Partial<Point>;
  scale?: Partial<Point>;
  anchor?: Partial<Point>;
  eventMode?: EventMode;
  cursor?: Cursor;
  tint?: number;

  onDraw?: (ref: DisplayRef) => void;
  onPointerDown?: (event: PointerEvent) => void;
};

export type DisplayObjectRefProps = {
  readonly position: Readonly<Point>;
  readonly pivot: Readonly<Point>;
  readonly scale: Readonly<Point>;
  readonly anchor: Readonly<Point>;
  readonly eventMode?: Readonly<EventMode>;
  readonly cursor: Readonly<Cursor>;
  readonly tint: Readonly<number>;
};
