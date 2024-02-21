import s from "./Notify.module.scss";
import { ComingSoon } from "@/components/ComingSoon";
export const Notify = defineComponent({
  name: "Notify",
  setup(props, context) {
    return () => <ComingSoon name="记账提醒" />;
  },
});
export default Notify;
