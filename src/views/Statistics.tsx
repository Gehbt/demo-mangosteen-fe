import { defineComponent } from "vue";
import { Charts } from "@/components/statistics/Charts";
import { TabsTimeLayout } from "@/layouts/TabsTimeLayout";
export const Statistics = defineComponent({
  name: "Statistics",
  setup(props, context) {
    provide("lessRender", true);
    return () => <TabsTimeLayout comp={Charts} title="统计图表" />;
  },
});
