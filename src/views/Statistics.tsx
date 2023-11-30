import { defineComponent } from "vue";
import { Charts } from "@/components/statistics/Charts";
import { TabsTime } from "@/layouts/TabsTimeLayout";
export const Statistics = defineComponent({
  name: "Statistics",
  setup(props, context) {
    return () => <TabsTime comp={Charts as any} title="统计图表" />;
  },
});
