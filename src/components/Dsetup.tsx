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

  const itemss = [{ text: 1 }, { text: 2 }];
  // Vfor`(const { text } of itemss` {
  //   console.log("text :>> ", text);
  // }
  const random = Math.random();
  defineRender(
    <div>
      hello marcos!{count.value}
      <div v-if={random > 0.5}>Now you see me {random}</div>
      <div v-else>Now you don't</div>
      {/* <div v-for={1}>{item.text}</div> */}
    </div>
  );
};
