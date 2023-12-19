import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./SignIn.module.scss";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormItem } from "@/components/Form";
import { Button } from "@/components/Button";
import { InvalidateError, validate } from "@/composables/validate";
import axios from "axios";
interface EmailSchema {
  body: { email: string };
}
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
          key: "code",
          clan: "required",
          msg: "必填",
          required: true,
        },
      ]);
      e.preventDefault();
    };
    const router = useRouter();
    const clickSendCode = async (e?: Event) => {
      formData.email = formData.email.trim();
      const email = computed(() => formData.email);
      refErr.value = validate(
        toRaw(formData),
        [
          {
            key: "email",
            clan: "required",
            msg: "必填",
            required: true,
          },
          {
            key: "email",
            clan: "pattern",
            msg: "格式错误",
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          },
        ],
        true
      );
      e?.preventDefault();
      console.log("err :>> ", refErr.value.email);
      console.log(`email :>> '${email.value}'`);
      try {
        if (refErr.value.email) {
          return await Promise.reject(refErr.value.email);
        }
        Promise.resolve();
        return await Promise.resolve();
      } catch (e: unknown) {
        console.log("error :>> Response");
        throw new Error(e as string);
      }

      // await axios.post(
      //   "/api/v1/sendmail",
      //   {
      //     body: {
      //       email: email.value,
      //     },
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json; charset=utf-8",
      //     },
      //   }
      // );
      // console.log("response :>> ", response);
    };
    const hasCode6 = computed(() =>
      formData.code.length === 6 ? true : false
    );
    return () => (
      <MainLayout
        title="登录页"
        icon={svgs.back}
        toggle={() => {
          router.replace("/start");
        }}
      >
        <div class={s.wrapper}>
          <div class={s.logo}>
            <svg-icon class={s.logo_item} name={svgs.blueberry2} w="64px" />
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
              onToggle={clickSendCode}
              placeholder={"请输入六位数字"}
              countFrom={3}
            ></FormItem>
            {/* <FormItem simple clan="custom"> */}
            <Button
              level="primary"
              clan="submit"
              disableByCtx={hasCode6.value}
              onClick={() => {
                // request mail return??
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
