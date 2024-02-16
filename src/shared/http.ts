import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  mockSession,
  mockItemCreate,
  mockTagIndex,
  mockTagCreate,
  mockTagQuery,
  mockTagEdit,
  mockTagDelete,
  mockItemIndex,
  mockLineChart,
  mockLineChartLess,
  mockPieChart,
  // mockItemIndexAmount
} from "@/mock";
import { ToastWrapperInstance, closeToast, showLoadingToast } from "vant";

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
const toastSwitch: { value: ToastWrapperInstance | undefined } = {
  value: undefined,
};
const mock: (
  config: InternalAxiosRequestConfig
) => Promise<false | AxiosResponse | AxiosError<OnAxiosError>> = async (
  config: InternalAxiosRequestConfig
) => {
  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.hostname !== "192.168.0.247"
  ) {
    return false;
  }
  const mockWhat = config._mock;
  //? return window.eval(`mock${mockWhat}(config)`)
  switch (mockWhat) {
    case "itemCreate":
      return mockItemCreate(config);
    case "itemIndex":
      return mockItemIndex(config);
    // case "itemIndexAmount":
    //   return mockItemIndexAmount(config);
    case "tagCreate":
      return mockTagCreate(config);
    case "tagDelete":
      return mockTagDelete(config);
    case "tagEdit":
      return mockTagEdit(config);
    case "tagIndex":
      return mockTagIndex(config);
    case "tagQuery":
      return mockTagQuery(config);
    case "lineChart":
      return mockLineChart(config);
    case "lineChartLess":
      return mockLineChartLess(config);
    case "pieChart":
      return mockPieChart(config);
    case "session":
      // console.log("session :>> ", config);
      return mockSession(config);
  }
  return false;
};
export const httpClient = new Http("/api/v1");
// 拦截0: 关闭toast
httpClient.instance.interceptors.response.use(
  (response) => {
    if (toastSwitch.value) {
      // 这里使用了 指定toast的close()方法而不是 closeToast()方法只是尝试
      toastSwitch.value.close();
    }
    return response;
  },
  (error) => {
    if (toastSwitch.value) {
      closeToast();
    }
    throw error;
  }
);
// `请求`拦截1: mock
httpClient.instance.interceptors.response.use(
  async (response) => {
    console.log("response :>> ", response);
    // console.warn("use mock");
    const mock_res = await mock(response.config);
    if (!!mock_res) {
      console.log("mock_res :>> ", mock_res);
    }
    return response;
  },
  async (error) => {
    console.log("mock error pre:>> ", error);
    if (error.config._mock) {
      console.warn("use mock");
      const mock_res_error = await mock(error.config);
      console.log("mock_res_error :>> ", mock_res_error);
      if (mock_res_error) {
        return mock_res_error;
      } else throw error;
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
  (error: AxiosError<OnAxiosError>) => {
    if (error.response) {
      // shared err
      if (error.response.status === 429) {
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
    if (!!jwt) {
      config.headers.Authorization = `Bearer-${jwt}`;
    }
    if (config?._loading === true) {
      toastSwitch.value = showLoadingToast({
        message: "加载中",
        forbidClick: true,
      });
    }
    console.log("request :>> ", config);
    return config;
  },
  // 很难请求时失败,但还是标记了
  (error) => {
    throw error;
  }
);
