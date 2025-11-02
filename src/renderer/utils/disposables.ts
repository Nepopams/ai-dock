type Disposable = () => void;

type EventTargetLike = {
  addEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;
  removeEventListener?: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ) => void;
};

type EmitterLike = {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  off?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

export const createDisposableBag = () => {
  const disposables: Disposable[] = [];

  const add = (disposable?: void | null | Disposable) => {
    if (typeof disposable === "function") {
      disposables.push(disposable);
    }
    return disposable;
  };

  const disposeAll = () => {
    while (disposables.length) {
      const disposable = disposables.pop();
      if (!disposable) {
        continue;
      }
      try {
        disposable();
      } catch (error) {
        console.error("[disposables] cleanup failed", error);
      }
    }
  };

  const addEventListener = (
    target: EventTargetLike | null | undefined,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => {
    if (!target || typeof target.addEventListener !== "function") {
      return;
    }
    target.addEventListener(type, listener, options);
    add(() => target.removeEventListener?.(type, listener, options));
  };

  const addEmitterListener = (
    emitter: EmitterLike | null | undefined,
    event: string,
    listener: (...args: unknown[]) => void
  ) => {
    if (!emitter || typeof emitter.on !== "function") {
      return;
    }
    emitter.on(event, listener);
    add(() => {
      if (typeof emitter.off === "function") {
        emitter.off(event, listener);
      } else {
        emitter.removeListener?.(event, listener);
      }
    });
  };

  const trackTimeout = (id: ReturnType<typeof setTimeout> | null | undefined) => {
    if (id !== null && id !== undefined) {
      add(() => clearTimeout(id));
    }
  };

  const trackInterval = (id: ReturnType<typeof setInterval> | null | undefined) => {
    if (id !== null && id !== undefined) {
      add(() => clearInterval(id));
    }
  };

  const trackAnimationFrame = (id: number | null | undefined) => {
    if (typeof id === "number") {
      add(() => cancelAnimationFrame(id));
    }
  };

  return {
    add,
    disposeAll,
    addEventListener,
    addEmitterListener,
    trackTimeout,
    trackInterval,
    trackAnimationFrame
  };
};

