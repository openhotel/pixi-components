import { Event } from "../enums";

//eventName, Event, stopPropagation, preventDefault
export const EVENT_MAP: [string, Event, boolean, boolean][] = [
  ["keydown", Event.KEY_DOWN, false, true],
  ["keyup", Event.KEY_UP, true, true],
  ["contextmenu", Event.RIGHT_CLICK, true, true],
  //
  ["mousemove", Event.POINTER_MOVE, true, false],
  ["touchmove", Event.POINTER_MOVE, true, false],
  //
  ["mousedown", Event.POINTER_DOWN, true, false],
  ["touchstart", Event.POINTER_DOWN, true, false],
  //
  ["mouseup", Event.POINTER_UP, true, false],
  ["touchend", Event.POINTER_UP, true, false],
  //
  ["wheel", Event.WHEEL, false, false],
  ["visibilitychange", Event.VISIBILITY_CHANGE, false, false],
];
