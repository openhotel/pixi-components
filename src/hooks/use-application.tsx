import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Application, ApplicationRef } from "@pixi/react";
import {
  AbstractRenderer,
  Application as PixiApplication,
  Renderer,
  TextureSource,
} from "pixi.js";
import { WindowProvider, TexturesProvider, EventsProvider } from ".";

type ApplicationState = {
  application: PixiApplication<Renderer>;

  scale?: number;
  contextMenuDisabled?: boolean;
};

const ApplicationContext = React.createContext<ApplicationState>(undefined);

type ApplicationProps = {
  children: ReactNode;

  scale?: number;
  contextMenuDisabled?: boolean;
};

export const ApplicationProvider: React.FC<ApplicationProps> = ({
  children,
  scale,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const $application = useRef<ApplicationRef>(null);

  const onInit = useCallback(
    (application: PixiApplication) => {
      application.stage.sortableChildren = true;
      application.stage.eventMode = "static";

      application.ticker.autoStart = false;
      // application.ticker.stop();

      // Renders crisp pixel sprites
      TextureSource.defaultOptions.scaleMode = "nearest";
      // PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
      AbstractRenderer.defaultOptions.failIfMajorPerformanceCaveat = true;

      setIsLoaded(true);
    },
    [setIsLoaded],
  );

  const application = useMemo(
    () => $application?.current?.getApplication?.(),
    [$application?.current],
  );

  return (
    <Application ref={$application} onInit={onInit} antialias={true}>
      <ApplicationContext.Provider
        value={{
          application,
          ...props,
        }}
      >
        {isLoaded ? (
          <EventsProvider>
            <WindowProvider scale={scale}>
              <TexturesProvider>{children}</TexturesProvider>
            </WindowProvider>
          </EventsProvider>
        ) : null}
      </ApplicationContext.Provider>
    </Application>
  );
};

export const useApplication = (): ApplicationState =>
  useContext(ApplicationContext);
