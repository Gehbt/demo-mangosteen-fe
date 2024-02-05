import {
  PropType,
  SelectHTMLAttributes,
  defineComponent,
  onMounted,
  ref,
} from "vue";
import s from "./Charts.module.scss";
import * as echarts from "echarts";
export const Charts = defineComponent({
  name: "Charts",
  props: {
    startDate: string().isRequired,
    // {
    //   type: String as PropType<string>,
    //   required: true,
    // },
    endDate: string().isRequired,
    // {
    //   type: String as PropType<string>,
    //   required: true,
    // },
  },
  setup(props, context) {
    const refCategory = ref<TagKindType>("expenses");
    return () => (
      <div class={s.wrapper}>
        <span class={s.formItem_name}>类型</span>
        <div class={s.formItem_value}>
          <select
            class={[s.formItem, s.selecter]}
            value={refCategory.value}
            onChange={(e) => {
              refCategory.value = (e.target as SelectHTMLAttributes).value;
            }}
          >
            <option value="expenses" selected class={s.select}>
              支出
            </option>
            <option value="income">收入</option>
          </select>
        </div>
        <div style={{ width: "100px" }}></div>
        <LineChart />
        <PieChart />
        <BarChart />
      </div>
    );
  },
});
export type ChartsType = typeof Charts;

export const LineChart = defineComponent({
  name: "LineChart",
  setup(props, context) {
    const refLine = templateRef<HTMLDivElement>("refLine");
    const lineChart = ref<echarts.ECharts>();
    const lineData = ref([150, 230, 224, 218, 135, 147, 260]);
    onMounted(() => {
      lineChart.value = echarts.init(refLine.value, null, {});
      const option = computed(() => ({
        grid: { left: "30px", top: "20px", right: 0, bottom: " 20px" },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: lineData.value,
            type: "line",
          },
        ],
      }));
      lineChart.value.setOption(option.value);
    });
    onUnmounted(() => {
      lineChart.value?.dispose();
    });
    return () => <div ref={refLine} class={s.line_chart} />;
  },
});

export const PieChart = defineComponent({
  name: "PieChart",
  setup(props, context) {
    const refPie = templateRef<HTMLDivElement>("refPie");
    const pieChart = ref<echarts.ECharts>();
    onMounted(() =>
      nextTick(() => {
        pieChart.value = echarts.init(refPie.value);
        // 使用刚指定的配置项和数据显示图表。
        const pieOption = {
          tooltip: {
            trigger: "item",
          },
          legend: {
            top: "5%",
            left: "center",
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
              ],
            },
          ],
        };
        pieChart.value.setOption(pieOption);
      })
    );
    onUnmounted(() => {
      pieChart.value?.dispose();
    });
    return () => <div ref={refPie} class={s.pie_chart}></div>;
  },
});

export const BarChart = defineComponent({
  name: "BarChart",
  setup(props, context) {
    const data3 = reactive([
      { tag: { id: 1, name: "房租", sign: "x" }, amount: 3000 },
      { tag: { id: 2, name: "吃饭", sign: "x" }, amount: 1000 },
      { tag: { id: 3, name: "娱乐", sign: "x" }, amount: 900 },
    ]);
    const betterData3 = computed(() => {
      const total = data3.reduce((sum, item) => sum + item.amount, 0);
      return data3.map((item) => ({
        ...item,
        percent: Math.round((item.amount / total) * 100) + "%",
      }));
    });
    return () => (
      <div class={s.demo3}>
        {betterData3.value.map(({ tag, amount, percent }) => {
          return (
            <div class={s.topItem}>
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.bar_wrapper}>
                <div class={s.bar_text}>
                  <span>
                    {tag.name} - {percent}
                  </span>
                  <span> ￥{amount} </span>
                </div>
                <div
                  class={s.bar}
                  // style={{ height: `calc($percent * 42px )` }}
                >
                  <div class={s.bar_inner}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
