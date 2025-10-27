import { useEffect, useRef } from "react";
import { useDockStore } from "../store/useDockStore";

export function usePromptsSync() {
  const loadPrompts = useDockStore((state) => state.actions.loadPrompts);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    void loadPrompts();
  }, [loadPrompts]);
}
