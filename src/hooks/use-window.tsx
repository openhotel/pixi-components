import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode, FC } from "react";
import { useApplication } from "./use-application";
import type { Size } from "../types";
import { useEvents } from "./use-events";
import { Event } from "../enums";

type WindowState = {
  getScale: () => number;
  setScale: (scale: number) => void;

  normalizeValue: (value: number) => number;

  getSize: () => Size;
};

const WindowContext = createContext<WindowState>(undefined);

type WindowProps = {
  children: ReactNode;
  scale?: number;
};

const _getOddExtra = (value: number): number =>
  (value % 2 === 1 ? 1 : 0) + value;

export const WindowProvider: FC<WindowProps> = ({ children, scale = 2 }) => {
  const { application } = useApplication();
  const { emit } = useEvents();

  const sizeRef = useRef<Size>({ width: 0, height: 0 });
  const [$scale, setScale] = useState<number>(scale);

  const $getSize = useCallback(() => {
    const { offsetHeight, offsetWidth } = application.canvas.parentElement;

    return {
      width: _getOddExtra(Math.round(offsetWidth / $scale)),
      height: _getOddExtra(Math.round(offsetHeight / $scale)),
    };
  }, [application, $scale]);

  const $resize = useCallback(() => {
    if (!application) return;

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

    const $size = $getSize();
    sizeRef.current = $size;
    emit<Size>(Event.RESIZE, $size);

    application.renderer.resolution = $scale * Math.round(devicePixelRatio);
    application.canvas.style.display = "absolute";
    application.canvas.style.width = `${Math.round($size.width * $scale)}px`;
    application.canvas.style.height = `${Math.round($size.height * $scale)}px`;

    application.renderer.resize($size.width, $size.height);
  }, [application, $getSize, emit]);

  const normalizeValue = useCallback(
    (value: number) => Math.round(value / scale),
    [scale],
  );

  useEffect(() => {
    window.addEventListener("resize", $resize);

    $resize();
    return () => {
      window.removeEventListener("resize", $resize);
    };
  }, [$resize]);

  const getScale = useCallback(() => $scale, [$scale]);
  const getSize = useCallback(() => sizeRef.current, []);

  useEffect(() => {
    setScale(scale);
  }, [scale]);

  return (
    <WindowContext.Provider
      value={{
        getScale,
        setScale,

        normalizeValue,

        getSize,
      }}
      children={children}
    />
  );
};

export const useWindow = (): WindowState => useContext(WindowContext);
