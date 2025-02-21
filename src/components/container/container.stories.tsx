import { Meta, StoryObj } from "@storybook/react";
import { ContainerComponent } from "./container.component";
import { SpriteComponent } from "../sprite";
import { fn } from "@storybook/test";
import { Cursor, EventMode } from "../../enums";

const meta: Meta<typeof ContainerComponent> = {
  title: "Components/Container",
  component: ContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ContainerComponent>;

export const Primary: Story = {
  args: {
    children: (
      <SpriteComponent
        position={{ x: 10 }}
        texture="/assets/logo_64x_transparent.png"
      />
    ),
    position: { x: -15, y: 0 },
    pivot: { x: 0, y: 0 },
    onDraw: fn(),
    onPointerDown: fn(),
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
  },
};
