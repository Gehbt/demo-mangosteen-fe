import { AxiosResponse } from "axios";
import { httpClient } from "./http";

export let refreshState:
  | Promise<
      AxiosResponse<{
        resource: {
          id: number;
        };
      }>
    >
  | undefined;

export const refreshMe = () => {
  refreshState = httpClient.get<{ resource: { id: number } }>("/me");
  return refreshState;
};

export const fetchMe = refreshMe;
