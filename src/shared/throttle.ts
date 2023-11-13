export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  time: number
) => {
  let timeOutId: number | undefined;
  let result: ReturnType<T>;
  return (...args: Parameters<T>) => {
    if (timeOutId) {
      return result;
    } else {
      result = fn(...args) as ReturnType<T>;
      timeOutId = setTimeout(() => {
        timeOutId = undefined;
      }, time);
    }
  };
};
