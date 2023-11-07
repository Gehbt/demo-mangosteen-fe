import { defineComponent } from "vue";
import s from "./index.module.scss";
import pig from "@/assets/piggy2.svg";
import charts from "@/assets/charts2.svg";
import cloud from "@/assets/cloud2.svg";
import clock from "@/assets/clock.svg";
import { RouterLink } from "vue-router/auto";
const TipsComponent = (metadata_ith: number) => [
  <RouterLink to={`/welcome`}>上页</RouterLink>,
  <RouterLink to={`/welcome/${metadata_ith + 1}`}>下一页</RouterLink>,
  <RouterLink to="/start">跳过</RouterLink>,
];
export const W1 = defineComponent({
  name: "welwcome/1",
  setup() {
    return { ith: 1 };
  },
  render() {
    return (
      <div class={s.wrapper_w1}>
        <div class={s.card}>
          <img class={s.svg_contain} src={pig} />
          <h2>
            会赚钱,
            <br />
            也要会省钱
          </h2>
        </div>
        <div class={s.actions}>{...TipsComponent(this.ith)}</div>
      </div>
    );
  },
});
export const W2 = defineComponent({
  render() {
    return (
      <div class={s.wrapper_w1}>
        <div class={s.card}>
          <img class={s.svg_contain} src={charts} />
          <h2>
            会赚钱,
            <br />
            也要会省钱
          </h2>
        </div>
        <div class={s.actions}></div>
      </div>
    );
  },
});
export const W3 = defineComponent({
  setup() {
    return () => (
      <div class={s.wrapper_w1}>
        <div class={s.card}>
          <img class={s.svg_contain} src={cloud} />
        </div>
        <div class={s.actions}></div>
      </div>
    );
  },
});
export const W4 = defineComponent({
  setup() {
    return () => (
      <div class={s.wrapper_w1}>
        <div class={s.card}>
          <img class={s.svg_contain} src={clock} />
        </div>
        <div class={s.actions}></div>
      </div>
    );
  },
});
