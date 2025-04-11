import type { Meta, StoryObj } from "@storybook/react";
import { GraphicsComponent } from "./graphics.component";
import { GraphicType } from "../../../enums";

const meta: Meta<typeof GraphicsComponent> = {
  title: "Components/Core/Graphics",
  component: GraphicsComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof GraphicsComponent>;

export const Polygon: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.POLYGON,
    polygon: [0, 0, 0, 10, 10, 10, 10, 0],
  },
};

export const PolygonWithMask: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.POLYGON,
    polygon: [0, 0, 0, 100, 100, 100, 100, 0],
    mask: (
      <GraphicsComponent
        position={{
          x: 10,
        }}
        type={GraphicType.RECTANGLE}
        width={40}
        height={50}
      />
    ),
  },
};

export const Circle: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.CIRCLE,
    radius: 5,
  },
};

export const Capsule: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.CAPSULE,
    radius: 5,
    length: 20,
  },
};

export const Triangle: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.TRIANGLE,
    width: 10,
    height: 10,
  },
};

export const Rectangle: Story = {
  args: {
    tint: 0xff00ff,
    type: GraphicType.RECTANGLE,
    width: 10,
    height: 20,
  },
};
