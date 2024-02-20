export const useCounterStore = defineStore("counter", () => {
  // state
  const count = ref(0);
  // const name = ref("counter");
  // getters
  const doubleCount = computed(() => count.value * 2);
  // actions
  function increment() {
    count.value++;
  }
  return { count, increment, doubleCount };
});
