import { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "../../components";
import { useEvents } from "../../hooks";
import { Event } from "../../enums";
import { useEffect, useState } from "react";
import { Size } from "../../types";

const ApplicationStory = () => {
  const { on } = useEvents();

  const [text, setText] = useState<string>("Resize me!");
  const [text2, setText2] = useState<string>("Move cursor!");

  useEffect(() => {
    const removeOnResize = on<Size>(Event.RESIZE, ({ width, height }) => {
      setText(`width: ${width} height: ${height}`);
    });
    const removeOnPointerMove = on<PointerEvent>(
      Event.POINTER_MOVE,
      (event) => {
        setText2(`x: ${event.x} y: ${event.y}`);
      },
    );
    return () => {
      removeOnResize();
      removeOnPointerMove();
    };
  }, [on]);

  return (
    <>
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={text}
      />

      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={text2}
        position={{
          y: 8,
        }}
      />
    </>
  );
};

const meta: Meta<typeof ApplicationStory> = {
  title: "Hooks/Events",
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
