import s from "./ItemSummary.module.scss";
import { Floatbutton } from "./Button";
import { Time } from "@/composables";
import { useItemDataStore } from "@/stores/item";
export type ItemSummaryType = typeof ItemSummary;
export const amountToPrice = (amount: number) => (amount / 100).toFixed(2);
export const ItemSummary = defineComponent({
  props: {
    timeLine: {
      type: String as PropType<DateScope>,
      required: true,
    },
    // string<DateScope>().isRequired,
    startDate: {
      type: String,
      required: true,
    },
    // string().isRequired,
    endDate: {
      type: String,
      required: true,
    },
    // string().isRequired,
  },
  setup: (props, context) => {
    const router = useRouter();
    // ?TODO: 'custom' call fetch, forget storage, maybe need refact add metadata
    // TODO?
    const itemStore = useItemDataStore(props.timeLine);
    // onMounted(fetchItemAmount);
    onBeforeMount(() => {
      sessionStorage.setItem("skipStart", "yes");
    });
    onMounted(async () => {
      if (!itemStore.itemData || itemStore.itemData.length === 0) {
        itemStore.fetchItems(props.startDate, props.endDate);
      }
    });
    onBeforeUnmount(() => {
      console.log(props.timeLine, " :>> Unmount");
      itemStore.itemData = [];
    });
    return () => (
      <div class={s.wrapper}>
        {/* ?TODO: tab 被挤压 */}
        <ItemSummaryTab
          expenses={itemStore.summary.expenses}
          income={itemStore.summary.income}
          balance={itemStore.balance}
        />
        <ItemSummaryItem
          summaryItems={itemStore.itemData}
          onUpdate:summaryItems={() => {
            itemStore.fetchItems(props.startDate, props.endDate);
          }}
        />

        <Floatbutton
          iconName={svgs.edit}
          onClick={() => {
            router.push("/items/create");
          }}
        />
      </div>
    );
  },
});

const ItemSummaryTab = defineComponent({
  name: "ItemSummaryTab",
  props: {
    expenses: { type: Number, required: true },
    // number().isRequired,
    income: { type: Number, required: true },
    // number().isRequired,
    balance: { type: Number, required: true },
    // number().isRequired,
  },
  setup(props, context) {
    return () => (
      <ul class={s.total}>
        <li
          onClick={() => {
            // TODO:只筛选当前选项展示
            console.log("TODO :>> only this kind");
          }}
        >
          <strong>收入</strong>
          <strong>{amountToPrice(props.income)}</strong>
        </li>
        <li onClick={() => {}}>
          <strong>净收入</strong>
          <strong>{amountToPrice(props.balance)}</strong>
        </li>
        <li onClick={() => {}}>
          <strong>支出</strong>
          <strong>{amountToPrice(props.expenses)}</strong>
        </li>
      </ul>
    );
  },
});
const ItemSummaryItem = defineComponent({
  name: "ItemSummaryItem",
  props: {
    summaryItems: { type: Array as PropType<IItem[]>, required: true },
    // array<IItem>().isRequired,
  },
  emits: ["update:summaryItems"],
  setup(props, context) {
    // !USELESS just declare
    return () => (
      <ol class={s.list} id="itemSummaryItemOrderList">
        {props.summaryItems.map((item, index) => (
          <li key={index}>
            {/* TODO: replace to item */}
            <div class={s.sign}>
              <span>{item.sign}</span>
            </div>
            <div class={s.text}>
              <div class={s.tagAndAmount}>
                <span class={s.tag}>{item.name}</span>
                <Money item={item} />
              </div>
              <div class={s.time}>
                {new Time(item.happen_at!).format("YYYY年MM月DD日 hh:mm:ss")}
              </div>
            </div>
          </li>
        ))}
        <li class={s.more}>
          <div
            onClick={() => {
              console.log("toggle emit:>> ");
              context.emit("update:summaryItems");
            }}
          >
            向下滑动加载更多
          </div>
        </li>
      </ol>
    );
  },
});
export const Money = defineComponent({
  name: "Money",
  props: {
    item: {
      type: Object as PropType<Pick<IItem, "amount" | "kind">>,
      required: true,
    },
    // object<Pick<IItem, "amount" | "kind">>().isRequired,
  },
  setup(props, context) {
    return () => (
      <span class={[s.amount, props.item.kind === "expenses" ? s.exp : s.inc]}>
        <strong>{props.item.kind === "expenses" ? "-" : "+"}</strong>￥
        {amountToPrice(props.item.amount)}
      </span>
    );
  },
});
