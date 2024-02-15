import type { Mock } from "Mock-Type";
import { faker } from "@faker-js/faker/locale/zh_CN";
import { AxiosResponse } from "axios";
export const mockSession: Mock<JWTResponse> = (config) => {
  return {
    data: { jwt: faker.string.uuid() },
    status: 200,
  } as AxiosResponse<JWTResponse>;
};
