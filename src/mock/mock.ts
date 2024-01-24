import { faker } from "@faker-js/faker/locale/zh_CN";
import { AxiosRequestConfig, AxiosResponse } from "axios";
export type Mock<T> = (
  config: AxiosRequestConfig
) => AxiosResponse<T> | AxiosResponse<null>;
export * from "./mockSession";

export const mockTagCreate: Mock<TagType> = (config) => {
  const json = JSON.parse(config.data);
  return {
    data: {
      id: faker.number.int(),
      name: json.name,
      sign: json.sign,
      kind: json.kind,
    },
    status: 200,
  } as AxiosResponse<TagType>;
};
const createTag: <T extends TagKindType>(
  n: number,
  kind: T,
  attr?: Record<string, any>
) => TagType[] = (n = 1, kind, attrs) =>
  Array.from<TagType>({ length: n }).map<TagType>((_, index) => ({
    id: index,
    name: faker.lorem.word(),
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

  // const id = ref(0);
  // const createId = () => {
  //   id.value += 1;
  //   return id.value;
  // };
  const { wantTagNumberThisPage, pager } = createPager(1, ownedTagNumber);
  if (wantTagNumberThisPage === 0) {
    return { data: null, status: 204 } as AxiosResponse<null>;
  }

  return {
    data: {
      resources: createTag(wantTagNumberThisPage, kind),
      kind,
      pager,
    },
    status: 200,
  } as AxiosResponse<Resources<TagType>>;
};
// export const mockPager
