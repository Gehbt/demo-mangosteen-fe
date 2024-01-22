import { TagType } from "@/components/ItemsList";
import { faker } from "@faker-js/faker/locale/zh_CN";
import { AxiosRequestConfig, AxiosResponse } from "axios";
export type Mock<T extends unknown> = (
  config: AxiosRequestConfig
) => AxiosResponse<T> | AxiosResponse<null>;
export * from "./mockSession";

export const mockTagCreate: Mock<TagType<"expenses" | "income">> = (config) => {
  const json = JSON.parse(config.data);
  return {
    data: {
      id: faker.number.int(),
      name: json.name,
      sign: json.sign,
      kind: json.kind,
    },
    status: 200,
  } as unknown as AxiosResponse<TagType<"expenses" | "income">>;
};

export const mockTagIndex: Mock<TagType<"expenses" | "income">[]> = (
  config: AxiosRequestConfig
) => {
  console.log("config :>> ", config);
  const params = config.params as {
    kind: "expenses" | "income";
    _mock: "tagIndex";
  };
  const id = ref(0);
  const createId = () => {
    id.value += 1;
    return id;
  };
  const createTag: (n: number, attr?: any) => unknown[] = (n = 1, attrs) =>
    Array.from({ length: n }).map(() => ({
      id: createId(),
      name: faker.lorem.word(),
      sign: faker.internet.emoji(),
      kind: params.kind,
      ...attrs,
    }));

  if (config.params.kind === "expenses") {
    return { data: createTag(25), status: 200 } as unknown as AxiosResponse<
      TagType<"expenses">[]
    >;
  } else if (config.params.kind === "income") {
    return { data: createTag(25), status: 200 } as unknown as AxiosResponse<
      TagType<"income">[]
    >;
  } else {
    return { data: null, status: 400 } as unknown as AxiosResponse<null>;
  }
};
