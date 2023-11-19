import { Button, Floatbutton } from "@/components/Button";
import { Ref, defineComponent, ref } from "vue";
import s from "./Start.module.scss";
import { Center } from "@/components/Center";
import svg from "@svg_map";
import SvgIcon from "@/components/SvgIcon";
import { Navbar } from "@/components/Navbar";
import { Overlay, OverlayMask } from "@/components/Overlay";

export const Start = defineComponent({
  name: "Start",
  setup() {
    const overlayVisibleRef = ref(false);
    const toggleOverlay = () => {
      overlayVisibleRef.value = true;
      console.log("toggleOverlay :>> ", overlayVisibleRef.value);
    };
    const blurOverlay = () => {
      overlayVisibleRef.value = false;
      console.log("blurOverlay :>> ", overlayVisibleRef.value);
    };
    return () => (
      <div>
        <nav>
          <Navbar onToggleOverlay={toggleOverlay}>
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
          <Button class={s.btn}>开始记账</Button>
        </div>
        <Floatbutton></Floatbutton>
        <div
          style={{ visibility: overlayVisibleRef.value ? "visible" : "hidden" }}
        >
          <Overlay />
          <OverlayMask onBlurOverlay={blurOverlay} />
        </div>
      </div>
    );
  },
});
