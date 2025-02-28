import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  contextMenuDisabled?: boolean;
};

export const EventsProvider: React.FunctionComponent<EventsProps> = ({
  children,
  contextMenuDisabled,
}) => {
  const [eventMap, setEventMap] = useState<
    Record<Event, ((data?: any) => void)[]>
  >({} as any);

  const on = useCallback(
    (event: Event | string, callback: Callback<unknown>) => {
      let callbackId = null;
      setEventMap((eventMap) => {
        if (!eventMap[event]) eventMap[event] = [];
        callbackId = eventMap[event].push(callback) - 1;
        return eventMap;
      });

      return () =>
        setEventMap((eventMap) => {
          eventMap[event] = eventMap[event].map((callback, $callbackId) =>
            $callbackId === callbackId ? null : callback,
          );
          return eventMap;
        });
    },
    [setEventMap],
  );

  const emit = useCallback(
    (event: Event | string, data?: any) => {
      if (!eventMap[event]) return;

      for (const callback of eventMap[event].filter(Boolean)) callback(data);
    },
    [eventMap],
  );

  useEffect(() => {
    let callbackMap = {};
    for (const [nativeEvent, customEvent, preventDefault] of EVENT_MAP) {
      callbackMap[nativeEvent] = (event: any) => {
        console.log(nativeEvent);
        // if (
        //   nativeEvent === "contextmenu" ? contextMenuDisabled : preventDefault
        // )
        //   event?.preventDefault?.();
        emit(customEvent, event);
      };
      window.addEventListener(nativeEvent, callbackMap[nativeEvent]);
    }

    return () => {
      for (const [nativeEvent] of EVENT_MAP) {
        window.removeEventListener(nativeEvent, callbackMap[nativeEvent]);
      }
    };
  }, [contextMenuDisabled, emit]);

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
