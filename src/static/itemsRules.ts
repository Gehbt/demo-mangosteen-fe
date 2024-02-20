import type { RulesType } from "@/composables";

export const itemsRules: RulesType<ItemQueryType> = [
  {
    clan: "required",
    key: "amount",
    required: true,
    msg: "金额必须填写",
  },
  {
    clan: "required",
    key: "happen_at",
    required: true,
    msg: "时间必须填写",
  },
  { clan: "required", key: "tag_ids", required: true, msg: "tag_ids必须填写" },
  {
    clan: "pattern",
    key: "amount",
    pattern: /^0$/,
    msg: "金额数值不能为0",
  },
  {
    clan: "pattern",
    key: "amount",
    reversePattern: true,
    pattern: /^-?\d{1,10}(\.\d{1,2})?$/,
    msg: "金额数值错误",
  },
  {
    clan: "pattern",
    key: "kind",
    msg: "错误的金额种类",
    pattern: /^expenses|income$/,
    reversePattern: true,
  },
  {
    clan: "pattern",
    key: "tag_ids",
    pattern: /\[\d+(,\s*\d+)*\]/,
    msg: "错误的标签id",
    reversePattern: true,
  },
];
