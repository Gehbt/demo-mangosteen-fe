import { httpClient } from "@/shared";

export const useMeStore = defineStore("me", () => {
  const refMePromise = ref<Promise<UserType> | undefined>();
  function updateMePromise() {
    refMePromise.value = httpClient
      .get<{
        user: UserType;
        jwt: string;
        // me 不需要显示loading
      }>("/me")
      .then((response) => {
        if (response.status === 201) {
          // 仅当 201 时存在jwt
          localStorage.setItem("jwt", response.data.jwt);
        }
        return response.data.user;
      });
  }
  const getMePromise = computed(() => {
    updateMePromise();
    return refMePromise.value!;
  });
  const fetchMe = computed(() => getMePromise.value);
  const refreshMe = computed(() => getMePromise.value);
  return {
    fetchMe,
    refreshMe,
  };
});
// ! getters 不能访问actions
