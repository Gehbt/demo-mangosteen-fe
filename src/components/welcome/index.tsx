import { defineComponent } from "vue";
import s from "./index.module.scss";
import svg from "@svg_map";
import SvgIcon from "../SvgIcon";
import { RouterLink } from "vue-router";

export const W1 = defineComponent({
  setup: () => {
    return () => (
      <div class={s.card}>
        <SvgIcon src={svg.piggy2} w="134px" />
        <h2>
          会赚钱
          <br />
          也要会省钱
        </h2>
      </div>
    );
  },
});

export const W2 = defineComponent({
  render: () => (
    <div class={s.card}>
      <SvgIcon src={svg.clock} w="112px" />
      <h2>
        每日提醒
        <br />
        不遗漏每一部账单
      </h2>
    </div>
  ),
});
export const W3 = defineComponent({
  render: () => (
    <div class={s.card}>
      <SvgIcon src={svg.charts2} w="112px" />
      <h2>
        数据可视化
        <br />
        收支一目了然
      </h2>
    </div>
  ),
});
export const W4 = defineComponent({
  render: () => {
    return (
      <div class={s.card}>
        <SvgIcon src={svg.cloud2} class={s.svg_contain} />
        <h2>
          云备份
          <br />
          不怕数据丢失
        </h2>
      </div>
    );
  },
});
export const WFooter = (metadata_ith: number) =>
  defineComponent({
    render: () => (
      <div class={s.actions}>
        <RouterLink class={s.fake} to={`/welcome/${metadata_ith - 1}`}>
          上页
        </RouterLink>
        <RouterLink to={`/welcome/${metadata_ith + 1}`}>下一页</RouterLink>
        <RouterLink to="/start">跳过</RouterLink>
      </div>
    ),
  });
export const WEndFooter = defineComponent({
  render() {
    return (
      <div class={s.actions}>
        <RouterLink class={s.fake} to={"/welcome"}>
          上页
        </RouterLink>
        <RouterLink to={"/welcome"}>完成</RouterLink>
        <RouterLink class={s.fake} to={"/welcome"}>
          占位
        </RouterLink>
      </div>
    );
  },
});
