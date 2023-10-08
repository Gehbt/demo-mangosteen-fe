import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import s from './Welcome.module.scss';
import logo from '@/assets/mango.svg';
console.log('logo :>> ', logo);
export const Welcome = defineComponent({
  setup() {
    return () => (
      <div class={s.wrapper}>
        <header><img src={logo}/></header>
        <main>
          <RouterView />
        </main>
        {/* <footer>跳过</footer> hard */}
      </div>
    );
  },
});
