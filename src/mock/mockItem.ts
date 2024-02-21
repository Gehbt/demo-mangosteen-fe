import type { Mock } from "Mock-Type";
import { fakerZH_CN } from "@faker-js/faker";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { mkPager } from "./mockTag";
export const mockItemCreate: Mock<IItemUser> = (
  config: AxiosRequestConfig<IItemUser>
) => {
  // TODO: 修改这个类型转换
  // axios post方法 的AxiosRequestConfig的data是序列化的ItemType
  const json = JSON.parse(config.data as unknown as string) as IItemUser;
  console.log("json :>> ", config);
  if (!json) {
    throw {
      response: { data: { error_message: "无数据" }, status: 500 },
    } as AxiosError<OnAxiosError>;
  } else if (!json.tag_ids || json.tag_ids[0] === -1) {
    console.log("json.tag_ids :>> ", json.tag_ids);
    // 无id
    throw {
      response: { data: { error_message: "未选择tag的id" }, status: 422 },
    } as AxiosError<OnAxiosError>;
  } else if (!json.amount) {
    // 有id 但无账目
    throw {
      response: { data: { error_message: "金额不能为0" }, status: 422 },
    } as AxiosError<OnAxiosError>;
  }
  return {
    data: {
      id: fakerZH_CN.number.int(),
      user_id: fakerZH_CN.number.int(),
      amount: window.parseInt(fakerZH_CN.finance.amount()),
      note: null,
      tag_ids: json.tag_ids,
      happen_at: fakerZH_CN.date.anytime(),
      // updated_at: fakerZH_CN.date.anytime(),/* useleess */
      // created_at: fakerZH_CN.date.anytime(),/* useleess */
      kind: json.kind,
    },
    status: 200,
  } as AxiosResponse<IItemUser>;
};
function mkItem(
  ctxId: number = 0,
  n: number = 1,
  config: {
    bill_end: string;
    bill_start: string;
  }
) {
  return Array.from<IItem>({ length: n }).map(
    (_, index) =>
      ({
        amount: window.parseFloat(
          fakerZH_CN.commerce.price({ min: 0, max: 1000_00 })
        ),
        id: index + ctxId + 1,
        kind: Math.random() > 0.5 ? "expenses" : "income",
        sign: fakerZH_CN.internet.emoji(),
        happen_at: fakerZH_CN.date
          .between({
            from: new Date(config.bill_start),
            to: new Date(config.bill_end),
          })
          .toISOString(),
        name: fakerZH_CN.commerce.product(),
      } as IItem)
  );
}

export const mockItemIndex: Mock<Resources<IItem>> = (
  config: AxiosRequestConfig<Resources<IItem>>
) => {
  console.log("itemIndex json :>> ", config.params);
  const { bill_end, bill_start, ownItemNumber } = config.params as {
    bill_end: string;
    bill_start: string;
    ownItemNumber: number;
  };

  const { wantNumberThisPage: wantItemNumberThisPage, pager } =
    mkPager(ownItemNumber);
  if (wantItemNumberThisPage === 0) {
    return { data: null, status: 204 } as AxiosResponse<null>;
  }
  const resources = mkItem(ownItemNumber, wantItemNumberThisPage, {
    bill_end,
    bill_start,
  });
  // console.log("resources :>> ", resources);
  return {
    data: {
      resources,
      pager,
    },
    status: 200,
  } as AxiosResponse<Resources<IItem>>;
};

// export const mockItemIndexAmount: Mock<Resource<any>> = (
//   config: AxiosRequestConfig<any>
// ) => {
//   console.log("itemIndex json :>> ", config.params);
//   const { bill_end, bill_start, ownItemNumber } = config.params as {
//     bill_end: string;
//     bill_start: string;
//     ownItemNumber: number;
//   };
//   return {
//     data: {
//       resource: {
//         amount_income: 996,
//         amount_expenses: 9999,
//       },
//     },
//     status: 200,
//   } as AxiosResponse<Resource<any>>;
// };
