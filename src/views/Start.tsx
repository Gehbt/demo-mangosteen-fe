import { Button, Floatbutton } from "@/components/Button";
import { defineComponent } from "vue";
import s from "./Start.module.scss";
import { Center } from "@/components/Center";
import svg from "@svg_map";
import SvgIcon from "@/components/SvgIcon";
import { Navbar } from "@/components/Navbar";
const onClick = () => {
  console.log(" :>> ");
};
export const Start = defineComponent({
  setup() {
    return () => (
      <div>
        <nav>
          <Navbar>
            {{
              title: () => "蓝莓记账",
              icon: (className: string) => (
                <SvgIcon name={svg.menu} class={className}></SvgIcon>
              ),
            }}
          </Navbar>
        </nav>
        <Center direction="vertical" class={s.svg_wrapper}>
          <SvgIcon name={svg.piggy2} class={s.svg} />
        </Center>
        <div class={s.btn_wrapper}>
          <Button class={s.btn} onClick={onClick}>
            开始记账
          </Button>
        </div>
        <Floatbutton></Floatbutton>
      </div>
    );
  },
});
