import { Meta, StoryObj } from "@storybook/react";
import { AnimatedSpriteComponent } from "./animated-sprite.component";
import { GraphicType, PlayStatus } from "../../../enums";
import { useCallback, useState } from "react";
import { GraphicsComponent } from "../graphics";

const meta: Meta<typeof AnimatedSpriteComponent> = {
  title: "Components/Core/Animated Sprite",
  component: AnimatedSpriteComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof AnimatedSpriteComponent>;

export const TurnLeftAndStopWithMask: Story = {
  args: {
    spriteSheet: "/assets/fighter/fighter.json",
    animation: "turnLeft",
    playStatus: PlayStatus.PLAY_AND_STOP,
    mask: (
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={100}
        height={150}
      />
    ),
  },
};

export const TurnLeftAndStop: Story = {
  args: {
    spriteSheet: "/assets/fighter/fighter.json",
    animation: "turnLeft",
    playStatus: PlayStatus.PLAY_AND_STOP,
  },
};

export const RollRightLoop: Story = {
  args: {
    spriteSheet: "/assets/fighter/fighter.json",
    animation: "rollRight",
    playStatus: PlayStatus.PLAY,
  },
};

export const SlowerRollRightLoop: Story = {
  args: {
    spriteSheet: "/assets/fighter/fighter.json",
    animation: "rollRight",
    playStatus: PlayStatus.PLAY,
    animationSpeed: 0.5,
  },
};

export const FasterRollRightLoop: Story = {
  args: {
    spriteSheet: "/assets/fighter/fighter.json",
    animation: "rollRight",
    playStatus: PlayStatus.PLAY,
    animationSpeed: 5,
  },
};

//@ts-ignore
export const ExtendedTurns: Story = () => {
  const [animation, setAnimation] = useState("rollRight");

  const onComplete = useCallback(() => {
    setTimeout(() => {
      setAnimation((animation) =>
        animation === "rollRight" ? "rollLeft" : "rollRight",
      );
    }, 1000);
  }, [setAnimation]);

  return (
    <AnimatedSpriteComponent
      spriteSheet="/assets/fighter/fighter.json"
      animation={animation}
      onComplete={onComplete}
      animationSpeed={0.7}
    />
  );
};
