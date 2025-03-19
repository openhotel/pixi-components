import { useCallback, useState } from "react";

export const useUpdate = () => {
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const update = useCallback(() => {
    setLastUpdate(performance.now());
  }, [setLastUpdate]);

  return {
    update,
    lastUpdate,
  };
};
