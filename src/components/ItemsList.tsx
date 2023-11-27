import { defineComponent, ref, watchEffect } from "vue";
// import s from "./ItemsList.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import SvgIcon from "./SvgIcon";
import { ItemSummary } from "./ItemSummary";
import { Time } from "@/composables/date";
import { Overlay } from "vant";
import { Form, FormItem } from "./Form";
export type ItemsListName = "本月" | "上月" | "今年" | "自定义";
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    const router = useRouter();
    const refSelected = ref<ItemsListName>("本月");
    const time = new Time();
    const refCustomTime = ref({
      start: new Time(),
      end: new Time(),
    });
    const timeList = [
      {
        start: time.firstDayOfMonth(),
        end: time.lastDayOfMonth(),
      },
      {
        start: time.add(-1, "month").firstDayOfMonth(),
        end: time.add(-1, "month").lastDayOfMonth(),
      },
      {
        start: time.firstDayOfYear(),
        end: time.lastDayOfYear(),
      },
    ];
    const refOverlayVisible = ref(false);
    const refErrBox = ref("");
    const onSubmitCustomDate = (e: Event) => {
      e.preventDefault();
      refOverlayVisible.value = false;
    };
    return () => (
      <MainLayout
        title="蓝莓记账"
        icon={svg.back}
        toggle={() => {
          console.log("back :>> /start");
          router.replace("/start");
        }}
        class={s.layout}
      >
        {{
          default: () => (
            <>
              <Tabs
                v-model:selected={refSelected.value}
                class={s.tabs}
                classPrefix={"customTabStyle"}
                onUpdate:selected={() => {
                  refOverlayVisible.value = true;
                }}
              >
                <Tab name="本月">
                  <ItemSummary
                    startDate={timeList[0].start.format()}
                    endDate={timeList[0].end.format()}
                  />
                </Tab>
                <Tab name="上月">
                  <ItemSummary
                    startDate={timeList[1].start.format()}
                    endDate={timeList[1].end.format()}
                  />
                </Tab>
                <Tab name="今年">
                  <ItemSummary
                    startDate={timeList[2].start.format()}
                    endDate={timeList[2].end.format()}
                  />
                </Tab>
                <Tab name="自定义">
                  <ItemSummary
                    startDate={refCustomTime.value.start.format()}
                    endDate={refCustomTime.value.end.format()}
                  />
                </Tab>
              </Tabs>
              <Overlay
                show={refOverlayVisible.value}
                class={s.overlay}
                onClick={() => {
                  refOverlayVisible.value = false;
                  // refSelected.value = "本月";
                }}
              >
                <div class={s.overlay_inner}>
                  <header>请选择时间</header>
                  <main>
                    <Form onSubmit={onSubmitCustomDate}>
                      <FormItem
                        label="开始时间"
                        modelValue={refCustomTime.value.start.format()}
                        err_data={refErrBox.value}
                        clan="date"
                        onUpdate:modelValue={(emitTime: string) => {
                          refCustomTime.value.start = new Time(
                            new Date(emitTime)
                          );
                        }}
                      ></FormItem>
                      <FormItem
                        label="结束时间"
                        modelValue={refCustomTime.value.end.format()}
                        err_data={refErrBox.value}
                        clan="date"
                        onUpdate:modelValue={(emitTime: string) => {
                          refCustomTime.value.end = new Time(
                            new Date(emitTime)
                          );
                        }}
                      ></FormItem>
                      <div class={[s.actions, s.formRow]}>
                        <button type="button">取消</button>
                        <button type="submit">确认</button>
                      </div>
                    </Form>
                  </main>
                </div>
              </Overlay>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});

export type ItemsCreateName = "支出" | "收入";
export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  setup(props, context) {
    const selectedTab = ref<"支出" | "收入">("支出");
    const refExpensesTags = ref([
      {
        id: "1",
        name: "蛋糕",
        sign: "🍰",
        kind: "食品",
      },
      {
        id: "2",
        name: "打车",
        sign: "🚕",
        kind: "交通",
      },
      {
        id: "3",
        name: "吃饭",
        sign: "🍕",
        kind: "食品",
      },
      {
        id: "4",
        name: "购物",
        sign: "🧦",
        kind: "商品",
      },
      {
        id: "5",
        name: "打车",
        sign: "🚕",
        kind: "交通",
      },
      {
        id: "6",
        name: "买肉",
        sign: "🦆",
        kind: "食品",
      },
    ]);
    const refIncomeTags = ref([
      {
        id: "100",
        name: "利息",
        sign: "💴",
      },
      {
        id: "101",
        name: "工资",
        sign: "💸",
      },
      {
        id: "102",
        name: "奖金",
        sign: "💰",
      },
      {
        id: "103",
        name: "年终奖",
        sign: "💹",
      },
      {
        id: "104",
        name: "出售",
        sign: "🪙",
      },
    ]);
    const router = useRouter();
    const updateSelected = (tabName: ItemsCreateName) =>
      (selectedTab.value = tabName);
    return () => (
      <MainLayout
        title="记一笔"
        icon={svg.back}
        toggle={() => {
          console.log("back :>> /start");
          router.replace("/start");
        }}
        class={s.layout} // todo: layout
      >
        {{
          default: () => (
            // <Tabs
            //   selected={selectedTab.value}
            //  onUpdate:selected={updateSelected}
            // >
            <div class={s.wrapper}>
              <Tabs v-model:selected={selectedTab.value} class={s.tabs}>
                <Tab name="支出" class={s.tags_wrapper}>
                  <div class={[s.tag, s.selected]}>
                    <button
                      onClick={() => {
                        router.replace("/tags/create");
                      }}
                      class={s.sign}
                    >
                      <SvgIcon name={svg.round_add} class={s.createTag} />
                    </button>
                    <div class={s.name}>新增</div>
                  </div>
                  {refExpensesTags.value.map((tag) => (
                    <div class={[s.tag, s.selected]}>
                      <div class={s.sign}>{tag.sign}</div>
                      <div class={s.name}>{tag.name}</div>
                    </div>
                  ))}
                </Tab>
                <Tab name="收入" class={s.tags_wrapper}>
                  <div class={[s.tag, s.selected]}>
                    <button
                      onClick={() => {
                        router.replace("/tags/create");
                      }}
                      class={s.sign}
                    >
                      <SvgIcon name={svg.round_add} class={s.createTag} />
                    </button>
                    <div class={s.name}>新增</div>
                  </div>
                  {refIncomeTags.value.map((tag) => (
                    <div class={[s.tag, s.selected]}>
                      <div class={s.sign}>{tag.sign}</div>
                      <div class={s.name}>{tag.name}</div>
                    </div>
                  ))}
                </Tab>
              </Tabs>
              <div class={s.inputPad_wrapper}>
                <InputPad />
              </div>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
