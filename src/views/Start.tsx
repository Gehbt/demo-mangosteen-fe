import { Button, Floatbutton } from "@/components/Button";
import { defineComponent, ref } from "vue";
import s from "./Start.module.scss";
import { Center } from "@/components/Center";
import svg from "@svg_map";
import SvgIcon from "@/components/SvgIcon";
import { Overlay, OverlayMask } from "@/components/Overlay";
import { RouterLink } from "vue-router/auto";
import { MainLayout } from "@/layouts/MainLayout";

export const Start = defineComponent({
  name: "Start",
  setup(props, context) {
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
      <MainLayout title="蓝莓记账" icon={svg.menu} toggle={toggleOverlay}>
        {{
          default: () => (
            <>
              <Center direction="vertical" class={s.svg_wrapper}>
                <SvgIcon name={svg.piggy2} class={s.svg} />
              </Center>
              <div class={s.btn_wrapper}>
                <RouterLink to="/Items/create">
                  <Button class={s.btn}>开始记账</Button>
                </RouterLink>
                <RouterLink to="/Items/create">
                  <Floatbutton />
                </RouterLink>
              </div>

              <div
                style={{
                  visibility: overlayVisibleRef.value ? "visible" : "hidden",
                }}
              >
                <Overlay />
                <OverlayMask onBlurOverlay={blurOverlay} />
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
