import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Mock } from "./mock";
import { fakerZH_CN } from "@faker-js/faker";

export const mockItemCreate: Mock<ItemType> = (
  config: AxiosRequestConfig<ItemType>
) => {
  // axios post方法 的AxiosRequestConfig的data是序列化的ItemType
  const json = JSON.parse(config.data as unknown as string) as ItemType;
  console.log("json :>> ", config);
  if (!json) {
    throw {
      response: { data: { error_message: "无数据" }, status: 500 },
    } as AxiosError<OnAxiosError>;
  } else if (!json.tags_id || json.tags_id[0] === -1) {
    console.log("json.tags_id :>> ", json.tags_id);
    // 无id
    throw {
      response: { data: { error_message: "未选择tag的id" }, status: 422 },
    } as AxiosError<OnAxiosError>;
  } else if (!json.amount) {
    // 有id 但无账目
    throw {
      response: { data: { error_message: "金额不能为0" }, status: 422 },
    } as AxiosError<OnAxiosError>;
  }
  return {
    data: {
      id: fakerZH_CN.number.int(),
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
