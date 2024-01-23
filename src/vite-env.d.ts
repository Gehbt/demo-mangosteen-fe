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

type TagKindType = "expenses" | "income";
type DateScope = "month" | "last_month" | "year" | "custom";
type TagType<T extends TagKindType = TagKindType> = {
  id: number;
  name: string;
  sign: string;
  kind: T;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};
type Resources<T extends unknown> = {
  resources: T[];
  pager: {
    page: number;
    pre_page: number; // 每页个数
    count: number; // 总数
  };
};
