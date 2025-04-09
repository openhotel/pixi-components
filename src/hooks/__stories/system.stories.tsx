import { Meta, StoryObj } from "@storybook/react";
import {
  FlexContainerComponent,
  GraphicsComponent,
  SpriteTextComponent,
} from "../../components";
import { useSystem } from "../../hooks";
import { GraphicType } from "../../enums";

const SystemStory = () => {
  const { browser, cpu, gpu } = useSystem();

  return (
    <FlexContainerComponent direction="y">
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={browser.name}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={browser.version}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={200}
        height={1}
        alpha={0.2}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={cpu.arch}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={`${cpu.cores} cores`}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={200}
        height={1}
        alpha={0.2}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={gpu.name}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={gpu.vendor}
      />
    </FlexContainerComponent>
  );
};

const meta: Meta<typeof SystemStory> = {
  title: "Hooks/System",
  component: SystemStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SystemStory>;

export const Primary: Story = {
  args: {},
};
