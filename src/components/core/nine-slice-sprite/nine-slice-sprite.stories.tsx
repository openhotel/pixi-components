import { Meta, StoryObj } from "@storybook/react";
import { NineSliceSpriteComponent } from "./nine-slice-sprite.component";

const meta: Meta<typeof NineSliceSpriteComponent> = {
  title: "Components/Core/NineSliceSprite",
  component: NineSliceSpriteComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof NineSliceSpriteComponent>;

export const SpriteTexture: Story = {
  args: {
    texture: "/assets/9sprite2.png",
    leftWidth: 7,
    topHeight: 4,
    rightWidth: 7,
    bottomHeight: 5,
    width: 70,
    height: 50,
  },
};

export const CursedHumanHead: Story = {
  args: {
    spriteSheet: "/assets/human/human.json",
    texture: "head_n",
    position: { x: 0, y: 0 },
    pivot: { x: 0, y: 0 },
    scale: { x: -1 },
    anchor: { x: 0 },
  },
};
