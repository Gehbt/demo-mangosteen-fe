import { FunctionalComponent, defineComponent, ref } from "vue";
interface myPropType {
  age: number;
  name: string;
}
const Ur = defineComponent<
  myPropType,
  {
    increment: (value: number) => void;
    decrement: () => void;
  }
>(
  (props: myPropType = { name: "1", age: 2 }, context) => {
    // const { age, name } = defineProps<myPropType>();
    // defineOptions({ name: "Ur" });
    return () => (
      <div>
        <button onClick={() => context.emit("increment", 1)}>++</button>
        <button onClick={() => context.emit("decrement")}>--</button>
      </div>
    );
  },
  { name: "Ur", inheritAttrs: false }
);
// export const Ur2: SetupFC<
//   myPropType,
//   {
//     increment: (value: number) => boolean;
//     decrement: () => boolean;
//   }
// > = () => {
//   const count = ref(0);

//   const props = withDefaults(defineProps<myPropType>(), { age: 1 });
//   let proptype: typeof props = { age: 1, name: "" };
//   const emit = defineEmits<{
//     increment: [value: number];
//     decrement: [];
//   }>();
//   emit("increment", 1);
//   emit("decrement");

//   defineRender(<div>{count.value}</div>);
// };

export const usedRender = defineComponent({
  name: "usedRender",
  setup(props, context) {
    const refVal = ref(1);

    return () => (
      <div>
        {/* <Ur
          age={refVal.value}
          name="2"
          onIncrement={(n) => (refVal.value += n)}
          onDecrement={() => (refVal.value -= 1)}
        ></Ur> */}
        {/* <Ur2 name="1" age={12} /> */}
      </div>
    );
  },
});
