import type { Meta, StoryObj } from "@storybook/react";
import { TextComponent } from "./text.component";

const meta: Meta<typeof TextComponent> = {
  title: "Components/Core/Text",
  component: TextComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof TextComponent>;

export const BasicMonoText: Story = {
  args: {
    text: "▓▒░ COMMAND LINK ░▒▓\n▓asdklajsdkjaksld\n█▓▒░▄▀▌▐▆▇▂▃▅▆\n▔▕▖▗▘▙▚▛▜▝▞▟",
    style: {
      fontSize: 20,
      fontFamily: '"JetBrains Mono", monospace',
      lineHeight: 24,
      leading: 0,
      fill: "white",
    },
    textureStyle: {
      scaleMode: "nearest",
    },
  },
};
