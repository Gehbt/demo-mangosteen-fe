export const Dsetup = defineSetupComponent(() => {
  defineOptions({
    name: "Dsetup",
  });
  const count = ref(0);
  withDefaults(
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
  // ! useLess only effect in unplugin-vue-router
  definePage({
    name: "/welcome/hidings",
    meta: {
      content: "dsetup",
    },
  });

  const itemss = [{ text: 1 }, { text: 2 }];
  // Vfor`(const { text } of itemss` {
  //   console.log("text :>> ", text);
  // }
  const random = Math.random();
  defineRender(
    <div>
      <h1>Dsetup</h1>
      hello marcos!{count.value}
      <div v-if={random > 0.5}>
        Now you see me <br />
        {random}
      </div>
      <div v-else>Now you don't</div>
      {/* <div v-for={1}>{item.text}</div> */}
    </div>
  );
});
export const Fsetup: SetupFC = () => {
  defineOptions({
    name: "Fsetup",
  });
  const count = ref(0);
  withDefaults(
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
  // ! useLess only effect in unplugin-vue-router
  definePage({
    name: "/welcome/hidings/VueFC",
    meta: {},
  });

  const items = [{ text: 1 }, { text: 2 }];
  // Vfor`(const { text } of itemss` {
  //   console.log("text :>> ", text);
  // }
  const random = Math.random();
  defineRender(
    <div>
      <h1>Fsetup</h1>
      <p>hello marcos!</p>
      <p v-if={random > 0.5}>
        Now you see me <br />
        {random}
      </p>
      <p v-else>Now you don't</p>
      {/* <div v-for={item in items}>{item.text}</div> */}
    </div>
  );
};
