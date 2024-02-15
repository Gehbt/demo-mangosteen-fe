import { fakerZH_CN } from "@faker-js/faker";
import { AxiosResponse } from "axios";
import type { Mock } from "Mock-Type";
export const mkLineData = (
  n: number,
  config: {
    bill_end: string;
    bill_start: string;
    init_amount?: number;
    init_happen_at?: string;
  }
) => {
  return Array.from<LineChartType>({ length: n }).map(
    (_, index) =>
      ({
        amount:
          config.init_amount ??
          window.parseFloat(
            fakerZH_CN.commerce.price({ min: 0, max: 8000_00 })
          ) + 2000_00,
        // TODO: 使用传入的时间
        happen_at:
          config.init_happen_at ??
          new Date(`2024-01-${index + 1}`).toISOString(),
      } as LineChartTypeOne)
  );
};

export const mockLineChart: Mock<Resource<LineChartType>> = (config) => {
  const { bill_end, bill_start, desiredNumber } = config.params as {
    // TODO: 前端计算的天数
    desiredNumber?: number;
    bill_start: string;
    bill_end: string;
  };
  console.log("bill_start :>> ", bill_start);
  console.log("bill_end :>> ", bill_end);
  return {
    data: {
      resource: mkLineData(desiredNumber ?? 30, { bill_start, bill_end }),
    },
    status: 200,
  } as AxiosResponse<Resource<LineChartType>>;
};
export const mockLineChartLess: Mock<Resource<LineChartType>> = (config) => {
  const { bill_end, bill_start, desiredNumber } = config.params as {
    // TODO: 前端计算的天数
    desiredNumber?: number;
    bill_start: string;
    bill_end: string;
  };
  console.log("bill_start :>> ", bill_start);
  console.log("bill_end :>> ", bill_end);
  return {
    data: {
      resource: mkLineData(desiredNumber ?? 30, {
        bill_start,
        bill_end,
      }).filter((data) => Math.random() > 0.5),
    },
    status: 200,
  } as AxiosResponse<Resource<LineChartType>>;
};
