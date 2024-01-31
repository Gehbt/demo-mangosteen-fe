import { faker } from "@faker-js/faker/locale/zh_CN";
import { Mock } from "./mock";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { createVNode } from "vue";
import { fakerZH_CN } from "@faker-js/faker";

export const mockTagCreate: Mock<ItemType> = (
  config: AxiosRequestConfig<ItemType>
) => {
  const json = config.data;
  // todo 使用报错而不是返回
  if (!json) {
    return { data: null, status: 500 } as AxiosResponse<null>;
  } else if (!json.tags_id) {
    return { data: null, status: 422 } as AxiosResponse<null>;
  }
  return {
    data: {
      id: faker.number.int(),
      user_id: 1312,
      amount: 9999,
      note: null,
      tags_id: json.tags_id,
      happen_at: fakerZH_CN.date.anytime(),
      updated_at: fakerZH_CN.date.anytime(),
      created_at: fakerZH_CN.date.anytime(),
      kind: json.kind,
    },
    status: 200,
  } as AxiosResponse<ItemType>;
};

const createTag: <T extends TagKindType>(
  ctxId: number, //* state
  n: number,
  kind: T,
  attr?: Record<string, any>
) => TagType[] = (ctxId = 0, n = 1, kind, attrs) =>
  Array.from<TagType>({ length: n }).map<TagType>((_, index) => ({
    id: index + ctxId,
    name: fakerZH_CN.lorem.word(),
    sign: faker.internet.emoji(),
    kind,
    ...attrs,
  }));
// TODO: reduce param: page
// param: page 仅用于代表于第1次和第2次请求
const createPager = (page: number, ownedTagNumber: number) => {
  let wantTagNumberThisPage = 0;
  // page = ownedTagNumber `div` 25
  if (ownedTagNumber <= 30) {
    wantTagNumberThisPage = 30 - ownedTagNumber < 25 ? 30 - ownedTagNumber : 25;
  }
  return {
    wantTagNumberThisPage,
    pager: {
      page: Math.floor(ownedTagNumber / 25) + 1, // 对应 ownedTagNumber=0 前面除法计算的值为0
      pre_page: 25,
      count: 30,
    },
  };
};
export const mockTagIndex: Mock<Resources<TagType>> = (
  config: AxiosRequestConfig
) => {
  console.log("mockTagIndex.config :>> ", config);
  const { kind, ownedTagNumber } = config.params as {
    ownedTagNumber: number;
    kind: "expenses" | "income";
    _mock: "tagIndex";
  };

  const { wantTagNumberThisPage, pager } = createPager(1, ownedTagNumber);
  if (wantTagNumberThisPage === 0) {
    return { data: null, status: 204 } as AxiosResponse<null>;
  }

  return {
    data: {
      resources: createTag(ownedTagNumber, wantTagNumberThisPage, kind),
      kind,
      pager,
    },
    status: 200,
  } as AxiosResponse<Resources<TagType>>;
};
// export const mockPager
