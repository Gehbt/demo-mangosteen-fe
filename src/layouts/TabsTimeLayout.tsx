import { PropType, defineComponent, ref } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import s from "./TabsTimeLayout.module.scss";
import { Time } from "@/composables/date";
import { Overlay } from "vant";
import {
  Overlay as MyOverlay,
  OverlayMask as MyOverlayMask,
} from "@/components/Overlay";
import { Tab, Tabs } from "@/components/Tabs";
import { Form, FormItem } from "@/components/Form";
import type { ChartsType } from "@/components/statistics/Charts";
import type { ItemSummaryType } from "@/components/ItemSummary";
export type ItemsListName = "本月" | "上月" | "今年" | "自定义";
export const TabsTime = defineComponent({
  name: "TabsTimeLayout",
  props: {
    comp: {
      type: Object as PropType<ChartsType | ItemSummaryType>, //实际上它们的 类型一样
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const overlayVisibleRef = ref(false);
    const toggleOverlay = () => {
      overlayVisibleRef.value = true;
    };
    const blurOverlay = () => {
      overlayVisibleRef.value = false;
    };
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
        title={props.title}
        icon={svgs.menu}
        toggle={toggleOverlay}
        class={s.layout}
      >
        <Tabs
          v-model:selected={refSelected.value}
          class={s.tabs}
          classPrefix="customTabStyle"
          onUpdate:selected={(value) => {
            if (value === "自定义") {
              refOverlayVisible.value = true;
            }
          }}
        >
          <Tab name="本月">
            <props.comp
              startDate={timeList[0].start.format()}
              endDate={timeList[0].end.format()}
            />
          </Tab>
          <Tab name="上月">
            <props.comp
              startDate={timeList[1].start.format()}
              endDate={timeList[1].end.format()}
            />
          </Tab>
          <Tab name="今年">
            <props.comp
              startDate={timeList[2].start.format()}
              endDate={timeList[2].end.format()}
            />
          </Tab>
          <Tab name="自定义">
            <props.comp
              startDate={refCustomTime.value.start.format()}
              endDate={refCustomTime.value.end.format()}
            />
          </Tab>
        </Tabs>
        <Overlay
          show={refOverlayVisible.value}
          class={s.overlay}
          onClick={() => {
            // refOverlayVisible.value = false;
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
                    refCustomTime.value.start = new Time(new Date(emitTime));
                  }}
                ></FormItem>
                <FormItem
                  label="结束时间"
                  modelValue={refCustomTime.value.end.format()}
                  err_data={refErrBox.value}
                  clan="date"
                  onUpdate:modelValue={(emitTime: string) => {
                    refCustomTime.value.end = new Time(new Date(emitTime));
                  }}
                ></FormItem>
                <div class={[s.actions, s.formRow]}>
                  <button
                    type="button"
                    onClick={() => (refOverlayVisible.value = false)}
                  >
                    取消
                  </button>
                  <button type="submit">确认</button>
                </div>
              </Form>
            </main>
          </div>
        </Overlay>
        <div
          style={{
            visibility: overlayVisibleRef.value ? "visible" : "hidden",
          }}
        >
          <MyOverlay />
          <MyOverlayMask onBlurOverlay={blurOverlay} />
        </div>
      </MainLayout>
    );
  },
});
