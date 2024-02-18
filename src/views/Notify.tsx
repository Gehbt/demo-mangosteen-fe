import { defineComponent } from "vue";
import s from "./Notify.module.scss";
import { ComingSoon } from "@/components/ComingSoon";
export const Notify = defineComponent({
  name: "Notify",
  setup(props, context) {
    return () => <ComingSoon />;
  },
});
