import { useMemo } from "react";
import "./style.css";
import { ApplicationProvider, TexturesProvider, WindowProvider } from "../src";
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
  },
};

export default preview;

export const decorators = [
  (renderStory, props) => {
    const scale = useMemo(() => props.globals.scale, [props]);
    return (
      <ApplicationProvider>
        <WindowProvider scale={scale}>
          <TexturesProvider>
            {withConsole()(renderStory)(props)}
          </TexturesProvider>
        </WindowProvider>
      </ApplicationProvider>
    );
  },
];
