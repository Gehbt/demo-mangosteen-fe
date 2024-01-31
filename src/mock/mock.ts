import { AxiosRequestConfig, AxiosResponse } from "axios";
export type Mock<T> = (
  config: AxiosRequestConfig
) => AxiosResponse<T> | AxiosResponse<null>;

export * from "./mockSession";
export * from "./mockTag";
