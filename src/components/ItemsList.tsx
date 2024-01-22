import { defineComponent, ref } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import { ItemSummary } from "./ItemSummary";
import { TabsTime } from "@/layouts/TabsTimeLayout";
import { httpClient } from "@/shared";
export type ItemsListName = "本月" | "上月" | "今年" | "自定义";

export type TagType<T extends "expenses" | "income" | string> = {
  id: string;
  name: string;
  sign: string;
  kind: T;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};
export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <TabsTime comp={ItemSummary} title="蓝莓记账" />;
  },
});
const date = new Date();
export type ItemsCreateName = "支出" | "收入";
export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  setup(props, context) {
    const selectedTab = ref<"支出" | "收入">("支出");
    onMounted(async () => {
      const response_expenses = await httpClient.get("/tags", {
        kind: "expenses",
        _mock: "tagIndex",
      });
      console.log("response_exp :>> ", response_expenses);
      refExpensesTags.value = response_expenses.data as TagType<"expenses">[];

      const response_income = await httpClient.get("/tags", {
        kind: "expenses",
        _mock: "tagIndex",
      });
      console.log("response_inc :>> ", response_income);
      refIncomeTags.value = response_income.data as TagType<"income">[];
    });
    const refExpensesTags = ref<TagType<"expenses">[]>([]);

    const refIncomeTags = ref<TagType<"income">[]>([]);
    const router = useRouter();
    const updateSelected = (tabName: ItemsCreateName) =>
      (selectedTab.value = tabName);
    return () => (
      <MainLayout
        title="记一笔"
        icon={svgs.back}
        toggle={() => {
          console.log("back :>> /start");
          router.replace("/start");
        }}
        class={s.layout} // todo: layout
      >
        <div class={s.wrapper}>
          <Tabs
            v-model:selected={selectedTab.value}
            onUpdate:selected={updateSelected}
            class={s.tabs}
          >
            <Tab name="支出" class={s.tags_wrapper}>
              <div class={[s.tag, s.selected]}>
                <button
                  onClick={() => {
                    router.replace("/tags/create");
                  }}
                  class={s.sign}
                >
                  <svg-icon name={svgs.round_add} class={s.createTag} />
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
                  <svg-icon name={svgs.round_add} class={s.createTag} />
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
