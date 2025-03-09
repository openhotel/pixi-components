import { useEffect, useMemo, useState } from "react";
import "./style.css";
import {
  ApplicationProvider,
  Event,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  SpriteTextComponent,
  useEvents,
  useTextures,
} from "../src";
import { withConsole } from "@storybook/addon-console";

/** @type { import('@storybook/react').Preview } */
const preview = {
  previewHead: (head) => `
    ${head}
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  `,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  globalTypes: {
    scale: {
      description: "scale canvas",
      defaultValue: 2,
      toolbar: {
        title: "Scale 2",
        items: [
          { value: 1, title: "Scale 1" },
          { value: 2, title: "Scale 2" },
          { value: 3, title: "Scale 3" },
          { value: 4, title: "Scale 4" },
          { value: 5, title: "Scale 5" },
          { value: 6, title: "Scale 6" },
        ],
        dynamicTitle: true,
      },
    },
    fps: {
      description: "show fps",
      defaultValue: false,
      toolbar: {
        title: "FPS off",
        items: [
          { value: false, title: "FPS off" },
          { value: true, title: "FPS on" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

const ApplicationWrapper = ({ children, props }) => {
  const { loadSpriteSheet, loadTexture } = useTextures();
  const { on } = useEvents();

  const [loading, setLoading] = useState(true);

  const [fps, setfps] = useState<number>(0);

  const showFPS = useMemo(() => props.globals.fps, [props]);

  useEffect(() => {
    if (!showFPS) return;
    return on<number>(Event.FPS, setfps);
  }, [on, setfps, showFPS]);

  useEffect(() => {
    Promise.all([
      ...[
        "/assets/fonts/default-font.json",
        "/assets/human/human.json",
        "/assets/fighter/fighter.json",
      ].map(loadSpriteSheet),
      ...["/assets/9sprite2.png", "/assets/logo_64x_transparent.png"].map(
        loadTexture,
      ),
    ]).then(() => setLoading(false));
  }, [loadSpriteSheet, loadTexture, setLoading]);

  if (loading) return null;

  return (
    <>
      {children}
      {showFPS ? (
        <FlexContainerComponent
          justify={FLEX_JUSTIFY.END}
          position={{ x: -4, y: 4 }}
        >
          <SpriteTextComponent
            spriteSheet={"/assets/fonts/default-font.json"}
            text={`${fps}FPS`}
          />
        </FlexContainerComponent>
      ) : null}
    </>
  );
};

export const decorators = [
  (renderStory, props) => {
    const scale = useMemo(() => props.globals.scale, [props]);
    // const isConsole = useMemo(() => props.globals.console, [props]);

    return (
      <ApplicationProvider scale={scale}>
        <ApplicationWrapper props={props}>
          {withConsole()(renderStory)(props)}
        </ApplicationWrapper>
      </ApplicationProvider>
    );
  },
];
