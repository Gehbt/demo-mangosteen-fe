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
    kind: kind,
    ...attrs,
  }));
const createPager = (page: number, ownedNumber: number) => {
  let tagNumberThisPage = 0;
  // TODO: reduce param
  if (ownedNumber <= 30) {
    tagNumberThisPage = 30 > page * 25 ? 25 : 30 - (page - 1) * 25;
  }
  return {
    tagNumberThisPage,
    pager: {
      page,
      pre_page: 25,
      count: 30,
    },
  };
};
export const mockTagIndex: Mock<Resources<TagType>> = (
  config: AxiosRequestConfig
) => {
  const { kind, ownedNumber } = config.params as {
    ownedNumber: number;
    kind: "expenses" | "income";
    _mock: "tagIndex";
  };
  console.log("config :>> ", config);
  // const id = ref(0);
  // const createId = () => {
  //   id.value += 1;
  //   return id.value;
  // };
  const { tagNumberThisPage, pager } = createPager(1, ownedNumber);
  if (kind === "expenses") {
    return {
      data: {
        resources: createTag(tagNumberThisPage, "expenses"),
        pager,
      },
      status: 200,
    } as AxiosResponse<Resources<TagType<"expenses">>>;
  } else if (kind === "income") {
    return {
      data: {
        resources: createTag(tagNumberThisPage, "income"),
        pager,
      },
      status: 200,
    } as AxiosResponse<Resources<TagType<"income">>>;
  } else {
    return { data: null, status: 400 } as AxiosResponse<null>;
  }
};
const mockTagIndexMore = (config: AxiosRequestConfig) => {
  const { kind, ownedNumber } = config.params;
  const { tagNumberThisPage, pager } = createPager(2, ownedNumber);
  if (tagNumberThisPage === 0) {
    return { data: null, status: 304 } as AxiosResponse<null>;
  }
  if (kind === "expenses") {
    return {
      data: {
        resources: createTag(tagNumberThisPage, "expenses"),
        pager,
      },
      status: 200,
    } as AxiosResponse<Resources<TagType<"expenses">>>;
  } else if (kind === "income") {
    return {
      data: {
        resources: createTag(tagNumberThisPage, "income"),
        pager,
      },
      status: 200,
    } as AxiosResponse<Resources<TagType<"income">>>;
  } else {
    return { data: null, status: 400 } as AxiosResponse<null>;
  }
};
// export const mockPager
