import { defineComponent, ref } from "vue";
// import s from "./ItemsList.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import SvgIcon from "./SvgIcon";
import { ItemSummary } from "./ItemSummary";
import { TabsTime } from "@/layouts/TabsTimeLayout";
export type ItemsListName = "本月" | "上月" | "今年" | "自定义";
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <TabsTime comp={ItemSummary as any} title="蓝莓记账" />;
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
      </MainLayout>
    );
  },
});
