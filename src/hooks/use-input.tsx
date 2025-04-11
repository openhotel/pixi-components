import { createContext, useCallback, useContext, useEffect } from "react";
import type React from "react";
import { useEvents } from ".";
import { Event } from "../enums";

type InputState = {
  focus: () => void;
  blur: () => void;
};

const InputContext = createContext<InputState>(undefined);

type InputProps = {
  children: React.ReactNode;
};

export const InputProvider: React.FunctionComponent<InputProps> = ({
  children,
}) => {
  const { emit } = useEvents();

  const getInput = useCallback(
    () => document.getElementsByTagName("input")[0],
    [],
  );

  const onPaste = useCallback(
    ({ clipboardData }: ClipboardEvent) => {
      const pastedText = clipboardData.getData("text/plain");
      emit(Event.PASTE, pastedText);
    },
    [emit],
  );

  useEffect(() => {
    const input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = "-20px";
    input.style.top = "-20px";
    input.style.zIndex = "-10";
    document.body.append(input);

    input.addEventListener("paste", onPaste);
    return () => {
      input.removeEventListener("paste", onPaste);
    };
  }, [onPaste]);

  const focus = useCallback(() => {
    const input = getInput();
    input.value = "";
    setTimeout(() => {
      input.focus();
    }, 1);
  }, [getInput]);

  const blur = useCallback(() => {
    const input = getInput();
    input.blur();
    input.value = "";
  }, [getInput]);

  return (
    <InputContext.Provider
      value={{
        focus,
        blur,
      }}
      children={children}
    />
  );
};

export const useInput = (): InputState => useContext(InputContext);
