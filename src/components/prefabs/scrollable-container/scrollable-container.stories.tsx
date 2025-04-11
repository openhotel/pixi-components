import type { Meta, StoryObj } from "@storybook/react";
import { ScrollableContainerComponent } from "./scrollable-container.component";
import { GraphicsComponent } from "../../core";
import { FLEX_JUSTIFY, GraphicType } from "../../../enums";
import React from "react";
import { FlexContainerComponent } from "../flex-container";
import { SpriteTextComponent } from "../sprite-text";

const meta: Meta<typeof ScrollableContainerComponent> = {
  title: "Components/Prefabs/Scrollable Container",
  component: ScrollableContainerComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ScrollableContainerComponent>;

export const Primary: Story = {
  args: {
    size: {
      width: 200,
      height: 220,
    },
    scrollbar: {
      renderTop: () => (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={10}
          height={30}
          tint={0xff0000}
        />
      ),
      renderBottom: () => (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={10}
          height={30}
          tint={0x00ff00}
        />
      ),
      renderScrollBackground: () => (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={10}
          height={180}
          tint={0x0000ff}
        />
      ),
      renderScrollBar: () => (
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={10}
          height={20}
          tint={0x00ffff}
        />
      ),
    },
    children: (
      <>
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.START}
          direction="y"
          gap={3}
        >
          {Array.from({ length: 20 }, (_, index) => (
            <GraphicsComponent
              key={index}
              type={GraphicType.RECTANGLE}
              width={200}
              height={100}
              tint={0xff00ff}
            />
          ))}
        </FlexContainerComponent>
      </>
    ),
  },
};
