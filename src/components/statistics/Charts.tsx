import {
  PropType,
  SelectHTMLAttributes,
  defineComponent,
  onMounted,
  ref,
} from "vue";
import s from "./Charts.module.scss";
import * as echarts from "echarts";
import { Time } from "@/composables";
import { amountToPrice } from "../ItemSummary";
import { httpClient } from "@/shared";
import { mkLineData } from "@/mock";
const amountPad = (config: {
  startDate: string;
  endDate: string;
  desiredNumber: number;
}) => {
  // TODO: 计算 desiredNumber
  return mkLineData(config.desiredNumber, {
    bill_start: config.startDate,
    bill_end: config.endDate,
    init_amount: 0,
  });
};
// hold on
function compareSeqFn(a: LineChartTypeOne, b: LineChartTypeOne) {
  return a.happen_at < b.happen_at ? -1 : 1;
}
// ! 假定 src是符合happen_at排列的
const mergePaddingSafe = (src: LineChartType, pad: LineChartType) => {
  if (src.length > pad.length) throw new Error("Invalid src length");
  function mergePadding(src: LineChartType, pad: LineChartType): LineChartType {
    if (src.length === 0 && /* 防御 */ pad.length === 0) {
      return [];
    }
    if (src.length === 0) {
      return pad;
    }
    if (pad.length === 0) {
      return src;
    }
    if (src[0].happen_at === pad[0].happen_at) {
      return [
        {
          amount: src[0].amount + pad[0].amount,
          happen_at: pad[0].happen_at,
        },
        ...mergePadding(src.slice(1), pad.slice(1)),
      ];
    } else {
      return [pad[0], ...mergePadding(src, pad.slice(1))];
    }
  }
  return mergePadding(src, pad);
};
export const Charts = defineComponent({
  name: "Charts",
  props: {
    timeLine: string<DateScope>().isRequired,
    startDate: string().isRequired,
    endDate: string().isRequired,
  },
  setup(props, context) {
    // desiredNumber在Layout 只有custom里需要计算,并且只在提交时需要验证
    // 简单来说就是放在Layout层里需要四个变量 这里只需一个
    // * Layout层 保证了 0 < desiredNumber < 367
    const desiredNumber = Time.dateSubduct(
      new Time(props.endDate),
      new Time(props.startDate)
    );
    const refCategory = ref<TagKindType>("expenses");
    const inCustomTimeLine =
      props.timeLine !== "custom"
        ? props.timeLine
        : `custom?startDate=${props.startDate}&endDate=${props.endDate}`;
    const refLineData = useSessionStorage<LineChartViewType>(
      `chart_line_data_${inCustomTimeLine}`,
      []
    );
    const refLineResource = ref<LineChartType>([]);
    const padData: LineChartType = amountPad({
      startDate: props.startDate,
      endDate: props.endDate,
      desiredNumber,
    });
    const refMergedData = computed(() =>
      mergePaddingSafe(refLineResource.value, padData)
    );
    const refPieData = useSessionStorage<LineChartViewType>(
      `chart_pie_data_${inCustomTimeLine}`,
      []
    );
    console.log("desiredNumber :>> ", desiredNumber);

    const lineChartDataToView = (l: LineChartType) =>
      l.map<LineChartViewTypeOne>((lineChartDataOne) => [
        lineChartDataOne.happen_at,
        amountToPrice(lineChartDataOne.amount),
      ]);
    const getLine = async () => {
      if (!refLineData.value || !refLineData.value.length) {
        const lineResponse = await httpClient.get<Resource<LineChartType>>(
          "/item/chart/line",
          {
            desiredNumber,
            bill_start: props.startDate,
            bill_end: props.endDate,
            _mock: "lineChartLess",
          }
        );
        console.log("lineResponse :>> ", lineResponse.data.resource);
        refLineResource.value = lineResponse.data.resource;
        refLineData.value = lineChartDataToView(refMergedData.value);
      }
    };
    onMounted(getLine);

    return () => (
      <div class={s.wrapper}>
        <span class={s.formItem_name}>类型</span>
        <div class={s.formItem_value}>
          {/* TODO: change to vant-ver Select */}
          <select
            class={[s.formItem, s.selecter]}
            value={refCategory.value}
            onChange={(e) => {
              refCategory.value = (e.target as SelectHTMLAttributes).value;
            }}
          >
            <option value="expenses" selected class={[s.select, s.option]}>
              支出
            </option>
            <option value="income" class={s.option}>
              收入
            </option>
          </select>
        </div>
        {/* echarts 需要展示时的宽高,且不能是display: none的 */}
        <LineChart data={refLineData.value} />
        <PieChart />
        <BarChart />
      </div>
    );
  },
});
export type ChartsType = typeof Charts;

export const LineChart = defineComponent({
  name: "LineChart",
  props: {
    data: array<[string, string]>().isRequired,
  },
  setup(props, context) {
    const refLine = ref<HTMLDivElement>();
    // !chart对象不能使用ref引用
    // ?但可以用 shallowRef
    // *思考可能ECharts对象触发了部分更新
    const lineChart = shallowRef<echarts.ECharts>();
    // const lineChart: { value: echarts.ECharts | undefined } = {
    //   value: undefined,
    // };
    onMounted(() => {
      if (refLine.value === undefined) {
        return;
      }
      lineChart.value = echarts.init(refLine.value);
      const option = computed(
        () =>
          ({
            grid: {
              left: "0px",
              top: "20px",
              right: "10px",
              bottom: " 40px",
              containLabel: true,
            },
            tooltip: {
              show: true,
              trigger: "axis",
              formatter: (item: { value: unknown }[]) => {
                const [date, price] = item[0].value as [string, number];
                return `${new Time(date).format("YYYY年MM月DD日")} ￥${price}`;
              },
            },
            dataZoom: [
              {
                right: "5%",
                left: "12%",
                bottom: "10px",
                type: "slider",
                labelFormatter(value, valueStr) {
                  return new Time(valueStr).format("MM月DD日");
                },
              },
              {
                height: "40px",
                type: "inside",
              },
            ],
            xAxis: {
              type: "time",
              boundaryGap: ["2%", "2%"],
              axisLabel: {
                formatter: (value) => {
                  return new Time(value).format("MM-DD");
                },
              },
              axisTick: {
                alignWithLabel: true,
              },
            },
            yAxis: {
              show: true,
              type: "value",
              splitLine: {
                show: true,
                lineStyle: {
                  type: "dashed",
                },
              },
              axisLabel: {
                show: true,
              },
            },
            series: [
              {
                data: props.data,
                type: "line",
              },
            ],
          } as echarts.EChartsOption)
      );
      lineChart.value.setOption(option.value);
      // 更新触发重绘
      watch(option, () => {
        lineChart.value?.setOption(option.value);
      });
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
    const refPie = ref<HTMLDivElement>();
    const pieChart = ref<echarts.ECharts>();
    onMounted(() => {
      if (refPie.value === undefined) {
        return;
      }
      pieChart.value = echarts.init(refPie.value);
      // 使用刚指定的配置项和数据显示图表。
      const pieOption = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "0%",
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
    });
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
                <div class={s.bar}>
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
