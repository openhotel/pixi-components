import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "../../components";
import { useCursor } from "../../hooks";
import { useEffect, useState } from "react";

const CursorStory = () => {
  const { getPosition } = useCursor();

  const [pos, setPos] = useState(getPosition());

  useEffect(() => {
    setTimeout(() => {
      setPos(getPosition());
    }, 500);
  }, [getPosition, setPos]);

  return (
    <>
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={`${pos.x}..${pos.y}`}
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
