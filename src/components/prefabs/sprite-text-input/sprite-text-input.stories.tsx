import type { Meta, StoryObj } from "@storybook/react";
import { SpriteTextInputComponent } from "./sprite-text-input.component";
import { ContainerComponent } from "../../core";
import { useEffect, useState } from "react";

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
    width: 80,
    height: 7,
    padding: {
      left: 7,
      top: 5,
      right: 7,
      bottom: 4,
    },
    maxLength: 16,
    onValueChange: console.info,
    onEnter: console.info,
  },
};

export const Placeholder: Story = {
  args: {
    spriteSheet: "/assets/fonts/default-font.json",
    color: 0xffffff,
    //
    placeholder: "placeholder",
    placeholderProps: {
      alpha: 0.5,
    },
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
    maxLength: 16,
    onValueChange: console.info,
    clearOnEnter: true,
  },
};

export const Multiple = () => {
  const [focusNextInput, setFocusNextInput] = useState<number>(null);

  useEffect(() => {
    setTimeout(() => {
      setFocusNextInput(performance.now());
    }, 3000);
  }, [setFocusNextInput]);

  return (
    <ContainerComponent position={{ x: 20, y: 20 }}>
      <SpriteTextInputComponent
        height={10}
        width={50}
        padding={{
          left: 10,
          bottom: 5,
          right: 10,
          top: 5,
        }}
        backgroundColor={0xff00ff}
        spriteSheet="/assets/fonts/default-font.json"
        focusNow={performance.now()}
      />
      <SpriteTextInputComponent
        height={10}
        width={50}
        padding={{
          left: 10,
          bottom: 5,
          right: 10,
          top: 5,
        }}
        position={{
          y: 25,
        }}
        spriteSheet="/assets/fonts/default-font.json"
        focusNow={focusNextInput}
      />
    </ContainerComponent>
  );
};
