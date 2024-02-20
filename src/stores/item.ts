import { httpClient } from "@/shared";

export const useItemDataStore = (timeLine: DateScope) =>
  defineStore(`item-${timeLine}`, () => {
    const itemData = useSessionStorage<IItem[]>(`item-${timeLine}`, [], {
      mergeDefaults: true,
    });
    const capacity = computed(() => itemData.value.length);
    // ?TODO: compose to one object -- map once
    const summary = computed<{
      expenses: number;
      income: number;
    }>(() => {
      let summaryExp = 0;
      let summaryInc = 0;
      itemData.value.map((item) => {
        if (item.kind === "expenses") {
          summaryExp += item.amount;
        } else {
          summaryInc += item.amount;
        }
      });
      return {
        expenses: summaryExp,
        income: summaryInc,
      };
    });
    const balance = computed(
      () => summary.value.income - summary.value.expenses
    );
    const fetchItems = async (startDate: string, endDate: string) => {
      const response = await httpClient.get<Resources<IItem>>(
        "/items",
        {
          bill_start: startDate,
          bill_end: endDate,
          ownItemNumber: capacity.value,
        },
        {
          _mock: "itemIndex",
          _loading: true,
        }
      );
      // console.log("fetchItems response :>> ", response.data);
      if (response.data && response.data.resources.length !== 0) {
        itemData.value.push(...response.data.resources);
      }
    };
    return {
      balance,
      capacity,
      fetchItems,
      itemData,
      summary,
    };
  })();
