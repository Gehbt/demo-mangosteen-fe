import { defineComponent } from "vue";
interface myPropType {
  age: number;
  name: string;
}
const Ur = defineComponent<myPropType>(
  (props = { name: "1", age: 2 }, context) => {
    // const { age, name } = defineProps<myPropType>();
    // defineOptions({ name: "Ur" });
    return () => (
      <div>
        age:{props.age}
        name:
        {props.name}
      </div>
    );
  },
  { name: "Ur" }
);

export const usedRender = defineComponent({
  name: "usedRender",
  setup(props, context) {
    return () => (
      <div>
        <Ur age={1} name="2"></Ur>
      </div>
    );
  },
});
