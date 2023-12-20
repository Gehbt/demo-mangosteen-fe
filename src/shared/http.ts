import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class Http {
  instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    })
  }
  // read
  get<RD = unknown>(url: string, query?: Record<string, JSON>, config?: Omit<AxiosRequestConfig<RD>, "params" | "url" | "method">) {
    return this.instance.request<RD>({
      ...config, url, params: query, method: "GET"
    })
  }
  // create
  post<RD = unknown>(url: string, data?: Record<string, string>, config?: Omit<AxiosRequestConfig<RD>, "data" | "url" | "method">) {
    return this.instance.request<RD>({
      ...config, url, data, method: "POST"
    })
  }
  // update
  patch<RD = unknown>(url: string, data?: Record<string, string>, config?: Omit<AxiosRequestConfig<RD>, "data" | "url" | "method">) {
    return this.instance.request<RD>({
      ...config, url, data, method: "PATCH"
    })
  }
  // update all
  // put() { }
  // destroy
  delect<RD = unknown>(url: string, query?: Record<string, JSON>, config?: Omit<AxiosRequestConfig<RD>, "params" | "url" | "method">) {
    return this.instance.request<RD>({
      ...config, url, params: query, method: "DELECT"
    })
  }
  // CRUD
  // create, read, update, delete
}

export const httpClient = new Http('/api/v1');
// http.instance.interceptors.request.use(config => { }, () => { })
// http.instance.interceptors.response.use(config => { }, () => { })
