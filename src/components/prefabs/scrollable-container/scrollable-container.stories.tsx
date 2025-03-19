import { Meta, StoryObj } from "@storybook/react";
import { ScrollableContainerComponent } from "./scrollable-container.component";
import { GraphicsComponent } from "../../core";
import { GraphicType } from "../../../enums";

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
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          tint={0xff00ff}
          height={350}
          width={100}
          position={{
            x: 10,
            y: 50,
          }}
        />
      </>
    ),
  },
};
