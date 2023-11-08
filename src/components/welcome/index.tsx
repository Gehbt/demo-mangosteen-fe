import { defineComponent } from "vue";
import s from "./index.module.scss";
import pig from "@/assets/piggy2.svg";
import charts from "@/assets/charts2.svg";
import cloud from "@/assets/cloud2.svg";
import clock from "@/assets/clock.svg";
import { RouterLink } from "vue-router/auto";
interface WSlotType {
  icon: () => JSX.Element;
  texts: () => JSX.Element;
  footer_button: () => JSX.Element;
}

const TipsComponent = (metadata_ith: number) => [
  <RouterLink to={`/welcome`}>上页</RouterLink>,
  <RouterLink to={`/welcome/${metadata_ith + 1}`}>下一页</RouterLink>,
  <RouterLink to="/start">跳过</RouterLink>,
];
const text_w2 = ["每日提醒", "不遗漏每一部账单"];
export const W1 = defineComponent({
  // 写法render
  name: "welwcome/1",
  setup() {
    return { ith: 1 };
  },
  render() {
    return (
      <div class={s.wrapper}>
        <div class={s.card}>
          <img src={pig} class={s.svg_contain} />
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
  // 写法v-slots: 对inspector不友好
  setup() {
    const slots: WSlotType = {
      icon: () => <img src={clock} class={s.svg_contain} />,
      texts: () => (
        <h2>
          {text_w2[0]}
          <br />
          {text_w2[1]}
        </h2>
      ),
      footer_button: () => <>{...TipsComponent(2)}</>,
    };
    return { slots };
  },
  render() {
    return <WTemplates v-slots={this.slots} />;
  },
});
export const W3 = defineComponent({
  // 写法0
  setup() {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <img class={s.svg_contain} src={charts} />
        </div>
        <div class={s.actions}>{...TipsComponent(3)}</div>
      </div>
    );
  },
});
export const W4 = defineComponent({
  // 非重复
  setup() {
    return () => (
      <div class={s.wrapper}>
        <div class={s.card}>
          <img src={cloud} class={s.svg_contain} />
          <h2>111</h2>
        </div>
        <div class={s.actions}>
          <RouterLink to={"/welcome"}>上页</RouterLink>
          <RouterLink to={"/start"}>完成</RouterLink>
          <RouterLink to={"/welcome"} style={`visibility: hidden`}>
            占位
          </RouterLink>
        </div>
      </div>
    );
  },
});
const WTemplates = defineComponent({
  setup(props, { slots }) {
    return { slots: slots as unknown as WSlotType };
  },
  render() {
    return (
      <>
        <div class={s.wrapper}>
          <div class={s.card}>
            {this.slots.icon()}
            {this.slots.texts()}
          </div>
          <div class={s.actions}>{this.slots.footer_button()}</div>
        </div>
      </>
    );
  },
});
