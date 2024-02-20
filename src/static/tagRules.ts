import type { RulesType } from "@/composables";

export const tagRules: RulesType<TagQueryType> = [
  {
    clan: "required",
    key: "name",
    msg: "标签名必填",
    required: true,
  },
  {
    clan: "required",
    key: "sign",
    msg: "标签必填",
    required: true,
  },
  {
    clan: "pattern",
    key: "name",
    msg: "标签名太长",
    pattern: /^.{20,100}$/,
  },
  {
    clan: "pattern",
    key: "name",
    msg: "标签名太短",
    pattern: /^.{1,3}$/,
  },
];
