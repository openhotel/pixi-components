import type { Meta, StoryObj } from "@storybook/react";
import { SpriteTextInputComponent } from "./sprite-text-input.component";
import { ContainerComponent, GraphicsComponent } from "../../core";
import { useEffect, useState } from "react";
import { Cursor, EventMode, GraphicType } from "../../../enums";

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
      left: 6,
      top: 2,
      right: 6,
      bottom: 2,
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

export const Disabled: Story = {
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
    enabled: false,
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

export const ExternalChanges = () => {
  const [rotatingValue, setRotatingValue] = useState<string>("");
  const [numberAppendingValue, setNumberAppendingValue] = useState<string>("");

  const [focus, setFocus] = useState<number>(null);

  const words = ["rotating", "words", "appear", "on", "this", "input"];

  useEffect(() => {
    let wordIndex = 0;

    const interval = setInterval(() => {
      setRotatingValue(words[wordIndex]);
      wordIndex = (wordIndex + 1) % words.length;

      setNumberAppendingValue((prev) => prev + Math.floor(Math.random() * 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const onClickRectangle = () => {
    setFocus(performance.now());
  };

  return (
    <ContainerComponent position={{ x: 20, y: 20 }}>
      <SpriteTextInputComponent
        height={10}
        width={150}
        padding={{
          left: 10,
          bottom: 5,
          right: 10,
          top: 5,
        }}
        backgroundColor={0xff00ff}
        spriteSheet="/assets/fonts/default-font.json"
        onChange={(e) => setRotatingValue(e.target.value)}
        value={rotatingValue}
        focusNow={focus}
        enabled={false}
      />

      <SpriteTextInputComponent
        height={10}
        width={150}
        padding={{
          left: 10,
          bottom: 5,
          right: 10,
          top: 5,
        }}
        position={{
          y: 25,
        }}
        backgroundColor={0x00ffff}
        spriteSheet="/assets/fonts/default-font.json"
        onChange={(e) => setNumberAppendingValue(e.target.value)}
        value={numberAppendingValue}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        position={{
          x: 100,
          y: 100,
        }}
        width={30}
        height={30}
        tint={0x00ff00}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onClickRectangle}
      />
    </ContainerComponent>
  );
};
