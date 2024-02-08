import { defineComponent, PropType } from "vue";
import s from "./ItemSummary.module.scss";
import { Floatbutton } from "./Button";
import { httpClient } from "@/shared";
import { Time } from "@/composables";
export type ItemSummaryType = typeof ItemSummary;
export const amountToPrice = (amount: number) => (amount / 100).toFixed(2);
export const ItemSummary = defineComponent({
  props: {
    timeLine: string<DateScope>().isRequired,
    startDate: string().isRequired,
    endDate: string().isRequired,
  },
  setup: (props, context) => {
    const router = useRouter();
    // ?TODO: 'custom' call fetch, forget storage, maybe need refact add metadata
    const itemData = useSessionStorage<ItemType[]>(
      `item_data_${props.timeLine}`,
      [],
      {
        mergeDefaults: true,
      }
    );
    const capacity = computed(() => itemData.value.length);
    // ?TODO: compose to one object -- map once
    const expenses = computed(() => {
      let summary = 0;
      if (itemData.value.length === 0) {
        return 0;
      } else {
        itemData.value.map((item) => {
          if (item.kind === "expenses") {
            summary += item.amount;
          }
        });
        return summary;
      }
    });
    const income = computed(() => {
      let summary = 0;
      if (itemData.value.length === 0) {
        return 0;
      } else {
        itemData.value.map((item) => {
          if (item.kind === "income") {
            summary += item.amount;
          }
        });
        return summary;
      }
    });
    //* 实际上 expenses,income,balance 应该由后端查询给出
    const balance = computed(() => income.value - expenses.value);

    // const fetchItemAmount = async () => {
    //   const response = await httpClient.get<Resource<AmountType>>("/items", {
    //     bill_start: props.startDate,
    //     bill_end: props.endDate,
    //     ownItemNumber: capacity.value,
    //     _mock: "itemIndexAmount",
    //   });
    //   // expenses.value = response.data.resource.amount_expenses;
    //   // income.value = response.data.resource.amount_income;
    // };
    const fetchItems = async () => {
      const response = await httpClient.get<Resources<ItemType>>("/items", {
        bill_start: props.startDate,
        bill_end: props.endDate,
        ownItemNumber: capacity.value,
        _mock: "itemIndex",
      });
      console.log("fetchItems response :>> ", response.data);
      if (response.data && response.data.resources.length !== 0) {
        itemData.value.push(...response.data.resources);
      }
    };
    // onMounted(fetchItemAmount);

    onMounted(async () => {
      if (!itemData.value || itemData.value.length === 0) {
        fetchItems();
      }
    });
    onBeforeUnmount(() => {
      console.log(props.timeLine, " :>> Unmount");
      itemData.value = [];
    });
    return () => (
      <div class={s.wrapper}>
        {/* ?TODO: tab 被挤压 */}
        <ItemSummaryTab
          expenses={expenses.value}
          income={income.value}
          balance={balance.value}
        />
        <ItemSummaryItem
          summaryItems={itemData}
          doFetch={fetchItems}
          onUpdate:summaryItems={() => {
            fetchItems();
          }}
        />

        <Floatbutton
          iconName={svgs.round_add}
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
    expenses: number().isRequired,
    income: number().isRequired,
    balance: number().isRequired,
  },
  setup(props, context) {
    return () => (
      <ul class={s.total}>
        <li
          onClick={() => {
            // TODO:只筛选当前选项展示
          }}
        >
          <span>收入</span>
          <strong>{amountToPrice(props.income)}</strong>
        </li>
        <li onClick={() => {}}>
          <span>净收入</span>
          <strong>{amountToPrice(props.balance)}</strong>
        </li>
        <li onClick={() => {}}>
          <span>支出</span>
          <strong>{amountToPrice(props.expenses)}</strong>
        </li>
      </ul>
    );
  },
});
const ItemSummaryItem = defineComponent({
  name: "ItemSummaryItem",
  props: {
    summaryItems: {
      type: Object as PropType<Ref<ItemType[]>>,
      required: true,
    },
    doFetch: func<() => Promise<void>>().isRequired,
  },
  emits: ["update:summaryItems"],
  setup(props, context) {
    // !USELESS just declare
    return () => (
      <ol class={s.list} id="itemSummaryItemOrderList">
        {props.summaryItems.value.map((item, index) => (
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
    item: object<Pick<ItemType, "amount" | "kind">>().isRequired,
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
