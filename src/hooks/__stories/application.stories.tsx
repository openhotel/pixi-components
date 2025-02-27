import { Meta, StoryObj } from "@storybook/react";
import { SpriteComponent } from "../../components";
import { useApplication } from "../../hooks";
import { Cursor, EventMode } from "../../enums";

const ApplicationStory = () => {
  const { application } = useApplication();

  return (
    <>
      <SpriteComponent
        spriteSheet={"/assets/human/human.json"}
        texture={"head_n"}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={() => {
          application.stage.tint = 0xff00ff;
        }}
      />
    </>
  );
};

const meta: Meta<typeof ApplicationStory> = {
  title: "Hooks/Application",
  component: ApplicationStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ApplicationStory>;

export const Primary: Story = {
  args: {},
};
