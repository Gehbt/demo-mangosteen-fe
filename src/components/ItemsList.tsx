import { PropType, defineComponent, ref } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import { ItemSummary } from "./ItemSummary";
import { TabsTime } from "@/layouts/TabsTimeLayout";
import { httpClient } from "@/shared";

export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <TabsTime comp={ItemSummary} title="蓝莓记账" />;
  },
});
const useTags = () => {
  const refExpensesTags = ref<TagType<"expenses">[]>([]);
  const refIncomeTags = ref<TagType<"income">[]>([]);
  const tagKindTransfer: Record<TagKindType, Ref<TagType[]>> = {
    expenses: refExpensesTags,
    income: refIncomeTags,
  };
  const fetchTags = async (kind: TagKindType) => {
    const response_tags = await httpClient.get<Resources<TagType>>("/tags", {
      kind,
      _mock: "tagIndex",
      ownedTagNumber: tagKindTransfer[kind].value.length,
    });
    console.log("response :>> ", response_tags);
    if (response_tags.data) {
      tagKindTransfer[kind].value.push(...response_tags.data.resources);
    }
  };
  return {
    fetchTags,
    refExpensesTags,
    refIncomeTags,
  };
};
export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  setup(props, context) {
    const router = useRouter();
    const selectedTab = ref<TagKindType>("expenses");
    const { fetchTags, refExpensesTags, refIncomeTags } = useTags();

    // ! preload data
    onMounted(async () => {
      fetchTags("expenses");
      fetchTags("income");
    });

    const updateSelected = (tabName: TagKindType) =>
      (selectedTab.value = tabName);
    return () => (
      <MainLayout
        title="记一笔"
        icon={svgs.back}
        toggle={() => {
          console.log("back :>> /start");
          router.push("/start");
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
              <TagGrid
                kind="expenses"
                doFetch={fetchTags}
                tagsSrc={refExpensesTags}
              />
            </Tab>
            <Tab name="income">
              <TagGrid
                kind="income"
                doFetch={fetchTags}
                tagsSrc={refIncomeTags}
              />
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

const TagGrid = defineComponent({
  name: "TagGrid",
  props: {
    kind: {
      type: String as PropType<TagKindType>,
      required: true,
    },
    tagsSrc: {
      type: Object as PropType<Ref<TagType[]>>,
      required: true,
    },
    doFetch: {
      type: Function as PropType<(kind: TagKindType) => Promise<void>>,
      required: true,
    },
  },
  setup(props, context) {
    const router = useRouter();
    return () => (
      <>
        {/* ?TODO:记录滚动条 */}
        <div class={s.tags_wrapper}>
          <div class={[s.tag, s.selected]}>
            <button
              onClick={() => {
                router.push("/tags/create");
              }}
              class={s.sign}
            >
              <svg-icon name={svgs.round_add} class={s.createTag} />
            </button>
            <div class={s.name}>新增</div>
          </div>
          {props.tagsSrc.value.map((tag) => (
            <div class={[s.tag, s.selected]}>
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.name}>{tag.name}</div>
            </div>
          ))}
        </div>
        {/* ?TODO: 使用下拉更新 */}
        <p class={s.load}>
          {props.tagsSrc.value.length !== 30 ? (
            <span
              class={s.loadMore}
              onClick={() => {
                props.doFetch(props.kind);
              }}
            >
              加载更多
            </span>
          ) : (
            <span class={s.noMore}>到底了</span>
          )}
        </p>
      </>
    );
  },
});
