import { Time } from "@/composables";
import { fakerZH_CN } from "@faker-js/faker";
import { type AxiosResponse } from "axios";
import type { Mock } from "Mock-Type";
// 保留,已有自己的版本
const mkLineData = (
  n: number,
  config: {
    kind: TagKind;
    bill_end: string;
    bill_start: string;
    init_amount?: number;
    init_happen_at?: string;
  }
) => {
  return Array.from<LineChartType>({ length: n }).map<LineChartTypeOne>(
    (_, index) => ({
      amount:
        config.init_amount ??
        window.parseFloat(fakerZH_CN.commerce.price({ min: 0, max: 8000_00 })) +
          2000_00,
      happen_at:
        config.init_happen_at ??
        new Time(config.bill_start).add(index, "day").toISOString(),
      kind: config.kind,
    })
  );
};

export const mockLineChart: Mock<Resource<LineChartType>> = (config) => {
  const { bill_end, bill_start, desiredNumber, kind } = config.params as {
    // TODO: 前端计算的天数
    desiredNumber: number;
    bill_start: string;
    bill_end: string;
    kind: TagKind;
  };
  console.log("bill_start :>> ", bill_start);
  console.log("bill_end :>> ", bill_end);
  return {
    data: {
      resource: mkLineData(desiredNumber ?? 28, {
        bill_start,
        bill_end,
        kind,
      }),
    },
    status: 200,
  } as AxiosResponse<Resource<LineChartType>>;
};
export const mockLineChartLess: Mock<Resource<LineChartType>> = (config) => {
  const { bill_end, bill_start, desiredNumber, kind } = config.params as {
    // TODO: 前端计算的天数
    desiredNumber: number;
    bill_start: string;
    bill_end: string;
    kind: TagKind;
  };
  return {
    data: {
      resource: mkLineData(desiredNumber ?? 28, {
        bill_start,
        bill_end,
        kind,
      }).filter((data) => Math.random() > 0.5),
    },
    status: 200,
  } as AxiosResponse<Resource<LineChartType>>;
};
