import { Transition } from "vue";
import { MainLayout } from "@/layouts/MainLayout";
import { Tab, Tabs } from "./Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemsList.module.scss";
import { ItemSummary } from "./ItemSummary";
import { TabsTimeLayout } from "@/layouts/TabsTimeLayout";
import { httpClient } from "@/shared";
import { Button } from "./Button";
import {
  time,
  type InvalidateError,
  type RulesType,
  validate,
  errorFree,
} from "@/composables";
import { AxiosError } from "axios";
import { showDialog } from "vant";
import type { HeadType } from "DefineHeadType";
import { itemsRules } from "@/static";
// import type { HeadType } from "DefineHeadType";

export const ItemsList = defineComponent({
  name: "ItemsList",
  setup(props, context) {
    return () => <TabsTimeLayout comp={ItemSummary} title="蓝莓记账" />;
  },
});
function useTags() {
  const refExpensesTags = ref<ITag<"expenses">[]>([]);
  const refIncomeTags = ref<ITag<"income">[]>([]);
  const tagKindTransfer: Record<TagKindType, Ref<ITag[]>> = {
    expenses: refExpensesTags,
    income: refIncomeTags,
  };
  const fetchTags = async (kind: TagKindType) => {
    const response_tags = await httpClient.get<Resources<ITag>>(
      "/tags",
      {
        kind,
        ownedTagNumber: tagKindTransfer[kind].value.length,
      },
      {
        _mock: "tagIndex",
        _loading: true,
      }
    );
    // console.log("response :>> ", response_tags);
    if (response_tags.data) {
      tagKindTransfer[kind].value.push(...response_tags.data.resources);
    }
    return; // TODO:return kind?
  };
  return {
    fetchTags,
    refExpensesTags,
    refIncomeTags,
  };
}

export const ItemsCreate = defineComponent({
  name: "ItemsCreate",
  head: {
    title: "记一笔",
  } as HeadType,
  setup(props, context) {
    const router = useRouter();
    const refSelectedTab = ref<TagKindType>("expenses");
    const refExpTagId = ref<number>(0);
    const refIncTagId = ref<number>(0);
    const TagIdMap: Record<TagKindType, Ref<number>> = {
      expenses: refExpTagId,
      income: refIncTagId,
    };

    // 点击控制 inputpad
    const refManualToggle = ref(false);
    // 实际控制 inputpad
    const refUnfold = ref(false);
    // 点击 按钮 控制
    watch([refManualToggle], () => {
      refUnfold.value = !refUnfold.value;
    });
    // 点击 id 触发展开
    watch([refExpTagId, refIncTagId], () => {
      // 仅在 折叠时展开
      if (refUnfold.value === false) {
        refUnfold.value = true;
      }
    });
    // 在切换tab时折叠
    watch(refSelectedTab, () => {
      refUnfold.value = false;
    });
    watchEffect(() => {
      console.log("Effect!");
    });
    const refAmount = ref("0");
    // nowDate: 记录当前时间
    const nowDate = time(new Date()).format().split("-") as [
      string,
      string,
      string
    ];
    const refDate = ref<[string, string, string]>(nowDate);
    const { fetchTags, refExpensesTags, refIncomeTags } = useTags();

    const expenses_tags = useSessionStorage<ITag<"expenses">[]>(
      "expenses_tags",
      [],
      {
        mergeDefaults: true,
      }
    );
    const income_tags = useSessionStorage<ITag<"income">[]>("income_tags", [], {
      mergeDefaults: true,
    });
    // ! preload data
    onBeforeMount(() => {
      // 记录refExpensesTags和refIncomeTags
      // console.log("expenses_tags :>> ", expenses_tags);
      if (!expenses_tags.value || expenses_tags.value.length === 0) {
        expenses_tags.value = refExpensesTags.value;
      }
      if (!income_tags.value || income_tags.value.length === 0) {
        income_tags.value = refIncomeTags.value;
      }
    });

    onMounted(async () => {
      if (!expenses_tags.value || expenses_tags.value.length === 0) {
        fetchTags("expenses");
      } else {
        refExpensesTags.value = expenses_tags.value;
      }
      if (!income_tags.value || income_tags.value.length === 0) {
        requestIdleCallback(() => fetchTags("income"));
      } else {
        refIncomeTags.value = income_tags.value;
      }
    });
    const updateSelected = (tabName: TagKindType) =>
      (refSelectedTab.value = tabName);
    const amountFloat = computed(() => parseFloat(refAmount.value));
    const handleSubmit = async (e: Event) => {
      const formData: ComputedRef<IItemQuery> = computed(() => ({
        // 带下划线的名字是数据库风格
        kind: refSelectedTab.value,
        tag_ids: JSON.stringify([TagIdMap[refSelectedTab.value].value]),
        happen_at: new Date(refDate.value.join("-")).toISOString(),
        amount: amountFloat.value.toString(),
      }));
      const errData: Ref<InvalidateError<IItemQuery>> = ref({
        amount: [],
        happen_at: [],
        kind: [],
        tag_ids: [],
      });

      errData.value = validate(formData.value, itemsRules);
      // DO vaildate
      if (!errorFree(errData.value)) {
        console.log("formData.value :>> ", formData.value);
        console.log("errData.value :>> ", errData.value);
        Reflect.ownKeys({ "123": 1 });
        showDialog({ message: Object.values(errData.value).join("\n") });
        return;
      }
      e.preventDefault();
      await httpClient
        .post<Resource<IItemUser>>("/items", formData.value, {
          _mock: "itemCreate",
          _loading: true,
        })
        .then(() => {
          // time reset
          refDate.value = nowDate;
          refAmount.value = "0";
          router.push("/items");
        })
        .catch((err: AxiosError<OnAxiosError>) => {
          if (err.response?.status === 422) {
            showDialog({
              message: "错误: " + err.response?.data.error_message,
            });
            return;
          }
          throw err.cause;
        });
    };
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
            v-model:selected={refSelectedTab.value}
            onUpdate:selected={updateSelected}
            class={s.tabs}
          >
            <Tab name="expenses">
              {/* {refDate.value}
              {"|" + refAmount.value} */}
              <TagGrid
                kind="expenses"
                doFetch={fetchTags}
                tagsSrc={refExpensesTags}
                v-model:selected={refExpTagId.value}
              />
            </Tab>
            <Tab name="income">
              <TagGrid
                kind="income"
                doFetch={fetchTags}
                tagsSrc={refIncomeTags}
                v-model:selected={refIncTagId.value}
              />
            </Tab>
          </Tabs>
          <Button
            // class={[!refToggle.value ? s["btn-toggle"] : ""]}
            onClick={() => {
              refManualToggle.value = !refManualToggle.value;
            }}
          >
            点击{refUnfold.value ? "折叠" : "展开"}
          </Button>

          <Transition
            enterFromClass={s.col_in_enter_from}
            leaveToClass={s.col_in_leave_to}
            enterActiveClass={s.col_in_enter_active}
            leaveActiveClass={s.col_in_leave_active}
          >
            <InputPad
              v-if={refUnfold.value}
              v-model:inputAmount={refAmount.value}
              v-model:inputDate={refDate.value}
              handleSubmit={handleSubmit}
            />
          </Transition>
        </div>
      </MainLayout>
    );
  },
});

