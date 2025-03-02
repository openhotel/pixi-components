import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Event } from "../enums";
import { EVENT_MAP } from "../consts";

type Callback<Data extends unknown> = (data?: Data) => void | Promise<void>;

type EventsState = {
  on: <Data extends unknown>(
    event: Event | string,
    callback: Callback<Data>,
  ) => () => void;
  emit: <Data extends unknown>(event: Event | string, data?: Data) => void;
};

const EventsContext = React.createContext<EventsState>(undefined);

type EventsProps = {
  children: ReactNode;
};

export const EventsProvider: React.FunctionComponent<EventsProps> = ({
  children,
}) => {
  const eventMapRef = useRef<Record<Event, ((data?: any) => void)[]>>(
    //@ts-ignore
    {},
  );

  const on = useCallback(
    (event: Event | string, callback: Callback<unknown>) => {
      let callbackId = null;

      if (!eventMapRef.current[event]) eventMapRef.current[event] = [];

      callbackId = eventMapRef.current[event].push(callback) - 1;

      return () =>
        (eventMapRef.current[event] = eventMapRef.current[event].map(
          (callback, $callbackId) =>
            $callbackId === callbackId ? null : callback,
        ));
    },
    [],
  );

  const emit = useCallback((event: Event | string, data?: any) => {
    if (!eventMapRef.current[event]) return;

    for (const callback of eventMapRef.current[event].filter(Boolean))
      callback(data);
  }, []);

  useEffect(() => {
    let callbackMap = {};
    for (const [
      nativeEvent,
      customEvent,
      stopPropagation,
      preventDefault,
    ] of EVENT_MAP) {
      callbackMap[nativeEvent] = (event: any) => {
        if (stopPropagation) event?.stopPropagation?.();
        if (preventDefault) event?.preventDefault?.();
        emit(customEvent, event);
      };
      window.addEventListener(nativeEvent, callbackMap[nativeEvent]);
    }

    return () => {
      for (const [nativeEvent] of EVENT_MAP) {
        window.removeEventListener(nativeEvent, callbackMap[nativeEvent]);
      }
    };
  }, [emit]);

  return (
    <EventsContext.Provider
      value={{
        emit,
        // @ts-ignore
        on,
      }}
      children={children}
    />
  );
};

export const useEvents = (): EventsState => useContext(EventsContext);
