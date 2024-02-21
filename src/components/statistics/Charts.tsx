import s from "./Charts.module.scss";
import { type EChartsOption } from "echarts";
import * as echarts from "echarts/core";
import { LineChart as ELineChart, PieChart as EPieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  LegendComponent,
} from "echarts/components";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { Time } from "@/composables";
import { amountToPrice } from "../ItemSummary";
import { httpClient, i18nT } from "@/shared";
import { mkLineData } from "@/mock";
import { Picker, Popup } from "vant";
const amountPad = (config: {
  // ?TODO: 默认时区为标准时间而不是北京时间
  startDate: string;
  endDate: string;
  desiredNumber: number;
}) => {
  // TODO: 计算 desiredNumber
  return mkLineData(config.desiredNumber, {
    bill_start: config.startDate,
    bill_end: config.endDate,
    init_amount: 0,
    kind: "expenses",
  });
};
// hold on
function compareSeqFn(a: LineChartTypeOne, b: LineChartTypeOne) {
  return a.happen_at < b.happen_at ? -1 : 1;
}
// ! 假定 src是符合happen_at排列的
const mergePaddingSafe = (src: LineChartType, pad: LineChartType) => {
  if (src.length > pad.length) throw new Error("Invalid src length");
  function mergePadding(
    src: LineChartType,
    pad: LineChartType,
    MAX_RECURSIVE = 400 // 最大367
  ): LineChartType {
    if (MAX_RECURSIVE <= 0) {
      throw new Error("mergePadding MAX_RECURSIVE!");
    } else if (src.length === 0 && /* 防御 */ pad.length === 0) {
      return [];
    } else if (src.length === 0) {
      return pad;
    } else if (pad.length === 0) {
      return src;
    } else if (src[0].happen_at === pad[0].happen_at) {
      return [
        {
          amount: src[0].amount + pad[0].amount,
          happen_at: pad[0].happen_at,
          kind: src[0].kind,
        },
        ...mergePadding(src.slice(1), pad.slice(1), MAX_RECURSIVE - 1),
      ];
    } else {
      return [pad[0], ...mergePadding(src, pad.slice(1), MAX_RECURSIVE - 1)];
    }
  }
  return mergePadding(src, pad);
};

export const ChartsControl = defineComponent({
  name: "ChartsControl",
  props: {
    timeLine: string<DateScope>().isRequired,
    startDate: string().isRequired,
    endDate: string().isRequired,
  },
  setup(props, context) {
    const refCategory = ref<TagKind>("expenses");
    // watch(refCategory, () => {
    //   console.log("refCategory.value :>> ", refCategory.value);
    // });
    const refShowPicker = ref<boolean>(false);
    const columns: { text: "收入" | "支出"; value: TagKind }[] = [
      { text: "支出", value: "expenses" },
      { text: "收入", value: "income" },
    ];
    return () => (
      <>
        <div class={s.wrapper}>
          <span class={s.formItem_name}>类型</span>
          <div class={s.formItem_value}>
            <input
              type="text"
              readonly="true"
              v-model={i18nT[refCategory.value]}
              class={[s.formItem, s.selecter]}
              onClick={() => {
                refShowPicker.value = true;
              }}
            />
          </div>
          <Charts
            timeLine={props.timeLine}
            startDate={props.startDate}
            endDate={props.endDate}
            kind={refCategory.value}
            // !因为当前的数据切换是重绘,所以动画失效
            key={refCategory.value}
          ></Charts>
          <Popup position="bottom" v-model:show={refShowPicker.value}>
            <Picker
              title="标题"
              columns={columns}
              onConfirm={({
                selectedValues,
              }: {
                selectedValues: [TagKind];
              }) => {
                refCategory.value = selectedValues[0];
                refShowPicker.value = false;
              }}
              // @confirm="onConfirm"
              onCancel={() => {
                refShowPicker.value = false;
              }}
              // @change="onChange"
            />
          </Popup>
        </div>
      </>
    );
  },
});
export const Charts = defineComponent({
  name: "Charts",
  props: {
    timeLine: string<DateScope>().isRequired,
    startDate: string().isRequired,
    endDate: string().isRequired,
    kind: string<TagKind>().isRequired,
  },
  setup(props, context) {
    // * line charts
    // TODO: 可以放到具体的组件内,或者抽象成一层
    // desiredNumber在Layout 只有custom里需要计算,并且只在提交时需要验证
    // 简单来说就是放在Layout层里需要四个变量 这里只需一个
    // * Layout层 保证了 0 < desiredNumber < 367
    const desiredNumber = Time.dateSubduct(
      new Time(props.endDate),
      new Time(props.startDate)
    );
    // 为custom日期做缓存
    // 更好的方式应该是抽象成一个可边长数组然后做切片
    const inCustomTimeLine =
      props.timeLine !== "custom"
        ? props.timeLine
        : `custom?startDate=${props.startDate}&endDate=${props.endDate}`;
    const refLineData = useSessionStorage<LineChartViewType>(
      `chart_line-kind_${props.kind}-${inCustomTimeLine}`,
      []
    );
    // 后端的资源
    const refLineResource = ref<LineChartType>([]);
    const padData: LineChartType = amountPad({
      startDate: props.startDate,
      endDate: props.endDate,
      desiredNumber,
    });
    // 合并pad的数据
    const refMergedData = computed(() =>
      mergePaddingSafe(refLineResource.value, padData)
    );

    // console.log("desiredNumber :>> ", desiredNumber);
    // linedata转换成view的版本
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
            kind: props.kind,
            desiredNumber,
            bill_start: props.startDate,
            bill_end: props.endDate,
          },
          {
            _mock: "lineChartLess",
            _loading: true,
          }
        );
        console.log("lineResponse :>> ", lineResponse.data.resource);
        refLineResource.value = lineResponse.data.resource;
        refLineData.value = lineChartDataToView(refMergedData.value);
      }
    };
    onMounted(getLine);
    // pie
    const refPieData = useSessionStorage<PieChartViewType>(
      `chart_pie-kind_${props.kind}-${inCustomTimeLine}`,
      []
    );
    const refBarData = useSessionStorage<BarChartType>(
      `chart_bar-kind_${props.kind}-${inCustomTimeLine}`,
      []
    );
    const pieDataToView = (p: PieChartType) =>
      p
        .sort((a, b) => b.amount - a.amount) // 要从大到小排序
        .map<PieChartViewTypeOne>((item, index) => ({
          value: item.amount,
          name: item.tag.name,
          id: index + 1, // id 从1开始(也可不加)
        }));

    const getPie = async () => {
      if (!refPieData.value || !refPieData.value.length) {
        const pieResponse = await httpClient.get<Resource<PieChartTypeOne[]>>(
          "/item/chart/pie",
          {
            kind: props.kind,
            // 应该没用
            bill_start: props.startDate,
            bill_end: props.endDate,
          },
          {
            _mock: "pieChart",
          }
        );
        console.log("pieResponse :>> ", pieResponse.data.resource);
        refBarData.value = pieResponse.data.resource;
        refPieData.value = pieDataToView(pieResponse.data.resource);
      }
    };
    onMounted(getPie);
    return () => {
      return (
        <>
          {/* echarts 需要展示时的宽高,且不能是display: none的 */}
          <LineChart data={refLineData.value} />
          <PieChart data={refPieData.value} />
          <BarChart data={refBarData.value} />
        </>
      );
    };
  },
});
export type ChartsType = typeof ChartsControl;

