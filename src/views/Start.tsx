import { Button, Floatbutton } from "@/components/Button";
import { defineComponent, ref } from "vue";
import s from "./Start.module.scss";
import { Center } from "@/components/Center";
import { Overlay, OverlayMask } from "@/components/Overlay";
import { RouterLink } from "vue-router/auto";
import { MainLayout } from "@/layouts/MainLayout";

export const Start = defineComponent({
  name: "Start",
  setup(props, context) {
    const overlayVisibleRef = ref(false);
    const toggleOverlay = () => {
      overlayVisibleRef.value = true;
    };
    const blurOverlay = () => {
      overlayVisibleRef.value = false;
    };
    return () => (
      <MainLayout title="蓝莓记账" icon={svgs.menu} toggle={toggleOverlay}>
        <Center direction="vertical" class={s.svg_wrapper}>
          <svg-icon name={svgs.piggy2} class={s.svg} />
        </Center>
        <div class={s.btn_wrapper}>
          <RouterLink to="/items/create">
            <Button class={s.btn}>开始记账</Button>
          </RouterLink>
          <RouterLink to="/items/create">
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
      </MainLayout>
    );
  },
});
