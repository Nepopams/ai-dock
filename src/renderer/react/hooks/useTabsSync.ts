import { useEffect, useRef } from "react";
import { useDockStore } from "../store/useDockStore";

export function useTabsSync() {
  const refreshTabs = useDockStore((state) => state.actions.refreshTabs);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;
    void refreshTabs();
  }, [refreshTabs]);
}
