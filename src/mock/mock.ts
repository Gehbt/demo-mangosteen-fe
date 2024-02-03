import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
export type Mock<T> = (
  config: InternalAxiosRequestConfig
) => AxiosResponse<T | null> | AxiosError<OnAxiosError>;

export * from "./mockSession";
export * from "./mockTag";
export * from "./mockItem";
