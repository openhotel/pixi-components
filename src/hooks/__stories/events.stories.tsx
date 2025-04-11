import type { Meta, StoryObj } from "@storybook/react";
import { SpriteTextComponent } from "../../components";
import { useEvents } from "../../hooks";
import { Event } from "../../enums";
import { useEffect, useState } from "react";
import type { Size } from "../../types";

const EventsStory = () => {
  const { on } = useEvents();

  const [text, setText] = useState<string>("Resize me!");
  const [text2, setText2] = useState<string>("Move pointer!");
  const [text3, setText3] = useState<string>("Move cursor!");
  const [text4, setText4] = useState<string>("FPS!");

  useEffect(() => {
    const removeOnResize = on<Size>(Event.RESIZE, ({ width, height }) => {
      setText(`width: ${width} height: ${height}`);
    });
    const removeOnPointerMove = on<PointerEvent>(
      Event.POINTER_MOVE,
      (event) => {
        setText2(`pointer x: ${event.x} y: ${event.y}`);
      },
    );
    const removeOnCursorMove = on<PointerEvent>(Event.CURSOR_MOVE, (event) => {
      setText3(`cursor x: ${event.x} y: ${event.y}`);
    });
    const removeOnFPS = on<number>(Event.FPS, (fps) => {
      setText4(`${fps}FPS`);
    });
    return () => {
      removeOnResize();
      removeOnPointerMove();
      removeOnCursorMove();
      removeOnFPS();
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
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={text3}
        position={{
          y: 16,
        }}
      />
      <SpriteTextComponent
        spriteSheet={"/assets/fonts/default-font.json"}
        text={text4}
        position={{
          y: 24,
        }}
      />
    </>
  );
};

const meta: Meta<typeof EventsStory> = {
  title: "Hooks/Events",
  component: EventsStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof EventsStory>;

export const Primary: Story = {
  args: {},
};
