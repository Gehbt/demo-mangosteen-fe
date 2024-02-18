import type { Mock } from "Mock-Type";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { fakerZH_CN } from "@faker-js/faker";

const OFFSET = 1;
const mkTag: <T extends TagKindType>(
  ctxId: number, //* state
  n: number,
  kind: T,
  attr?: Record<string, any>
) => TagType[] = (ctxId = 0, n = 1, kind, attrs) =>
  Array.from<TagType>({ length: n }).map((_, index) => ({
    id: index + ctxId + OFFSET,
    name: fakerZH_CN.commerce.product(),
    sign: fakerZH_CN.internet.emoji(),
    kind,
    ...attrs,
  }));
// TODO: reduce param: page
// param: page 仅用于代表于第1次和第2次请求
export const mkPager = (ownedTagNumber: number) => {
  const maxNumber = 60;
  const onePageNumber = 25;
  let wantTagNumberThisPage = 0;
  // page = ownedTagNumber `div` 25
  if (ownedTagNumber <= maxNumber) {
    wantTagNumberThisPage =
      maxNumber - ownedTagNumber < onePageNumber
        ? maxNumber - ownedTagNumber
        : onePageNumber;
  }
  return {
    wantNumberThisPage: wantTagNumberThisPage,
    pager: {
      page: Math.floor(ownedTagNumber / onePageNumber) + 1, // 对应 ownedTagNumber=0 前面除法计算的值为0
      pre_page: onePageNumber,
      count: maxNumber,
    },
  };
};
export const mockTagIndex: Mock<Resources<TagType>> = (
  config: AxiosRequestConfig
) => {
  // console.log("mockTagIndex.config :>> ", config);
  const { kind, ownedTagNumber } = config.params as {
    ownedTagNumber: number;
    kind: "expenses" | "income";
  };

  const { wantNumberThisPage: wantTagNumberThisPage, pager } =
    mkPager(ownedTagNumber);
  if (wantTagNumberThisPage === 0) {
    return { data: null, status: 204 } as AxiosResponse<null>;
  }

  return {
    data: {
      resources: mkTag(ownedTagNumber, wantTagNumberThisPage, kind),
      pager,
    },
    status: 200,
  } as AxiosResponse<Resources<TagType>>;
};
// TODO: return None
export const mockTagCreate: Mock<Resource<TagType>> = (config) => {
  console.log("mockTagCreate :>> ", config.data);
  const { kind, name, sign } = config.data as {
    // todo: type define
    kind: TagKindType;
    name: string;
    sign: string;
  };
  return {
    data: {
      resource: {
        id: 5,
        kind,
        name,
        sign,
        created_at: new Date("2023-12-13").toISOString(),
        deleted_at: null,
        updated_at: new Date().toISOString(),
      },
    },
    status: 200,
  } as AxiosResponse<Resource<TagType>>;
};

export const mockTagQuery: Mock<Resource<TagType>> = (config) => {
  console.log("mockTagCreate :>> ", config);
  const { kind, id } = config.params as {
    kind: TagKindType;
    id: number;
  };
  return {
    data: {
      resource: {
        id,
        kind,
        name: fakerZH_CN.word.noun(),
        sign: fakerZH_CN.internet.emoji(),
        created_at: new Date("2023-12-13").toISOString(),
        deleted_at: null,
        updated_at: new Date().toISOString(),
      },
    },
    status: 200,
  } as AxiosResponse<Resource<TagType>>;
};
// TODO: return None
export const mockTagEdit: Mock<Resource<TagType>> = (config) => {
  console.log("mockTagCreate :>> ", config);
  const { kind, id } = config.params as {
    kind: TagKindType;
    id: number;
  };
  return {
    data: {
      resource: {
        id,
        kind,
        name: fakerZH_CN.word.noun(),
        sign: fakerZH_CN.internet.emoji(),
        created_at: new Date("2023-12-13").toISOString(),
        deleted_at: null,
        updated_at: new Date().toISOString(),
      },
    },
    status: 200,
  } as AxiosResponse<Resource<TagType>>;
};
// just mock
export const mockTagDelete: Mock<null> = (config) => {
  return { status: 204 } as AxiosResponse<null>;
};
