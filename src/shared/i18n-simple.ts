export type ItemsCreateName = "支出" | "收入";
export const i18nTagKind: Record<TagKindType, ItemsCreateName> = {
  expenses: "支出",
  income: "收入",
} as const;

export type ItemsListName = "本月" | "上月" | "今年" | "自定义";
export const i18nDateScope: Record<DateScope, ItemsListName> = {
  month: "本月",
  last_month: "上月",
  year: "今年",
  custom: "自定义",
};
export const i18nT = Object.assign({}, i18nTagKind, i18nDateScope);
// console.log("i18nT :>> ", i18nT);
