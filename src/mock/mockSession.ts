import { faker } from "@faker-js/faker/locale/zh_CN";
import { Mock } from "./mock";
import { AxiosResponse } from "axios";
type JWTResponse = { jwt: string };
export const mockSession: Mock<JWTResponse> = (config) => {
  return {
    data: { jwt: faker.string.uuid() },
    status: 200,
  } as AxiosResponse<JWTResponse>;
};
