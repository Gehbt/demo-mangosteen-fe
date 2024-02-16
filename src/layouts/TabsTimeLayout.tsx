import { defineComponent, ref } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import s from "./TabsTimeLayout.module.scss";
import { ITime, Time } from "@/composables";
import { Overlay as VOverlay, showDialog } from "vant";
import { Overlay, OverlayMask } from "@/components/Overlay";
import { Tab, Tabs } from "@/components/Tabs";
import { Form, FormItem } from "@/components/Form";
import type { ChartsType } from "@/components/statistics/Charts";
import type { ItemSummaryType } from "@/components/ItemSummary";
export const lessRenderSymbol = Symbol("lessRender") as InjectionKey<boolean>;
// 其实应该在component里的
export const TabsTimeLayout = defineComponent({
  name: "TabsTimeLayout",
  props: {
    comp: object<ChartsType | ItemSummaryType>().isRequired,
    title: string().isRequired,
  },
  setup(props, context) {
    const lessRender = inject(lessRenderSymbol, false);
    const route = useRoute();
    const overlayVisibleRef = ref(false);
    const toggleOverlay = () => {
      overlayVisibleRef.value = true;
    };
    const blurOverlay = () => {
      overlayVisibleRef.value = false;
    };
    const refSelected = ref<DateScope>("month");
    const time = new Time();
    const refCustomTime = ref<
      | {
          start: ITime;
          end: ITime;
        }
      | {
          start: null;
          end: null;
        }
    >({ start: null, end: null });
    const refCustomTimeSL = ref<{
      start: ITime;
      end: ITime;
    }>({
      start: new Time(),
      end: new Time(),
    });
    const refLoadCustomTime = computed(
      () => !refCustomTime.value.start && !refCustomTime.value.end
    );
    // ?TODO: reduce .format
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
    console.log("timeList :>> ", timeList);
    return () => (
      <>
        <MainLayout
          title={props.title}
          icon={svgs.menu}
          toggle={toggleOverlay}
          class={s.layout} // todo: layout
        >
          <div class={s.wrapper}>
            <Tabs
              lessRender={lessRender}
              v-model:selected={refSelected.value}
              class={s.tabs}
              classPrefix="customTabStyle"
              onUpdate:selected={(value: DateScope) => {
                if (value === "custom") {
                  refOverlayVisible.value = true;
                }
              }}
            >
              <Tab name="month">
                <props.comp
                  timeLine="month"
                  startDate={timeList[0].start.format()}
                  endDate={timeList[0].end.format()}
                />
              </Tab>
              <Tab name="last_month">
                <props.comp
                  timeLine="last_month"
                  startDate={timeList[1].start.format()}
                  endDate={timeList[1].end.format()}
                />
              </Tab>
              <Tab name="year">
                <props.comp
                  timeLine="year"
                  startDate={timeList[2].start.format()}
                  endDate={timeList[2].end.format()}
                />
              </Tab>
              <Tab name="custom">
                <props.comp
                  timeLine="custom"
                  v-if={!refLoadCustomTime.value}
                  startDate={refCustomTime.value.start?.format() ?? ""}
                  endDate={refCustomTime.value.end?.format() ?? ""}
                />
              </Tab>
            </Tabs>
            <VOverlay
              show={refOverlayVisible.value}
              class={s.overlay}
              onClick={() => {
                // !DO NOTHING: cause cut off
                // TODO: click overlay should clonse
                // refOverlayVisible.value = false;
                // refSelected.value = "month";
              }}
            >
              <div class={s.overlay_inner}>
                <header>请选择时间</header>
                <main>
                  <Form onSubmit={onSubmitCustomDate}>
                    <FormItem
                      label="开始时间"
                      modelValue={refCustomTimeSL.value.start.format()}
                      errData={refErrBox.value}
                      clan="date"
                      onUpdate:modelValue={(emitTime: string) => {
                        // console.log("emitTime :>> ", emitTime);
                        refCustomTimeSL.value.start = new Time(
                          new Date(emitTime)
                        );
                      }}
                    ></FormItem>
                    <FormItem
                      label="结束时间"
                      modelValue={refCustomTimeSL.value.end.format()}
                      errData={refErrBox.value}
                      clan="date"
                      onUpdate:modelValue={(emitTime: string) => {
                        // console.log("emitTime :>> ", emitTime);
                        refCustomTimeSL.value.end = new Time(
                          new Date(emitTime)
                        );
                      }}
                    ></FormItem>
                    <div class={[s.actions, s.formRow]}>
                      <button
                        type="button"
                        onClick={() => {
                          // back to month
                          // reset CustomTime, toggle v-if
                          refCustomTime.value = { end: null, start: null };
                          refSelected.value = "month";
                          refOverlayVisible.value = false;
                        }}
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const desiredNumber = Time.dateSubduct(
                            refCustomTimeSL.value.end,
                            refCustomTimeSL.value.start
                          );
                          if (desiredNumber > 366 || desiredNumber < 0) {
                            if (desiredNumber > 366) {
                              showDialog({
                                message: "不支持查询超过一年的时间",
                              });
                            } else {
                              showDialog({
                                message: "查询的时间错误",
                              });
                            }
                            refCustomTime.value = { end: null, start: null };
                            refSelected.value = "month";
                            refOverlayVisible.value = false;
                          } else {
                            refCustomTime.value.start =
                              refCustomTimeSL.value.start;
                            refCustomTime.value.end = refCustomTimeSL.value.end;
                            refOverlayVisible.value = false;
                          }
                        }}
                      >
                        确认
                      </button>
                    </div>
                  </Form>
                </main>
              </div>
            </VOverlay>
          </div>
        </MainLayout>
        <div
          style={{
            visibility: overlayVisibleRef.value ? "visible" : "hidden",
          }}
        >
          <Overlay parentPath={route.fullPath} />
          <OverlayMask onBlurOverlay={blurOverlay} />
        </div>
      </>
    );
  },
});
