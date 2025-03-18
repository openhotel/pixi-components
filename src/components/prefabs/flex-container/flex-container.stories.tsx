import { Meta, StoryObj } from "@storybook/react";
import { FlexContainerComponent, SpriteComponent } from "../..";
import { FLEX_ALIGN, FLEX_JUSTIFY } from "../../../enums";

const meta: Meta<typeof FlexContainerComponent> = {
  title: "Components/Prefabs/Flex Container",
  component: FlexContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof FlexContainerComponent>;

export const FlexJustifyStart: Story = {
  args: {
    justify: FLEX_JUSTIFY.START,
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
    gap: 20,
  },
};

export const FlexJustifyEnd: Story = {
  args: {
    justify: FLEX_JUSTIFY.END,
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
    gap: 20,
  },
};

export const FlexJustifyCenter: Story = {
  args: {
    justify: FLEX_JUSTIFY.CENTER,
    align: FLEX_ALIGN.CENTER,
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
    gap: 20,
  },
};

export const FlexJustifyCenterReversed: Story = {
  args: {
    justify: FLEX_JUSTIFY.CENTER,
    align: FLEX_ALIGN.CENTER,
    direction: "y",
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
  },
};

export const FlexJustifySpaceEvenly: Story = {
  args: {
    justify: FLEX_JUSTIFY.SPACE_EVENLY,
    align: FLEX_ALIGN.BOTTOM,
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
  },
};

export const FlexJustifySpaceEvenlyFixed: Story = {
  args: {
    justify: FLEX_JUSTIFY.SPACE_EVENLY,
    align: FLEX_ALIGN.BOTTOM,
    size: {
      width: 300,
      height: 100,
    },
    children: (
      <>
        <SpriteComponent
          tint={0xff00ff}
          texture="/assets/logo_64x_transparent.png"
        />
        <SpriteComponent texture="/assets/logo_64x_transparent.png" />
      </>
    ),
  },
};
