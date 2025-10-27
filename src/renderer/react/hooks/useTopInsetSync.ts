import { MutableRefObject, useEffect } from "react";

export function useTopInsetSync(
  routerRef: MutableRefObject<HTMLElement | null>,
  tabstripRef: MutableRefObject<HTMLElement | null>
) {
  useEffect(() => {
    const update = () => {
      const routerHeight = routerRef.current?.offsetHeight ?? 0;
      const tabHeight = tabstripRef.current?.offsetHeight ?? 0;
      const total = routerHeight + tabHeight;
      document.documentElement.style.setProperty("--top-inset", `${total}px`);
      if (window.api?.layout?.setTopInset) {
        window.api.layout.setTopInset(total).catch(() => {});
      }
    };

    update();

    const observer = new ResizeObserver(() => update());
    if (routerRef.current) {
      observer.observe(routerRef.current);
    }
    if (tabstripRef.current) {
      observer.observe(tabstripRef.current);
    }

    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [routerRef, tabstripRef]);
}
