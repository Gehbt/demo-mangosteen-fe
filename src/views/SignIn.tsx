import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./SignIn.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormItem } from "@/components/Form";
import { Button } from "@/components/Button";
import { InvalidateError, validate } from "@/composables/validate";
import SvgIcon from "@/components/SvgIcon";
export const SignIn = defineComponent({
  name: "SignIn",
  setup(props, context) {
    const formData = reactive({ email: "", code: "" });
    const refErr: Ref<InvalidateError<typeof formData>> = ref({});
    const onSubmit = (e: Event) => {
      refErr.value.email = [];
      refErr.value.code = [];
      refErr.value = validate(toRaw(formData), [
        {
          key: "email",
          clan: "required",
          msg: "必填",
          required: true,
        },
        {
          key: "code",
          clan: "required",
          msg: "必填",
          required: true,
        },
        {
          key: "email",
          clan: "pattern",
          msg: "必填",
          pattern: /.*@.*/,
        },
      ]);
      e.preventDefault();
    };
    const router = useRouter();
    return () => (
      <MainLayout
        title="登录页"
        icon={svg.back}
        toggle={() => {
          router.replace("/start");
        }}
      >
        <div class={s.wrapper}>
          <div class={s.logo}>
            <SvgIcon class={s.logo_item} name={svg.blueberry2} w="64px" />
            <h2 class={s.logo_item_name}>蓝莓记账</h2>
          </div>
          <Form onSubmit={onSubmit}>
            <FormItem
              label="邮箱"
              modelValue={formData.email}
              err_data={refErr.value.email?.[0] ?? ""}
              clan="email"
              onUpdate:modelValue={(email: string) => {
                formData.email = email;
              }}
              placeholder={"请输入邮箱,获取验证码"}
            ></FormItem>
            <FormItem
              label="验证码"
              err_data={refErr.value.code?.[0] ?? ""}
              clan="smsCaptcha"
              modelValue={formData.code}
              onUpdate:modelValue={(code: string) => {
                formData.code = code;
              }}
              placeholder={"请输入六位数字"}
            ></FormItem>
            {/* <FormItem simple clan="custom"> */}
            <Button
              level="primary"
              clan="submit"
              onClick={() => {
                console.log("formData :>> ", toRaw(formData));
              }}
              style={{ marginTop: "84px" }}
            >
              登录
            </Button>
            {/* </FormItem> */}
          </Form>
        </div>
      </MainLayout>
    );
  },
});
