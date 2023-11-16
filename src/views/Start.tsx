import { Button, Floatbutton } from "@/components/Button";
import { defineComponent } from "vue";
import s from "./Start.module.scss";
const onClick = () => {
  console.log(" :>> ");
};
export const Start = defineComponent({
  setup() {
    return () => (
      <div>
        <div class={s.btn_wrapper}>
          <Button class={s.btn} onClick={onClick}>
            测试
          </Button>
        </div>
        <Floatbutton></Floatbutton>
      </div>
    );
  },
});
