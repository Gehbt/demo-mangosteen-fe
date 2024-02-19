interface FormDataType {
  [k: string]: string | number | undefined | null | FormDataType;
}
interface RuleTypeBase<K extends Record<string, unknown>> {
  key: keyof K;
  msg: string;
  clan: keyof RuleOption;
}
interface PatternOption {
  pattern: RegExp;
  reversePattern?: true;
}
interface RequiredOption {
  required: boolean;
}
// 定义所以类型的
type RuleOption = {
  pattern: PatternOption;
  required: RequiredOption;
};

type RuleOptions = keyof RuleOption;
type RuleType<
  K extends Record<string, unknown>,
  Rule extends RuleOptions = RuleOptions
> = Rule extends RuleOptions
  ? Omit<RuleTypeBase<K>, "clan"> & { clan: Rule } & RuleOption[Rule]
  : never;

// 多个rule
export type RulesType<K extends Record<string, unknown>> = RuleType<K>[];
// 好难
// Error Spec (eg use TagsCreate.formData) :: {name: string,sign:string}[]
export type InvalidateError<T> = {
  [k in keyof T]?: string[];
};

export function validate<T extends FormDataType>(
  formData: T,
  rules: RulesType<T>,
  config?: {
    // TODO?: extends
    // reversePattern?: boolean;
  }
): InvalidateError<T> {
  const errors: InvalidateError<T> = {};
  // const reversePattern = config?.reversePattern ?? false;

  rules.map((rule) => {
    const { key, msg, clan } = rule;
    const value = formData[key];
    switch (clan) {
      case "required":
        if (value === undefined || value === null || value.toString() === "") {
          errors[key] = errors[key] ?? [];
          errors[key]?.push(msg);
        }
        break;
      case "pattern":
        // * 匹配成功表示错误
        if (
          (value && rule.pattern.test(value.toString())) !==
          !!rule.reversePattern
        ) {
          errors[key] = errors[key] ?? [];
          errors[key]?.push(msg);
        }
        break;
      default:
        const _: never = clan;
        throw new Error("Invalid clan");
    }
  });
  return errors;
}
export function errorFree(errors: Record<string, string[] | undefined>) {
  return (
    // 一旦errArr存在则返回false
    !Object.values(errors).some((errArr) => errArr && errArr.length > 0)
  );
}
