import type { Meta, StoryObj } from "@storybook/react";
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

export const SlicedSprite: Story = {
  args: {
    texture: "/assets/9sprite2.png",
    leftWidth: 7,
    rightWidth: 4,
    topHeight: 7,
    bottomHeight: 5,
    width: 80,
    height: 50,
  },
};

export const SlicedSpriteWithMask: Story = {
  args: {
    texture: "/assets/9sprite2.png",
    leftWidth: 7,
    rightWidth: 4,
    topHeight: 7,
    bottomHeight: 5,
    width: 80,
    height: 50,
    maskPolygon: [0, 0, 40, 0, 40, 50, 0, 50],
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
