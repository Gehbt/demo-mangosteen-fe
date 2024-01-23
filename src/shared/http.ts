import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { mockSession, mockTagCreate, mockTagIndex } from "@/mock/mock";

type GetConfig = Omit<AxiosRequestConfig, "params" | "url" | "method">;
type PostConfig = Omit<AxiosRequestConfig, "url" | "data" | "method">;
type PatchConfig = Omit<AxiosRequestConfig, "url" | "data">;
type DeleteConfig = Omit<AxiosRequestConfig, "params">;
export class Http {
  instance: AxiosInstance;
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
  }
  // read
  get<R = unknown>(
    url: string,
    query?: Record<string, JSONValue>,
    config?: GetConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      params: query,
      method: "GET",
    });
  }
  // create
  post<R = unknown>(
    url: string,
    data?: Record<string, JSONValue>,
    config?: PostConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      data,
      method: "POST",
    });
  }
  // update
  patch<R = unknown>(
    url: string,
    data?: Record<string, JSONValue>,
    config?: PatchConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      data,
      method: "PATCH",
    });
  }
  // update all
  // put() { }
  // destroy
  delete<R = unknown>(
    url: string,
    query?: Record<string, string>,
    config?: DeleteConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      params: query,
      method: "DELECT",
    });
  }
  // CRUD
  // create, read, update, delete
}
const mock: (
  config: InternalAxiosRequestConfig
) => Promise<false | AxiosResponse> = async (
  config: InternalAxiosRequestConfig
) => {
  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.hostname !== "192.168.0.247"
  ) {
    return false;
  }
  switch (config?.params?._mock) {
    case "tagIndex":
      return mockTagIndex(config);
    // case "itemCreate":
    //   [response.status, response.data] = mockItemCreate(response.config);
    //   return true;
    // case "itemIndex":
    //   [response.status, response.data] = mockItemIndex(response.config);
    //   return true;
    case "tagCreate":
      return mockTagCreate(config);
    case "session":
      console.log("session :>> ", config);
      const mock_session = mockSession(config);
      return mock_session;
  }
  return false;
};
export const httpClient = new Http("/api/v1");
// `请求`拦截1: mock
httpClient.instance.interceptors.response.use(
  async (response) => {
    console.log("response :>> ", response);
    const mock_res = await mock(response.config);
    console.log("mock_res :>> ", mock_res);
    return response;
  },
  async (error) => {
    console.log("error :>> ", error);
    if (error.config.params._mock) {
      const mock_res_error = await mock(error.config);
      console.log("mock_res_error :>> ", mock_res_error);
      if (mock_res_error) {
        return mock_res_error;
      } else return error;
    } else {
      throw error;
    }
  }
);
// 响应拦截
httpClient.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const err = error as AxiosError;
      // shared err
      if (err.response?.status === 429) {
        alert("请求频繁!"); // TODO: dialog
      }
    }
    throw error;
  }
);
// 请求拦截
// 把代码放入请求头
// TODO: Trim
httpClient.instance.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
  },
  // 很难请求时失败
  (error) => {
    throw error;
  }
);
