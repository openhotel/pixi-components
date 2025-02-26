import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "./sprite-text.component";

const meta: Meta<typeof SpriteTextComponent> = {
  title: "Components/Prefabs/Sprite Text",
  component: SpriteTextComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SpriteTextComponent>;

export const Primary: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    text: "abc123",
    color: [0xffffff, 0xff00ff, 0x00ff00, 0x0000ff],
    backgroundColor: [0xff0000, 0xffffff, 0x0000ff, 0xff00ff],
    backgroundAlpha: [1, 0.5, 0.25, 1],
    alpha: [1, 1, 0.4, 0.5, 0.75],
    padding: {
      left: 6,
      top: 7,
      right: 5,
      bottom: 2,
    },
  },
};

export const Secondary: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    text: "abc123",
    color: [0xffffff, 0xff00ff, 0x00ff00, 0x0000ff],
    backgroundColor: 0xff00ff,
    alpha: [1, 1, 0.4, 0.5, 0.75],
  },
};

export const MaxWidth: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    text: "Hola que tal estamos?",
    color: 0xffffff,
    backgroundColor: [0xff0000, 0x0000ff, 0xff00ff],
    maxWidth: 44,
    padding: {
      left: 6,
      top: 2,
      right: 5,
      bottom: 2,
    },
  },
};

export const MaxWidth2: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    text: "Hola que tal estamos?",
    color: 0xffffff,
    backgroundColor: 0x0000ff,
    maxWidth: 44,
    padding: {
      left: 6,
      top: 2,
      right: 5,
      bottom: 2,
    },
  },
};
