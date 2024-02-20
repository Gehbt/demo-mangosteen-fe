import type { RulesType } from "@/composables";

export const emailRules = [
  {
    key: "email",
    clan: "required",
    msg: "必填",
    required: true,
  },
  {
    reversePattern: true,
    key: "email",
    clan: "pattern",
    msg: "格式错误",
    pattern:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
] as const satisfies RulesType<SignInQueryType>;
export const codeRules = [
  {
    key: "code",
    clan: "required",
    msg: "必填",
    required: true,
  },
  {
    key: "code",
    clan: "pattern",
    msg: "长度错误",
    pattern: /^(.{6})$/,
    reversePattern: true,
  },
] as const satisfies RulesType<SignInQueryType>;
