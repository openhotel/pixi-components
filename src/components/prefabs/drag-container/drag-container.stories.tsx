import type { Meta, StoryObj } from "@storybook/react";
import { DragContainerComponent, SpriteComponent } from "../..";
import { useDragContainer } from "../../../hooks";
import { useEffect } from "react";

const meta: Meta<typeof DragContainerComponent> = {
  title: "Components/Prefabs/Drag Container",
  component: DragContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DragContainerComponent>;

const DragWindowsSizeWrapper = () => {
  const { setDragPolygon } = useDragContainer();

  useEffect(() => {
    setDragPolygon([5, 35, 50, 10, 60, 30, 20, 55]);
  }, [setDragPolygon]);

  return (
    <SpriteComponent
      position={{ x: 0 }}
      texture="/assets/logo_64x_transparent.png"
    />
  );
};

export const DragWindowsSize: Story = {
  args: {
    children: <DragWindowsSizeWrapper />,
  },
};

export const DragFixedSize: Story = {
  args: {
    size: { width: 300, height: 100 },
    children: <DragWindowsSizeWrapper />,
  },
};
