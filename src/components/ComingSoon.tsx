import { defineComponent, type DefineComponent } from "vue";
import { Center } from "./Center";
import s from "./ComingSoon.module.scss";
import svg from "@svg_map";
import { Button } from "./Button";
export const ComingSoon: any = defineComponent({
  props: {
    name: string().isRequired,
  },
  setup: (props, context) => {
    const router = useRouter();
    return () => (
      <div>
        <h1 class={s.text}>导出</h1>
        <Center class={s.pig_wrapper}>
          <SvgIcon name={svg.piggy2} class={s.pig} />
        </Center>
        <p class={s.text}>敬请期待</p>
        <p class={s.text}>
          <Button
            onClick={() => {
              router.back();
            }}
          >
            返回
          </Button>
        </p>
      </div>
    );
  },
});
