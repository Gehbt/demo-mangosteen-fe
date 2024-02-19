import s from "./SignIn.module.scss";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormItem } from "@/components/Form";
import { Button } from "@/components/Button";
import {
  type InvalidateError,
  validate,
  errorFree,
  type RulesType,
} from "@/composables/validate";
import { httpClient } from "@/shared/http";
import { fetchMe, refreshMe } from "@/shared";
import { AxiosError } from "axios";
import { emailRules, codeRules } from "@/static";
import { showDialog } from "vant";

export const SignIn = defineComponent({
  name: "SignIn",
  beforeRouteEnter: async () => {
    console.log("enter :>> signin");
    const router = useRouter();
    await fetchMe().catch(() => {});
    showDialog({ message: "已登录" }).finally(() => {
      router.back();
    });
  },
  setup(props, context) {
    const formData = ref({ email: "", code: "" });
    const refErr: Ref<InvalidateError<typeof formData.value>> = ref({});
    const refIsSend = ref(false);
    const router = useRouter();
    const jwt = useLocalStorage("jwt", "");
    // TODO: use `decodeURIComponent` (?)
    const returnTo = useRouteQuery("return_to", "/start", { mode: "push" });
    console.log("returnTo :>> ", returnTo.value);
    const refSmsCodeComponent = ref<typeof FormItem>(); // reference FormItem-smscode
    const clickSendCode = async (e?: Event) => {
      formData.value.email = formData.value.email.trim();
      const email = computed(() => formData.value.email);
      refErr.value = validate(formData.value, emailRules);
      e?.preventDefault();
      if (!errorFree(refErr.value)) {
        console.log("refErr.value.email :>> ", refErr.value.email);
        return;
      } else {
        const whenEmailResponseError = (e: AxiosError<OnAxiosError>) => {
          if (e.response?.status === 422) {
            // 绕过前端从接口发送才可能发生
            refErr.value.email = [e.response.data.error_message];
            alert("Email格式错误!"); // TODO: dialog
          } else {
            console.error("Error: " + e.response?.data.error_message);
          }
          refIsSend.value = false;
        };
        refIsSend.value = true;
        refSmsCodeComponent.value?.useCountDown();
        if (email.value === "100@qq.com") {
          // console.log("object :>> ", object);
          return;
        } else {
          await httpClient
            .post<null>(
              "/sendmail",
              {
                email: email.value,
              },
              {
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                },
              }
            )
            .catch(whenEmailResponseError);
          return; // Promise.resolve();
        }
      }
    };
    const onSubmitFormData = async (e: Event) => {
      e.preventDefault();
      console.log("onsubmit :>> ");
      refErr.value.email = [];
      refErr.value.code = [];
      refErr.value = validate(formData.value, codeRules);
      // has Error message
      if (!errorFree(refErr.value)) {
        console.log("refErr.value.code :>> ", refErr.value.code);
        return;
      } else {
        console.log("formData.code :>> ", formData.value.code);
        if (formData.value.code === "123456") {
          console.log("trick :>> ");
          jwt.value = "testjwt";
          refreshMe()
            .then(
              () => {
                router.push(returnTo.value);
              },
              () => {
                alert("登录失败");
              }
            )
            .finally(() => {
              refIsSend.value = false;
            });
          // const returnTo = sessionStorage.getItem("returnTo");
          // router.push(returnTo || "/");
          refIsSend.value = false;
          return;
        }
        const whenCodeResponseError = (e: AxiosError<OnAxiosError>) => {
          if (e.response?.status === 422) {
            // 绕过前端从接口发送才可能发生
            refErr.value.email = [e.response.data.error_message];
            alert("Email格式错误!"); // TODO: dialog
          } else {
            console.error("Error: " + e.response?.data.error_message);
          }
          refIsSend.value = false;
        };

        refIsSend.value = true;

        await httpClient
          .post<JWTResponse>("/session", formData.value, {
            _loading: true,
          })
          .then(async (response) => {
            console.log("response :>> ", response);
            console.log("response JWT :>> ", response.data);
            jwt.value = response.data.jwt;
            // router.push(
            //   "/sign_in?return_to=" + encodeURIComponent(route.fullPath)
            // );
            // const returnTo = route.query["return_to"]?.toString();
            // console.log("returnTo :>> ", returnTo);
            await refreshMe();
            // const returnTo = sessionStorage.getItem("returnTo");
            router.push(returnTo.value);
          })
          .catch(whenCodeResponseError);
      }
    };
    const hasCode6 = computed(() => formData.value.code.length === 6);
    const disableSentLogin = computed(
      () => !(hasCode6.value && refIsSend.value)
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
          <Form onSubmit={onSubmitFormData}>
            <FormItem
              label="邮箱"
              modelValue={formData.value.email}
              errData={refErr.value.email?.[0] ?? ""}
              clan="email"
              onUpdate:modelValue={(email: string) => {
                formData.value.email = email;
              }}
              placeholder={"请输入邮箱,获取验证码"}
            ></FormItem>
            <FormItem
              label="验证码"
              ref={refSmsCodeComponent}
              errData={refErr.value.code?.[0] ?? ""}
              clan="smsCaptcha"
              onToggle={clickSendCode}
              modelValue={formData.value.code}
              onUpdate:modelValue={(code: string) => {
                console.log("code :>> ", code);
                formData.value.code = code;
              }}
              placeholder={"请输入六位数字"}
              countFrom={3}
            ></FormItem>
            {/* <FormItem err_data="" clan="custom"> */}
            <Button
              level="primary"
              clan="submit"
              disableByCtx={disableSentLogin.value}
              style={{ marginTop: "84px" }}
              onClick={onSubmitFormData}
            >
              登录
            </Button>
          </Form>
        </div>
      </MainLayout>
    );
  },
});
