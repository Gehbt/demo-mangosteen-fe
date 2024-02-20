// @deprecated have impl in be
import type { Mock } from "Mock-Type";
import { fakerZH_CN } from "@faker-js/faker";
import type { AxiosResponse } from "axios";
export const mockSession: Mock<JWTResponseType> = (config) => {
  return {
    data: { jwt: fakerZH_CN.string.uuid() },
    status: 200,
  } as AxiosResponse<JWTResponseType>;
};
