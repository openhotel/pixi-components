import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApplication } from "./use-application";
import { Size } from "../types";

type WindowState = {
  scale: number;
  setScale: (scale: number) => void;

  getBounds: () => Size;
};

const WindowContext = React.createContext<WindowState>(undefined);

type WindowProps = {
  children: ReactNode;
  scale?: number;
};

export const WindowProvider: React.FunctionComponent<WindowProps> = ({
  children,
  scale = 2,
}) => {
  const { application } = useApplication();

  const [$scale, $setScale] = useState<number>();

  const $getBounds = useCallback(() => {
    const _getOddExtra = (value: number): number =>
      (value % 2 === 1 ? 1 : 0) + value;

    const parent = application.canvas.parentElement;

    //TODO safe area
    parent.style.overflow = "hidden";
    // parent.style.position = "absolute";
    // parent.style.top = "env(safe-area-inset-top, 0px)";
    // parent.style.left = "env(safe-area-inset-left, 0px)";
    parent.style.width = "100vw ";
    //calc(- env(safe-area-inset-right, 0px) - env(safe-area-inset-left, 0px))
    parent.style.height = "100vh";
    // "calc(100vh - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))";

    const { offsetHeight, offsetWidth } = application.canvas.parentElement;

    return {
      width: _getOddExtra(Math.round(offsetWidth / $scale)),
      height: _getOddExtra(Math.round(offsetHeight / $scale)),
    };
  }, [$scale]);

  const $resize = useCallback(() => {
    if (!application) return;

    const { width, height } = $getBounds();

    application.renderer.resolution = $scale * Math.round(devicePixelRatio);
    application.canvas.style.display = "absolute";
    application.canvas.style.width = `${Math.round(width * $scale)}px`;
    application.canvas.style.height = `${Math.round(height * $scale)}px`;

    application.renderer.resize(width, height);
  }, [application, $getBounds]);

  useEffect(() => {
    window.addEventListener("resize", $resize);

    $resize();
    return () => {
      window.removeEventListener("resize", $resize);
    };
  }, [$resize]);

  useEffect(() => {
    $setScale(scale);
  }, [scale, $setScale]);

  return (
    <WindowContext.Provider
      value={{
        scale: $scale,
        setScale: $setScale,

        getBounds: $getBounds,
      }}
      children={children}
    />
  );
};

export const useWindow = (): WindowState => useContext(WindowContext);
