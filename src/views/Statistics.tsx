import { defineComponent } from "vue";
import { ChartsControl } from "@/components/statistics/Charts";
import { TabsTimeLayout, lessRenderSymbol } from "@/layouts/TabsTimeLayout";
export const Statistics = defineComponent({
  name: "Statistics",
  setup(props, context) {
    provide(lessRenderSymbol, true);
    return () => <TabsTimeLayout comp={ChartsControl} title="统计图表" />;
  },
});
