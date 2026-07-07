import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FC, ReactNode } from "react";
import { Application } from "@pixi/react";
import type { ApplicationRef } from "@pixi/react";
import type { Renderer, Application as PixiApplication } from "pixi.js";
import { AbstractRenderer, TextureSource } from "pixi.js";
import {
  WindowProvider,
  TexturesProvider,
  EventsProvider,
  CursorProvider,
  useEvents,
  ContextProvider,
  InputProvider,
} from ".";
import { Event } from "../enums";
import { SystemProvider } from ".";

type ApplicationState = {
  /**
   * @deprecated Prevent the use of application in favor of adding more props
   */
  application: PixiApplication<Renderer>;

  scale?: number;
};

const ApplicationContext = createContext<ApplicationState>(undefined);

type ApplicationProps = {
  children: ReactNode;

  scale?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  preference?: "webgpu" | "webgl";
};

const WrapperApplicationProvider: FC<ApplicationProps & ApplicationState> = ({
  children,
  scale,
  application,
  ...props
}) => {
  const { emit } = useEvents();

  useEffect(() => {
    let requestAnimationId: number;
    let $lastUpdate = 0;
    let $fps: number = 0;
    let $lastFPS: number = 0;
    let $frames = 0;
    let $prevTime = 0;

    const update = (currentUpdate: number) => {
      currentUpdate *= 0.01; // convert to ms
      let deltaTime = currentUpdate - $lastUpdate;
      $lastUpdate = currentUpdate;

      emit(Event.TICK, deltaTime);
      application.render();

      // FPS
      $frames++;

      let time = (performance || Date).now();

      if (time >= $prevTime + 1000) {
        const fps = ($frames * 1000) / (time - $prevTime);
        $prevTime = time;
        $frames = 0;
        $fps = Math.round(fps);
      }

      if ($fps !== $lastFPS) {
        emit(Event.FPS, $fps);
        $lastFPS = $fps;
      }
      requestAnimationId = requestAnimationFrame(update);
    };

    requestAnimationId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(requestAnimationId);
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        application,
        ...props,
      }}
    >
      <SystemProvider>
        <WindowProvider scale={scale}>
          <CursorProvider>
            <ContextProvider>
              <InputProvider>
                <TexturesProvider>{children}</TexturesProvider>
              </InputProvider>
            </ContextProvider>
          </CursorProvider>
        </WindowProvider>
      </SystemProvider>
    </ApplicationContext.Provider>
  );
};

export const ApplicationProvider: FC<ApplicationProps> = ({
  backgroundColor,
  backgroundAlpha = 0,
  preference = "webgpu",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const $application = useRef<ApplicationRef>(null);

  const onInit = useCallback(
    (application: PixiApplication) => {
      application.stage.sortableChildren = true;
      application.stage.eventMode = "static";

      application.ticker.autoStart = false;
      application.ticker.stop();

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

  useEffect(() => {
    if (!application || !backgroundColor) return;

    application.renderer.background.color = backgroundColor;
  }, [backgroundColor, application]);

  return (
    <EventsProvider>
      <Application
        ref={$application}
        sharedTicker={false}
        preference={preference}
        onInit={onInit}
        antialias={true}
        backgroundColor={backgroundColor}
        backgroundAlpha={backgroundAlpha}
      >
        {isLoaded ? (
          <WrapperApplicationProvider {...props} application={application} />
        ) : null}
      </Application>
    </EventsProvider>
  );
};

export const useApplication = (): ApplicationState =>
  useContext(ApplicationContext);
