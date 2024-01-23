import { faker } from "@faker-js/faker/locale/zh_CN";
import { Mock } from "./mock";
import { AxiosResponse } from "axios";

export const mockSession: Mock<{ jwt: string }> = (config) => {
  return {
    data: { jwt: faker.string.uuid() },
    status: 200,
  } as unknown as AxiosResponse<{ jwt: string }>;
};
