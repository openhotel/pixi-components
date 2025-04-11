import type { Meta, StoryObj } from "@storybook/react";
import { SpriteComponent } from "./sprite.component";
import { GraphicsComponent } from "../graphics";
import { GraphicType } from "../../../enums";

const meta: Meta<typeof SpriteComponent> = {
  title: "Components/Core/Sprite",
  component: SpriteComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SpriteComponent>;

export const SpriteSheetTexture: Story = {
  args: {
    spriteSheet: "/assets/human/human.json",
    texture: "head_n",
    position: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 },
    scale: { x: -1 },
    anchor: { x: 0 },
  },
};

export const SpriteTexture: Story = {
  args: {
    texture: "/assets/logo_64x_transparent.png",
  },
};

export const SpriteTextureWithMask: Story = {
  args: {
    texture: "/assets/logo_64x_transparent.png",
    mask: (
      <GraphicsComponent type={GraphicType.RECTANGLE} width={40} height={50} />
    ),
  },
};
