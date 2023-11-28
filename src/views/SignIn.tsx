import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./SignIn.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormItem } from "@/components/Form";
import { Button } from "@/components/Button";
import { InvalidateError, validate } from "@/composables/validate";
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
    return () => (
      <MainLayout
        title="登录页"
        icon={svg.back}
        toggle={() => {
          console.log("todo :>> ");
        }}
      >
        <div class={s.wrapper}>
          <Form onSubmit={onSubmit}>
            <FormItem
              label="邮箱"
              modelValue={formData.email}
              err_data={refErr.value.email?.[0] ?? ""}
              clan="email"
              onUpdate:modelValue={(email: string) => {
                console.log("email :>> ", email);
                formData.email = email;
              }}
            ></FormItem>
            <FormItem
              label="验证码"
              modelValue={formData.code}
              err_data={refErr.value.code?.[0] ?? ""}
              clan="smsCaptcha"
              onUpdate:modelValue={(code: string) => {
                console.log("code :>> ", code);
                formData.code = code;
              }}
            ></FormItem>
            {/* <FormItem simple clan="custom"> */}
            <Button
              level="primary"
              clan="submit"
              onClick={() => {
                console.log("formData :>> ", toRaw(formData));
              }}
              style={{ marginTop: "8px" }}
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
