import { Meta, StoryObj } from "@storybook/react";
import { DragContainerComponent, SpriteComponent } from "../..";

const meta: Meta<typeof DragContainerComponent> = {
  title: "Components/Prefabs/Drag Container",
  component: DragContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DragContainerComponent>;

export const DragWindowsSize: Story = {
  args: {
    dragPolygon: [0, 0, 10, 0, 10, 10, 0, 10],
    children: (
      <>
        <SpriteComponent
          position={{ x: 0 }}
          texture="/assets/logo_64x_transparent.png"
        />
      </>
    ),
  },
};

export const DragFixedSize: Story = {
  args: {
    dragPolygon: [0, 0, 10, 0, 10, 10, 0, 10],
    size: { width: 300, height: 100 },
    children: (
      <>
        <SpriteComponent
          position={{ x: 0 }}
          texture="/assets/logo_64x_transparent.png"
        />
      </>
    ),
  },
};
