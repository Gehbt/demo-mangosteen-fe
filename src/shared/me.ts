import { httpClient } from "./http";

export let refreshState: Promise<UserType> | undefined;

export const refreshMe = async () => {
  refreshState = httpClient
    .get<{
      user: UserType;
      jwt: string;
      // me 不需要显示loading
    }>("/me", {}, { _loading: false })
    .then((response) => {
      if (response.status === 201) {
        // 仅当 201 时存在jwt
        localStorage.setItem("jwt", response.data.jwt);
      }
      return response.data.user;
    });
  return refreshState;
};

export const fetchMe = refreshMe;
