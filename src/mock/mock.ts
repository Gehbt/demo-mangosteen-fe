import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
export type Mock<T> = (
  config: InternalAxiosRequestConfig
) => AxiosResponse<T | null> | AxiosError;

export * from "./mockSession";
export * from "./mockTag";
export * from "./mockItem";
