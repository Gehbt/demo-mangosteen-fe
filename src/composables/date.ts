export const time = (date = new Date()) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const minute = date.getMinutes().toString();
  const second = date.getSeconds().toString();
  const msecond = date.getMilliseconds().toString();
  const api = {
    format: (pattern: string = "YYYY-MM-DD") => {
      // support: YYYY MM DD HH mm ss SSS
      return pattern
        .replace(/YYYY/, year)
        .replace(/MM/, month)
        .padStart(2, "0")
        .replace(/DD/, day)
        .padStart(2, "0")
        .replace(/HH/, minute)
        .padStart(2, "0")
        .replace(/ss/, second)
        .padStart(2, "0")
        .replace(/SSS/, msecond)
        .padStart(3, "0");
    },
  };
  return api;
};
