import { AxiosResponse } from "axios";
import { httpClient } from "./http";

export let refreshState:
  | Promise<
      AxiosResponse<{
        email: string;
        user_id: number;
        name: string;
      }>
    >
  | undefined;

export const refreshMe = () => {
  refreshState = httpClient.get<{
    email: string;
    user_id: number;
    name: string;
  }>("/me");
  return refreshState;
};

export const fetchMe = refreshMe;
