import { defineComponent, PropType } from "vue";
import s from "./ItemSummary.module.scss";
import { Floatbutton } from "./Button";
import { httpClient } from "@/shared";
export type ItemSummaryType = typeof ItemSummary;
export const ItemSummary = defineComponent({
  props: {
    timeLine: string().isRequired,
    startDate: string().isRequired,
    endDate: string().isRequired,
  },
  setup: (props, context) => {
    const router = useRouter();

    const capacity = ref(0);
    const itemData = useSessionStorage<ItemType[]>(
      `item_data_${props.timeLine}`,
      [],
      {
        mergeDefaults: true,
      }
    );

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
    const balance = computed(() => income.value - expenses.value);

    const fetchItemAmount = async () => {
      const response = await httpClient.get<Resource<AmountType>>("/items", {
        bill_start: props.startDate,
        bill_end: props.endDate,
        ownItemNumber: capacity.value,
        _mock: "itemIndexAmount",
      });
      // expenses.value = response.data.resource.amount_expenses;
      // income.value = response.data.resource.amount_income;
    };

    const fetchItems = async () => {
      if (!itemData.value || itemData.value.length === 0) {
        const response = await httpClient.get<Resources<ItemType>>("/items", {
          bill_start: props.startDate,
          bill_end: props.endDate,
          ownItemNumber: capacity.value,
          _mock: "itemIndex",
        });
        console.log("fetchItems response :>> ", response);
        itemData.value = response.data.resources;
      }
    };
    // onMounted(fetchItemAmount);
    onMounted(fetchItems);
    return () => (
      <div class={s.wrapper}>
        {/* ?TODO: tab 被挤压 */}
        <ItemSummaryTab
          expenses={expenses.value}
          income={income.value}
          balance={balance.value}
        />
        <ItemSummaryItem summaryItems={itemData.value} />
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
          <strong>{props.income}</strong>
        </li>
        <li onClick={() => {}}>
          <span>净收入</span>
          <strong>{props.balance}</strong>
        </li>
        <li onClick={() => {}}>
          <span>支出</span>
          <strong>{props.expenses}</strong>
        </li>
      </ul>
    );
  },
});
const ItemSummaryItem = defineComponent({
  name: "ItemSummaryItem",
  props: {
    summaryItems: array<ItemType>().def([]),
  },
  setup(props, context) {
    // !USELESS just declare
    let index: number;
    let item: ItemType;
    return () => (
      <>
        <ol class={s.list}>
          <li
            // @ts-expect-error
            v-for={(item, index) in props.summaryItems}
            key={index}
          >
            {/* TODO: replace to item */}
            <div class={s.sign}>
              <span>{item.sign}</span>
            </div>
            <div class={s.text}>
              <div class={s.tagAndAmount}>
                <span class={s.tag}>{item.name}</span>
                <span
                  class={[s.amount, item.kind === "expenses" ? s.exp : s.inc]}
                >
                  <strong>{item.kind === "expenses" ? "-" : "+"}</strong>￥
                  {item.amount}
                </span>
              </div>
              <div class={s.time}>{item.happen_at}</div>
            </div>
          </li>
          <li class={s.more}>
            <div>向下滑动加载更多</div>
          </li>
        </ol>
      </>
    );
  },
});
