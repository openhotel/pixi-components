import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "../../components";
import { useCursor } from "../../hooks";

const CursorStory = () => {
  const { position } = useCursor();

  return (
    <>
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={`${position.x}..${position.y}`}
      />
    </>
  );
};

const meta: Meta<typeof CursorStory> = {
  title: "Hooks/Cursor",
  component: CursorStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof CursorStory>;

export const Primary: Story = {
  args: {},
};
