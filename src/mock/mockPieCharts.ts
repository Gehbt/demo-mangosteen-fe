import { fakerZH_CN } from "@faker-js/faker";
import type { AxiosResponse } from "axios";
import type { Mock } from "Mock-Type";
const mkPieData = (n = 5, config?: {}) =>
  Array.from({ length: n }).map<PieChartTypeOne>((_, i) => ({
    amount:
      window.parseFloat(fakerZH_CN.commerce.price({ min: 0, max: 8000_00 })) +
      2000_00,
    tag_id: i,
    tag: {
      id: i,
      name: fakerZH_CN.commerce.productName(),
      sign: fakerZH_CN.internet.emoji({ types: ["food"] }),
    },
  }));
export const mockPieChart: Mock<Resource<PieChartTypeOne[]>> = (config) => {
  const { kind } = config.params as {
    kind: TagKindType;
  };
  console.log("kind :>> ", kind);
  return {
    data: {
      resource: mkPieData(),
    },
    status: 200,
  } as AxiosResponse<Resource<PieChartTypeOne[]>>;
};
