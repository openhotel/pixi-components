import { createContext, useContext, useState } from "react";
import type React from "react";

type DragContainerState = {
  dragPolygon?: number[];
  setDragPolygon?: (polygon: number[]) => void;
};

const DragContainerContext = createContext<DragContainerState>(undefined);

type DragContainerProps = {
  children: React.ReactNode;
};

export const DragContainerProvider: React.FunctionComponent<
  DragContainerProps
> = ({ children }) => {
  const [dragPolygon, setDragPolygon] = useState<number[]>([]);

  return (
    <DragContainerContext.Provider
      value={{
        dragPolygon,
        setDragPolygon,
      }}
      children={children}
    />
  );
};

export const useDragContainer = (): DragContainerState =>
  useContext(DragContainerContext);
