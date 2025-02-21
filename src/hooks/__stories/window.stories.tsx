import { Meta, StoryObj } from "@storybook/react";
import { SpriteComponent } from "../../components";
import { useWindow } from "../../hooks";
import { Cursor, EventMode } from "../../enums";

const WindowStory = () => {
  const { setScale } = useWindow();

  return (
    <SpriteComponent
      spriteSheet={"/assets/human/human.json"}
      texture={"head_n"}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      onPointerDown={() => {
        setScale(10);
      }}
    />
  );
};

const meta: Meta<typeof WindowStory> = {
  title: "Hooks/Window",
  component: WindowStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof WindowStory>;

export const Primary: Story = {
  args: {},
};
