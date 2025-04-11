import type { Meta, StoryObj } from "@storybook/react";
import { TilingSpriteComponent } from "./tiling-sprite.component";
import { GraphicsComponent } from "../graphics";
import { GraphicType } from "../../../enums";

const meta: Meta<typeof TilingSpriteComponent> = {
  title: "Components/Core/Tiling Sprite",
  component: TilingSpriteComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof TilingSpriteComponent>;

export const SpriteSheetTexture: Story = {
  args: {
    spriteSheet: "/assets/human/human.json",
    texture: "head_n",
    position: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 },
    scale: { x: -1 },
    anchor: { x: 0 },
    width: 100,
    height: 100,
    tilePosition: {
      x: 10,
      y: 0,
    },
  },
};

export const SpriteTexture: Story = {
  args: {
    texture: "/assets/logo_64x_transparent.png",
    width: 100,
    height: 100,
  },
};

export const SpriteTextureWithMask: Story = {
  args: {
    texture: "/assets/logo_64x_transparent.png",
    width: 100,
    height: 100,
    mask: (
      <GraphicsComponent type={GraphicType.RECTANGLE} width={80} height={50} />
    ),
  },
};
