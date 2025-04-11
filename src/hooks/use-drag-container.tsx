import { createContext, useContext, useState } from "react";
import type { ReactNode, FC } from "react";

type DragContainerState = {
  dragPolygon?: number[];
  setDragPolygon?: (polygon: number[]) => void;
};

const DragContainerContext = createContext<DragContainerState>(undefined);

type DragContainerProps = {
  children: ReactNode;
};

export const DragContainerProvider: FC<DragContainerProps> = ({ children }) => {
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
