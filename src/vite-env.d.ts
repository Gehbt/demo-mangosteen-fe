// declare module "*.vue" {
//   import { ComponentOptions } from "vue";
//   const componentOptions: ComponentOptions;
//   export default componentOptions;
// }
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
type JSONValue =
  | null
  | boolean
  | string
  | number
  | JSONValue[]
  | Record<string, JSONValue>;

type OnAxiosError = {
  error_message: string;
};
type JWTResponseType = { jwt: string };
type TagKind = "expenses" | "income";
type DateScope = "month" | "last_month" | "year" | "custom";

// 通用基本单元定义
interface Resource<T> {
  resource: T;
}
interface Resources<T extends unknown> {
  resources: T[];
  pager: {
    page: number;
    pre_page: number; // 每页个数
    count: number; // 总数
  };
}
// Model定义
interface ITimeCUD {
  deleted_at?: Date | string | null;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
interface ITag<T extends TagKind = TagKind> extends ITimeCUD {
  id: number;
  name: string;
  sign: string;
  kind: T;
}
type TagQueryType<T extends TagKind = TagKind> = {
  name: string;
  sign: string;
  kind: T;
};
interface IItemUser extends IItem {
  user_id: number;
  tag_ids: number[];
  note?: null;
}
// 这里的 ItemType 是错误的设计,实际上 item 应该拥有一个Tags[] 成员(一般长度为1)存储tag的内容而不是继承, 并且amount应该分开展示
interface IItem extends ITag {
  /** **单位为分** 为 *100 了的金额 */
  amount: number;
  happen_at: Date | string | null; // read
}
type ItemQueryType<T extends TagKind = TagKind> = {
  kind: T;
  tag_ids: string; // Array<number>.stringify
  happen_at: string | null; // Date.toISOString
  amount: string;
};
type SignInQueryType = {
  email: string;
  code: string;
};

type UserType = {
  email: string;
  user_id: number;
  name: string;
};
// interface AmountType {
//   amount_income: number;
//   amount_expenses: number;
// }
type LineChartTypeOne = {
  happen_at: string;
  amount: number;
  kind: TagKind;
};
type LineChartType = LineChartTypeOne[];
type LineChartViewTypeOne = [date_str: string, price: string];
type LineChartViewType = LineChartViewTypeOne[];

type PieChartTypeOne = {
  amount: number;
  tag: { id: number; name: string; sign: string };
  tag_id: number;
};
type PieChartType = PieChartTypeOne[];
type PieChartViewTypeOne = { value: number; name: string; id: number };
type PieChartViewType = PieChartViewTypeOne[];

type BarChartTypeOne = PieChartTypeOne;
type BarChartType = BarChartTypeOne[];
