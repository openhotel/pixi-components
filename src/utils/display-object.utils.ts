import { Bounds, DisplayObjectRefFunctions, Point, Size } from "../types";
import { Container } from "pixi.js/lib/scene/container/Container";

export const getDisplayObjectRefFunctions = <PixiDisplay extends Container>(
  component: PixiDisplay,
): DisplayObjectRefFunctions => {
  if (!component) return null;

  const getBounds = (): Bounds => {
    const { minX, minY, maxX, maxY } = component.getBounds();
    return { minX, minY, maxX, maxY };
  };

  const getSize = (): Size => {
    const { width, height } = component.getSize();
    return { width, height };
  };

  const position: Point = {
    x: component.position.x,
    y: component.position.y,
  };

  return {
    component,

    getBounds,
    getSize,

    position,
  } as DisplayObjectRefFunctions;
};
