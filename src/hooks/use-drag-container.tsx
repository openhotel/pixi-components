import React, { ReactNode, useContext, useState } from "react";

type DragContainerState = {
  dragPolygon?: number[];
  setDragPolygon?: (polygon: number[]) => void;
};

const DragContainerContext = React.createContext<DragContainerState>(undefined);

type DragContainerProps = {
  children: ReactNode;
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
