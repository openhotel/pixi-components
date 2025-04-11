import {
  createContext,
  useCallback,
  useContext as $$useContext,
  useRef,
} from "react";
import type React from "react";
import type { DisplayObjectRefProps } from "../types";

type ContextState = {
  add: (
    displayObject: DisplayObjectRefProps<unknown>,
    onFocus: Function,
    onBlur: Function,
  ) => {
    remove: Function;
    focus: Function;
    blur: Function;
  };
  blur: Function;
};

const ContextContext = createContext<ContextState>(undefined);

type ContextProps = {
  children: React.ReactNode;
};

export const ContextProvider: React.FunctionComponent<ContextProps> = ({
  children,
}) => {
  const contextSelectedIndexRef = useRef<number>(null);
  const contextCallbackListRef = useRef<
    {
      displayObject: DisplayObjectRefProps<unknown>;
      focus: Function;
      blur: Function;
    }[]
  >([]);

  const add = useCallback(
    (
      displayObject: DisplayObjectRefProps<unknown>,
      onFocusCallback: Function,
      onBlurCallback: Function,
    ) => {
      const index =
        contextCallbackListRef.current.push({
          displayObject,
          focus: onFocusCallback,
          blur: onBlurCallback,
        }) - 1;

      return {
        remove: () => {
          if (index === contextSelectedIndexRef.current)
            contextSelectedIndexRef.current = null;
          contextCallbackListRef.current = contextCallbackListRef.current.map(
            (callbackData, $index) => (index === $index ? null : callbackData),
          );
        },
        focus: () => {
          contextCallbackListRef?.current[
            contextSelectedIndexRef?.current
          ]?.blur?.();
          contextSelectedIndexRef.current = index;
          onFocusCallback();
        },
        blur: () => {
          if (index !== contextSelectedIndexRef.current) return;

          contextCallbackListRef?.current[
            contextSelectedIndexRef?.current
          ]?.blur?.();
          contextSelectedIndexRef.current = null;
        },
      };
    },
    [],
  );
  const blur = useCallback(() => {
    contextCallbackListRef?.current[contextSelectedIndexRef?.current]?.blur?.();
  }, []);

  return (
    <ContextContext.Provider
      value={{
        add,
        blur,
      }}
      children={children}
    />
  );
};

export const useContext = (): ContextState => $$useContext(ContextContext);