const TagGrid = defineComponent({
  name: "TagGrid",
  props: {
    kind: string<TagKindType>().isRequired,
    tagsSrc: object<Ref<ITag[]>>().isRequired,
    doFetch: func<(kind: TagKindType) => Promise<void>>().isRequired,
    selected: number(),
  },
  emits: ["update:selected"],
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const onSelect = (id: number) => {
      context.emit("update:selected", id);
    };
    // longPress Event
    const timer = ref<number>();
    const currentTag = ref<HTMLDivElement>();
    const longPressAct = (tag: ITag) => {
      console.log("longPress :>> ", tag);
      // console.log("router.currentRoute.value :>> ", router.currentRoute.value);
      // TODO: use `URLSearchParams` && `decodeURIComponent`
      router.push(
        `/tags/${tag.id}/edit?return_to=${route.fullPath}&kind=${tag.kind}`
      );
    };

    const onTouchStart = (e: TouchEvent, tag: ITag) => {
      currentTag.value = e.currentTarget as HTMLDivElement;
      timer.value = window.setTimeout(() => {
        longPressAct(tag);
      }, 500);
    };
    const pointedElement = ref<HTMLDivElement>();
    const onTouchMove = (e: TouchEvent) => {
      pointedElement.value = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      ) as HTMLDivElement;
      if (
        pointedElement.value !== currentTag.value &&
        currentTag.value?.contains(pointedElement.value) === false
      ) {
        clearTimeout(timer.value);
      }
    };

    const onTouchEnd = () => {
      clearTimeout(timer.value);
    };

    return () => (
      <>
        {/* ?TODO:记录滚动条 */}
        <div class={s.tags_wrapper}>
          <div class={[s.tag, s.selected]}>
            <button
              onClick={() => {
                router.push(`/tags/create?kind=${props.kind}`);
              }}
              class={s.sign}
            >
              <svg-icon name={svgs.round_add} class={s.createTag} />
            </button>
            <div class={s.name}>新增预设</div>
          </div>
          {props.tagsSrc.value.map((tag) => (
            <div
              onTouchmove={onTouchMove}
              onTouchstart={(e) => onTouchStart(e, tag)}
              onTouchend={onTouchEnd}
              class={[s.tag, props.selected === tag.id ? s.selected : ""]}
              onClick={() => {
                onSelect(tag.id);
              }}
              key={tag.id}
            >
              <div class={s.sign}>{tag.sign}</div>
              <div class={s.name}>
                {tag.name}
                {tag.id}
              </div>
            </div>
          ))}
        </div>
        {/* ?TODO: 使用下拉更新 */}
        <p class={s.load}>
          {props.tagsSrc.value.length !== 60 ? (
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
