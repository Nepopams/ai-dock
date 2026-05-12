import { useEffect } from "react";
import { useDockStore } from "../store/useDockStore";

function Toast() {
  const toast = useDockStore((state) => state.toast);
  const hideToast = useDockStore((state) => state.actions.hideToast);

  useEffect(() => {
    if (!toast.visible) {
      return;
    }
    const timer = setTimeout(() => hideToast(), 2200);
    return () => clearTimeout(timer);
  }, [toast.visible, hideToast]);

  return (
    <div
      id="toast"
      className={`toast toast--info ${toast.visible ? "visible" : "hidden"}`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}

export default Toast;
