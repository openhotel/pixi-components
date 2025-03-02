import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextInputComponent } from "./sprite-text-input.component";

const meta: Meta<typeof SpriteTextInputComponent> = {
  title: "Components/Prefabs/Sprite Text Input",
  component: SpriteTextInputComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SpriteTextInputComponent>;

export const Primary: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    color: 0xffffff,
    //
    defaultValue: "test",
    backgroundColor: 0xff00ff,
    backgroundAlpha: 0.5,
    width: 40,
    height: 7,
    padding: {
      left: 7,
      top: 5,
      right: 7,
      bottom: 4,
    },
    onValueChange: console.info,
  },
};
