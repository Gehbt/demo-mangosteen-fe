import type { Mock } from "./type.ts";
import { fakerZH_CN } from "@faker-js/faker";
import { AxiosResponse } from "axios";

const mkLineData = (
  n: number,
  config: {
    bill_end: string;
    bill_start: string;
  }
) => {
  return Array.from<LineChartType>({ length: n }).map(
    (_, index) =>
      ({
        amount:
          window.parseFloat(
            fakerZH_CN.commerce.price({ min: 0, max: 8000_00 })
          ) + 2000_00,
        happen_at: new Date(`2024-1-${index + 1}`).toISOString(),
      } as LineChartTypeOne)
  );
};

export const mockLineChart: Mock<Resource<LineChartType>> = (config) => {
  const { bill_end, bill_start, queryNumber } = config.params as {
    // TODO: with queryNumber
    queryNumber: number;
    bill_end: string;
    bill_start: string;
  };
  return {
    data: {
      resource: mkLineData(queryNumber ?? 30, { bill_start, bill_end }),
    },
    status: 200,
  } as AxiosResponse<Resource<LineChartType>>;
};
