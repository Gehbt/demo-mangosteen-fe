import { ref } from "vue";

export const Dsetup: SetupFC = () => {
  defineOptions({
    name: "Dsetup",
  });
  const count = ref(0);
  const props = withDefaults(
    defineProps<{
      foo?: string;
      bar?: number;
    }>(),
    { bar: 0 }
  );

  // const emit = defineEmits<{
  //   increment: [value: number]
  //   decrement: []
  // }>()
  // emit('increment', 1)
  // emit('decrement')
  definePage({
    name: "/welcome/hidings",
    meta: {},
  });
  defineRender(<div>hello marcos!{count.value}</div>);
};
