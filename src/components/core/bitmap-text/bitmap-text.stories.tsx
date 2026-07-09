import type { Meta, StoryObj } from "@storybook/react";
import { BitmapTextComponent } from "./bitmap-text.component";
import { Assets } from "pixi.js";
import { useEffect, useState } from "react";

const meta: Meta<typeof BitmapTextComponent> = {
  title: "Components/Core/BitmapText",
  component: BitmapTextComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof BitmapTextComponent>;

export const BasicBitmapText: Story = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    Assets.load("assets/fonts/JetBrains.fnt").then((a) => {
      console.log(a);
      setLoaded(true);
    });
  }, [setLoaded]);

  return loaded ? (
    <BitmapTextComponent
      text={
        // "!\"#$%&'()*+,-./01"
        "▓▒░ COMMAND LINK ░▒▓\n▓▒░asdklajsdkjaksld\n█▓▒░▄▀▌▐▆▇▂▃▅▆\n█▓▒░▄▀▌▐▆▇▂▃▅▆"
      }
      style={{
        fontSize: 33,
        fontFamily: "JetBrains Mono Medium",
        // fontFamily: '"JetBrains Mono", monospace',
        lineHeight: 44,
        leading: 0,
        fill: "white",
      }}
      pivot={{
        y: 6,
      }}
    />
  ) : null;
};
