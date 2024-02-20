import { httpClient } from "@/shared";

export const refMePromise = ref<Promise<UserType> | undefined>();
function updateMePromise() {
  refMePromise.value = httpClient
    .get<{
      user: UserType;
      jwt: string;
      // me 不需要显示loading
    }>("/me")
    .then((response) => {
      console.log(response);
      if (response.status === 201) {
        // 仅当 201 时存在jwt
        localStorage.setItem("jwt", response.data.jwt);
      } else if (response.status === 422) {
        // jwt 过期
        localStorage.setItem("jwt", "");
      }
      return response.data.user;
    });
}
export const fetchMe = () => {
  updateMePromise();
  return refMePromise.value!;
};
export const refreshMe = fetchMe;
