import type { Meta, StoryObj } from "@storybook/react";
import { ContainerComponent } from "./container.component";
import { fn } from "@storybook/test";
import { Cursor, EventMode } from "../../../enums";
import { SpriteComponent } from "..";

const meta: Meta<typeof ContainerComponent> = {
  title: "Components/Core/Container",
  component: ContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ContainerComponent>;

export const ContainerWithMask: Story = {
  args: {
    children: (
      <SpriteComponent
        position={{ x: 0 }}
        texture="/assets/logo_64x_transparent.png"
      />
    ),
    maskPolygon: [0, 0, 32, 0, 32, 64, 0, 64],
    position: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 },
    onPointerDown: fn(),
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  },
};
