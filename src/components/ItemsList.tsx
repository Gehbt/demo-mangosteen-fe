import { defineComponent, ref } from "vue";
// import s from "./ItemsList.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import SvgIcon from "./SvgIcon";
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    const router = useRouter();
    const refSelected = ref<"本月" | "上月" | "今年" | "自定义">("本月");
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
            <div class={s.itemsList}>
              <div class={s.tabs}>
                <Tabs
                  v-model:selected={refSelected.value}
                  class={s.tabs}
                  classPrefix={"customTabStyle"}
                >
                  <Tab name="本月">
                    <div class={s.tab}>
                      <span>1</span>
                    </div>
                  </Tab>
                  <Tab name="上月">
                    <div class={s.tab}>
                      <span>2</span>
                    </div>
                  </Tab>
                  <Tab name="今年">
                    <div class={s.tab}>
                      <span>3</span>
                    </div>
                  </Tab>
                  <Tab name="自定义">
                    <div class={s.tab}>
                      <span>4</span>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});

export type ItemsName = "支出" | "收入";
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
            //   onUpdateSelected={updateSelected}
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
