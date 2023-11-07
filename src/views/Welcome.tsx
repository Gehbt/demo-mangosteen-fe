import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from "./Welcome.module.scss";
import logo from "@/assets/blueberry2.svg";
console.log("logo :>> ", logo);
export const Welcome = defineComponent({
  setup() {
    return () => (
      <div class={s.wrapper}>
        <header>
          <img src={logo} class={s.main_svg_container} />
          <h2>蓝莓记账</h2>
        </header>
        <main class={s.main}>
          <RouterView />
        </main>
        {/* <footer>跳过</footer> hard */}
      </div>
    );
  },
});
