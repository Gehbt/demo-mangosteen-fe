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
interface TagType<T extends TagKindType = TagKindType> extends TimeCUD {
  id: number;
  name: string;
  sign: string;
  kind: T;
}
interface Resources<T extends unknown> {
  resources: T[];
  kind: TagKindType;
  pager: {
    page: number;
    pre_page: number; // 每页个数
    count: number; // 总数
  };
}

interface ItemType extends TagType {
  user_id: number;
  amount: number;
  tags_id: number[];
  happen_at: Date | string | null; // read
  kind: TagKindType;
  note: null;
}
interface Resource<T> {
  resource: T;
}
interface TimeCUD {
  deleted_at?: Date | string | null;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

type OnAxiosError = {
  error_message: string;
};

type JWTResponse = { jwt: string };
