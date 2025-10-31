const debounce = (fn, delayMs) => {
  let timer = null;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, Math.max(0, delayMs));
  };
};

module.exports = { debounce };
