import { Meta, StoryObj } from "@storybook/react";
import { AlignContainerComponent } from "./align-container.component";
import { GraphicType, HorizontalAlign, VerticalAlign } from "../../../enums";
import { GraphicsComponent, SpriteComponent, SpriteTextComponent } from "../..";

const meta: Meta<typeof AlignContainerComponent> = {
  title: "Components/Prefabs/Align Container",
  component: AlignContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof AlignContainerComponent>;

export const Align: Story = {
  args: {
    children: (
      <>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={200}
          height={80}
        />
        <SpriteComponent
          position={{ x: 0 }}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent
          position={{ x: 50 }}
          texture="/assets/logo_64x_transparent.png"
        />
      </>
    ),
    horizontalAlign: HorizontalAlign.CENTER,
    verticalAlign: VerticalAlign.MIDDLE,
    size: {
      width: 300,
      height: 160,
    },
  },
};

export const Align2: Story = {
  args: {
    children: (
      <>
        <SpriteTextComponent
          spriteSheet="/assets/fonts/default-font.json"
          text="ABC abc 123 44444"
        />
      </>
    ),
    horizontalAlign: HorizontalAlign.RIGHT,
    verticalAlign: VerticalAlign.MIDDLE,
  },
};
