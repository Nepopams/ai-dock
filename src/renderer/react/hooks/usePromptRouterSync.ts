import { useEffect, useRef } from "react";
import { useDockStore } from "../store/useDockStore";

export function usePromptRouterSync() {
  const loadServices = useDockStore((state) => state.actions.loadServices);
  const loadHistory = useDockStore((state) => state.actions.loadPromptHistory);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    void loadServices();
    void loadHistory();
  }, [loadServices, loadHistory]);
}
