export const throttle = (fn: (...args: unknown[]) => void, time: number) => {
  let timer: number | undefined;
  return (...args : unknown[]) => {
    if (timer) {
      return;
    } else {
      fn(...args);
      timer = setTimeout(() => {
        timer = undefined;
      }, time);
    }
  };
};
