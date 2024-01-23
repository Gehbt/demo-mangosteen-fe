import { defineComponent, ref } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import { ItemSummary } from "./ItemSummary";
import { TabsTime } from "@/layouts/TabsTimeLayout";
import { httpClient } from "@/shared";
import { Button } from "./Button";
import { ItemsCreateName, i18nTagKind } from "@/shared/i18n-simple";

export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <TabsTime comp={ItemSummary} title="蓝莓记账" />;
  },
});

export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  setup(props, context) {
    const router = useRouter();
    const selectedTab = ref<TagKindType>("expenses");
    onMounted(async () => {
      const response_expenses = await httpClient.get<
        Resources<TagType<"expenses">>
      >("/tags", {
        kind: "expenses",
        _mock: "tagIndex",
        page: 1,
        ownedNumber: refExpensesTagsLength.value,
      });
      console.log("response_exp :>> ", response_expenses);
      refExpensesTags.value = response_expenses.data.resources;

      const response_income = await httpClient.get<
        Resources<TagType<"income">>
      >("/tags", {
        kind: "income",
        _mock: "tagIndex",
        ownedNumber: refIncomeTagsLength,
      });
      console.log("response_inc :>> ", response_income);
      refIncomeTags.value = response_income.data.resources;
    });
    const refExpensesTags = ref<TagType<"expenses">[]>([]);
    const refExpensesTagsLength = computed(() => refExpensesTags.value.length);
    const refIncomeTags = ref<TagType<"income">[]>([]);
    const refIncomeTagsLength = computed(() => refIncomeTags.value.length);

    const updateSelected = (tabName: TagKindType) =>
      (selectedTab.value = tabName);

    const getMoreTags = async () => {
      console.log("selectedTab.value :>> ", selectedTab.value);
      // const response_expenses = await httpClient.get<
      //   Resources<TagType<"expenses">>
      // >("/tags", {
      //   kind: "expenses",
      //   _mock: "tagIndex",
      //   page: 1,
      // });
      // console.log("response_exp :>> ", response_expenses);
      // refExpensesTags.value = response_expenses.data.resources;
    };
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
            <Tab name="expenses">
              <div class={s.tags_wrapper}>
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
              </div>
              <p class={s.load}>
                {true ? (
                  <span onClick={getMoreTags}>加载更多</span>
                ) : (
                  <span>到底了</span>
                )}
              </p>
            </Tab>
            <Tab name="income">
              <div class={s.tags_wrapper}>
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
              </div>
              <p class={s.load}>
                {true ? (
                  <span onClick={getMoreTags}>加载更多</span>
                ) : (
                  <span>到底了</span>
                )}
              </p>
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
