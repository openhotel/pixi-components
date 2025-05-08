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
    defaultValue: "pqgabc123",
    backgroundColor: 0xff00ff,
    backgroundAlpha: 0.5,
    width: 41,
    height: 7,
    padding: {
      left: 1,
      top: 1,
      right: 1,
      bottom: 1,
    },
    maxLength: 200,
    onChange: console.info,
    position: { x: 20, y: 20 },
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
    onChange: console.info,
  },
};

export const Multiple = () => {
  const [focusNextInput, setFocusNextInput] = useState<number>(null);

  useEffect(() => {
    setTimeout(() => {
      setFocusNextInput(performance.now());
    }, 3000);
  }, [setFocusNextInput]);

  const [value, setValue] = useState<string>("");
  const [value1, setValue1] = useState<string>("");

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
        onChange={(e) => setValue(e.target.value)}
        value={value}
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
        onChange={(e) => setValue1(e.target.value)}
        value={value1}
      />
    </ContainerComponent>
  );
};
