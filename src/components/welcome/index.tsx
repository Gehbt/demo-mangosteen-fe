import { Component, defineComponent } from "vue";
import s from "./index.module.scss";
import pig from "@/assets/piggy2.svg";
import charts from "@/assets/charts2.svg";
import cloud from "@/assets/cloud2.svg";
import clock from "@/assets/clock.svg";
import { RouterLink } from "vue-router";
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
export const W1 = defineComponent({
  render: () => (
    <div class={s.card}>
      <img src={pig} class={s.svg_contain} />
      <h2>
        会赚钱,
        <br />
        也要会省钱
      </h2>
    </div>
  ),
});

export const W2 = defineComponent({
  render: () => (
    <div class={s.card}>
      <img src={clock} class={s.svg_contain} />
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
      <img src={charts} class={s.svg_contain} />
      <h2>
        33
        <br />3
      </h2>
    </div>
  ),
});
export const W4 = defineComponent({
  render: () => {
    return (
      <div class={s.card}>
        <img src={cloud} class={s.svg_contain} />
        <h2>
          11
          <br />1
        </h2>
      </div>
    );
  },
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
// const WTemplates = defineComponent({
//   setup(_, { slots }) {
//     return { slots: slots as unknown as WSlotType };
//   },
//   render() {
//     return (
//       <>
//         {this.slots.icon()}
//         {this.slots.texts()}
//       </>
//     );
//   },
// });
