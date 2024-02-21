import s from "./Export.module.scss";
import { ComingSoon } from "@/components/ComingSoon";
export const Export = defineComponent({
  name: "Export",
  setup(props, context) {
    return () => <ComingSoon name="导出" />;
  },
});
export default Export;