export const LineChart = defineComponent({
  name: "LineChart",
  props: {
    data: array<[string, string]>().isRequired,
  },
  setup(props, context) {
    echarts.use([
      GridComponent,
      TooltipComponent,
      DataZoomComponent,
      ELineChart,
      CanvasRenderer,
      UniversalTransition,
    ]);
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
      const option = computed<EChartsOption>(
        () =>
          ({
            animation: true,
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
              confine: true,
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
              boundaryGap: ["2%", "3%"],
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
          } as EChartsOption)
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
  props: {
    data: array<PieChartViewTypeOne>(),
  },
  setup(props, context) {
    echarts.use([
      TooltipComponent,
      LegendComponent,
      EPieChart,
      CanvasRenderer,
      // LabelLayout,
    ]);
    const refPie = ref<HTMLDivElement>();
    const pieChart = shallowRef<echarts.ECharts>();
    onMounted(() => {
      // 找不到对应HTMLElement
      if (refPie.value === undefined) {
        return;
      }
      pieChart.value = echarts.init(refPie.value);
      // 使用刚指定的配置项和数据显示图表。
      const pieOption = computed<EChartsOption>(
        () =>
          ({
            animation: true,
            tooltip: {
              confine: true,
              trigger: "item",
              formatter: (item: {
                value: number;
                name: string;
                percent: number;
              }) => {
                return `${item.name}: <strong>￥${amountToPrice(
                  item.value
                )}</strong> (${item.percent}%)`;
              },
              extraCssText: "margin-bottom: 10px",
            },
            legend: {
              top: "0%",
              left: "center",
            },
            series: [
              {
                name: "收入与支出",
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
                    // fontWeight: "bold",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: props.data,
              },
            ],
          } as EChartsOption)
      );
      pieChart.value.setOption(pieOption.value);
      watch(pieOption, () => {
        pieChart.value?.setOption(pieOption.value);
      });
    });
    onUnmounted(() => {
      pieChart.value?.dispose();
    });
    return () => <div ref={refPie} class={s.pie_chart}></div>;
  },
});

export const BarChart = defineComponent({
  name: "BarChart",
  props: {
    data: array<BarChartTypeOne>().isRequired,
  },
  setup(props, context) {
    const barDataView = computed(() => {
      const total = props.data.reduce((sum, item) => sum + item.amount, 0);
      return props.data.map((item) => ({
        ...item,
        percent: Math.round((item.amount / total) * 100) + "%",
      }));
    });
    return () => (
      <div class={s.demo3}>
        {barDataView.value.map(({ tag, amount, percent }) => {
          return (
            <div
              class={s.topItem}
              onClick={() => {
                // ?TODO: 添加样式
              }}
            >
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.bar_wrapper}>
                <div class={s.bar_text}>
                  <span>
                    {tag.name} - {percent}
                  </span>
                  <span> ￥{amountToPrice(amount)} </span>
                </div>
                <div class={s.bar}>
                  <div class={s.bar_inner} style={{ width: percent }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
});
