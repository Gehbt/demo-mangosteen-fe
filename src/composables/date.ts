type TimeUnitType =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";
export interface ITime {
  format: (pattern?: string) => string;
  firstDayOfMonth: () => ITime;
  firstDayOfYear: () => ITime;
  lastDayOfMonth: () => ITime;
  lastDayOfYear: () => ITime;
  getRaw: () => Date;
  add: (amount: number, unit: TimeUnitType) => ITime;
  toISOString(): string;
  getTimestamp(): number;
}
const OFFSET_DAY = 1;
export class Time implements ITime {
  private date: Date;
  constructor(date: Date | string | number | Time | undefined = new Date()) {
    if (typeof date === "undefined") {
      this.date = new Date();
    } else if (date instanceof Time) {
      // 新建数据而不是 引用原数据
      this.date = new Date(date.getRaw());
    } else if (
      // 符合Date的入参
      typeof date === "string" ||
      typeof date === "number" ||
      date instanceof Date
    ) {
      this.date = new Date(date);
    } else {
      throw new Error("Invalid date");
    }
  }
  format(pattern: string = "YYYY-MM-DD") {
    // support: YYYY MM DD HH mm ss SSS
    const year = this.date.getFullYear().toString();
    const month = (this.date.getMonth() + 1).toString();
    const day = this.date.getDate().toString();
    const hour = this.date.getHours().toString();
    const minute = this.date.getMinutes().toString();
    const second = this.date.getSeconds().toString();
    const msecond = this.date.getMilliseconds().toString();

    return pattern
      .replace(/YYYY/, year)
      .replace(/MM/, month.padStart(2, "0"))
      .replace(/DD/, day.padStart(2, "0"))
      .replace(/hh/, hour.padStart(2, "0"))
      .replace(/mm/, minute.padStart(2, "0"))
      .replace(/ss/, second.padStart(2, "0"))
      .replace(/SSS/, msecond.padStart(3, "0"));
  }
  firstDayOfMonth() {
    return new Time(
      new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0)
    );
  }
  firstDayOfYear() {
    return new Time(new Date(this.date.getFullYear(), 0, 1, 0, 0, 0));
  }
  lastDayOfMonth() {
    return new Time(
      new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0, 0, 0, 0)
    );
  }
  lastDayOfYear() {
    return new Time(new Date(this.date.getFullYear() + 1, 0, 0, 0, 0, 0));
  }
  getRaw() {
    return this.date;
  }
  getTimestamp() {
    return this.date.getTime();
  }
  add(amount: number, unit: TimeUnitType) {
    // return new Time but not change this.date
    const date = new Date(this.date.getTime());
    switch (unit) {
      case "year":
        const currentDate = date.getDate();
        date.setDate(1);
        date.setFullYear(date.getFullYear() + amount);
        const targetDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          0,
          0,
          0
        ).getDate(); // 防止出现 2021/2/29
        date.setDate(Math.min(currentDate, targetDate));
        break;
      case "month":
        const d = date.getDate();
        date.setDate(1);
        date.setMonth(date.getMonth() + amount);
        const d2 = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          0,
          0,
          0
        ).getDate(); // 获取那个月的日数
        date.setDate(Math.min(d, d2));
        break;
      case "day":
        date.setDate(date.getDate() + amount);
        break;
      case "hour":
        date.setHours(date.getHours() + amount);
        break;
      case "minute":
        date.setMinutes(date.getMinutes() + amount);
        break;
      case "second":
        date.setSeconds(date.getSeconds() + amount);
        break;
      case "millisecond":
        date.setMilliseconds(date.getMilliseconds() + amount);
        break;
      default:
        throw new Error("Time.add: unknown unit");
    }
    return new Time(date);
  }
  toISOString() {
    return this.date.toISOString();
  }
  static dateSubduct<T extends ITime>(t_start: T, t_end: T) {
    return (
      Time.msToDay(t_start.getTimestamp() - t_end.getTimestamp()) + OFFSET_DAY
    );
  }
  static msToDay(ms: number) {
    return ms / 1000 / 60 / 60 / 24;
  }
}

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
        .replace(/MM/, month.padStart(2, "0"))
        .replace(/DD/, day.padStart(2, "0"))
        .replace(/HH/, minute.padStart(2, "0"))
        .replace(/ss/, second.padStart(2, "0"))
        .replace(/SSS/, msecond.padStart(3, "0"));
    },
  };
  return api;
};
