import { Time } from "@/composables";

export const mkLineData = (
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
        window.parseFloat(Math.random().toFixed(6)) + 2000_00,
      happen_at:
        config.init_happen_at ??
        new Time(config.bill_start).add(index, "day").toISOString(),
      kind: config.kind,
    })
  );
};
