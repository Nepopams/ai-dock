export const debounce = <T extends (...args: any[]) => void>(fn: T, delayMs: number): T => {
  let timer: NodeJS.Timeout | null = null;
  const debounced = ((...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, Math.max(0, delayMs));
  }) as T;
  return debounced;
};
