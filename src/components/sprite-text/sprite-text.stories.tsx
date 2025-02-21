import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "./sprite-text.component";

const meta: Meta<typeof SpriteTextComponent> = {
  title: "Components/Sprite Text",
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
  },
};
