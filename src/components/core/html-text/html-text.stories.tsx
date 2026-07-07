import type { Meta, StoryObj } from "@storybook/react";
import { HtmlTextComponent } from "./html-text.component";

const meta: Meta<typeof HtmlTextComponent> = {
  title: "Components/Core/HtmlText",
  component: HtmlTextComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof HtmlTextComponent>;

export const BasicHtmlText: Story = {
  args: {
    text: '<a style="padding: 10px; color: red; text-shadow: 10px 4px 10px;">▓▒░High Quality</a><a style="color: green;">Text</a>',
    style: {
      fontSize: 20,
      fontFamily: '"JetBrains Mono", monospace',
      lineHeight: 24,
      leading: 0,
    },
  },
};
