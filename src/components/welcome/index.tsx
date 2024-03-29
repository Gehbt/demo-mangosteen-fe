import s from "./index.module.scss";
import { RouterLink } from "vue-router";

export const W1 = defineComponent({
  name: "W1",
  setup: () => {
    return () => (
      <div class={s.card}>
        <svg-icon src={svgs.piggy2} w="134px" />
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
  name: "W2",
  render: () => (
    <div class={s.card}>
      <svg-icon src={svgs.clock} w="108px" />
      <h2>
        每日提醒
        <br />
        不遗漏每一部账单
      </h2>
    </div>
  ),
});
export const W3 = defineComponent({
  name: "W3",
  render: () => (
    <div class={s.card}>
      <svg-icon src={svgs.charts2} w="112px" />
      <h2>
        数据可视化
        <br />
        收支一目了然
      </h2>
    </div>
  ),
});
export const W4 = defineComponent({
  name: "W4",
  render: () => {
    return (
      <div class={s.card}>
        <svg-icon src={svgs.cloud2} w="128px" />
        <h2>
          云备份
          <br />
          不怕数据丢失
        </h2>
      </div>
    );
  },
});
const skipWelcome = () => {
  localStorage.setItem("skipWelcome", "yes");
};
export const WFooter = (metadata_ith: number) =>
  defineComponent({
    name: "WFooter",
    render() {
      return (
        <div class={s.actions}>
          <RouterLink class={s.fake} to={`/welcome/${metadata_ith - 1}`}>
            上页
          </RouterLink>
          <RouterLink to={`/welcome/${metadata_ith + 1}`}>下一页</RouterLink>
          <span onClick={skipWelcome}>
            <RouterLink to="/start">跳过</RouterLink>
          </span>
        </div>
      );
    },
  });
export const WEndFooter = defineComponent({
  name: "WEndFooter",
  render() {
    return (
      <div class={s.actions}>
        <RouterLink class={s.fake} to={"/welcome"}>
          上页
        </RouterLink>
        <span onClick={skipWelcome}>
          <RouterLink to={"/start"}>完成</RouterLink>
        </span>
        <RouterLink class={s.fake} to={"/welcome"}>
          占位
        </RouterLink>
      </div>
    );
  },
});
