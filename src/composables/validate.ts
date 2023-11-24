interface FormDataType {
  [k: string]: string | number | undefined | null | FormDataType;
}
interface RuleTypeBase<K extends Record<string, unknown>> {
  key: keyof K;
  msg: string;
  clan: keyof RuleOptionType;
}
interface RuleOptionType {
  required: boolean;
  pattern: RegExp;
}
type RuleOptions = keyof RuleOptionType;
type RuleTypeWrapper<
  K extends Record<string, unknown>,
  T extends RuleOptions
> = T extends RuleOptions
  ? Omit<RuleTypeBase<K>, "clan"> & { clan: T } & {
      [k in T]: RuleOptionType[T];
    }
  : never;
export type RuleType<K extends Record<string, unknown>> = RuleTypeWrapper<
  K,
  RuleOptions
>;
// 多个rule
export type RulesType<K extends Record<string, unknown>> = RuleType<K>[];
// 好难
// Error Spec (eg use TagsCreate.formData) :: {name: string,sign:string}[]
export type InvalidateError<T> = {
  [k in keyof T]?: string[];
};

export function validate<T extends FormDataType>(
  formData: T,
  rules: RulesType<T>
): InvalidateError<T> {
  const errors: InvalidateError<T> = {};
  rules.map((rule) => {
    const { key, msg, clan } = rule;
    const value = formData[key];
    console.log("value :>>", value);
    switch (clan) {
      case "required":
        if (value === undefined || value === null || value.toString() === "") {
          console.log("errof value req:>> ", value);
          errors[key] = errors[key] ?? [];
          errors[key]?.push(msg);
        }
        break;
      case "pattern":
        if (value && rule.pattern.test(value.toString())) {
          console.log("errof value patt:>> ", value);
          errors[key] = errors[key] ?? [];
          errors[key]?.push(msg);
        }
        break;
      default:
        throw new Error("Invalid clan");
    }
  });
  console.log("errors :>> ", errors);
  return errors;
}
