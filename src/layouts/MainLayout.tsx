import { PropType, defineComponent } from "vue";
import { Navbar } from "@/components/Navbar";
export const MainLayout = defineComponent({
  name: "MainLayout",
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: Function as PropType<(className?: string) => JSX.Element>,
      required: true,
    },
    toggle: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props, context) {
    return () => (
      <div>
        <Navbar onToggle={props.toggle}>
          {{ title: () => props.title, icon: props.icon }}
        </Navbar>
        {context.slots.default?.()}
      </div>
    );
  },
});
