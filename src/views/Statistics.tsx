import { ChartsControl } from "@/components/statistics/Charts";
import { TabsTimeLayout, lessRenderSymbol } from "@/layouts/TabsTimeLayout";
import type { HeadType } from "DefineHeadType";
export const Statistics = defineComponent({
  name: "Statistics",
  head: {
    title: "统计图表",
  } as HeadType,
  setup(props, context) {
    provide(lessRenderSymbol, true);
    return () => <TabsTimeLayout comp={ChartsControl} title="统计图表" />;
  },
});
