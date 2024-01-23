import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./SignIn.module.scss";
import { MainLayout } from "@/layouts/MainLayout";
import { Form, FormItem } from "@/components/Form";
import { Button } from "@/components/Button";
import { InvalidateError, validate, errorFree } from "@/composables/validate";
import { httpClient } from "@/shared/http";
import { refreshMe } from "@/shared/me";

export const SignIn = defineComponent({
  name: "SignIn",
  setup(props, context) {
    const formData = reactive({ email: "", code: "" });
    const refErr: Ref<InvalidateError<typeof formData>> = ref({});
    const refIsSend = ref(false);
    const router = useRouter();
    const route = useRoute();
    const refSmsCodeComponent = ref<typeof FormItem>(); // reference FormItem-smscode
    const clickSendCode = (e?: Event) => {
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
      if (!errorFree(refErr.value)) {
        return Promise.reject(refErr.value.email);
      } else {
        const whenEmailResponseError = (e: any) => {
          if (e.response?.status === 422) {
            // 绕过前端从接口发送才可能发生
            refErr.value.email = e.response.data.errors;
            alert("Email格式错误!"); // TODO: dialog
          } else {
            console.error("Error: " + e.response.data.errors);
          }
        };
        refIsSend.value = true;
        refSmsCodeComponent.value?.useCountDown();
        if (email.value === "100@qq.com") {
          return Promise.resolve({ msg: true });
        } else {
          const response = httpClient
            .post(
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
            .catch(whenEmailResponseError)
            .finally(() => {
              refIsSend.value = false;
            });
          return response; // Promise.resolve();
        }
      }
    };
    const onSubmitFormData = async (e: Event) => {
      e.preventDefault();
      console.log("onsubmit :>> ");
      refErr.value.email = [];
      refErr.value.code = [];
      refErr.value = validate(
        toRaw(formData),
        [
          {
            key: "code",
            clan: "required",
            msg: "必填",
            required: true,
          },
          {
            key: "code",
            clan: "pattern",
            msg: "长度错误",
            pattern: /^(.{6})$/,
          },
        ],
        true
      );
      // has Error message
      if (!errorFree(refErr.value)) {
        return Promise.reject(refErr.value.code);
      } else {
        console.log("formData.code :>> ", formData.code);
        if (formData.code === "123456") {
          console.log("trick :>> ");
          localStorage.setItem("jwt", "testjwt");
          const returnTo = route.query.returnTo?.toString();
          refreshMe()
            .then(
              () => {
                router.push(returnTo || "/");
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
          return Promise.resolve();
        }
        const whenCodeResponseError = (e: any) => {
          if (e.response?.status === 422) {
            // 绕过前端从接口发送才可能发生
            refErr.value.email = e.response.data.errors;
            alert("Email格式错误!"); // TODO: dialog
          } else {
            console.error("Error: " + e.response.data.errors);
          }
        };

        refIsSend.value = true;

        await httpClient
          .post<{ jwt: string }>("/session", toRaw(formData), {
            params: { _mock: "session" },
          })
          .then((response) => {
            console.log("response :>> ", response);
            localStorage.setItem("jwt", response.data.jwt);
            // router.push(
            //   "/sign_in?return_to=" + encodeURIComponent(route.fullPath)
            // );
            const returnTo = route.query["return_to"]?.toString();
            console.log("returnTo :>> ", returnTo);
            refreshMe();
            // const returnTo = sessionStorage.getItem("returnTo");
            router.push(returnTo || "/");
          })
          .catch(whenCodeResponseError)
          .finally(() => {
            refIsSend.value = false;
          });
      }
    };
    const hasCode6 = computed(() => formData.code.length === 6);
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
              ref={refSmsCodeComponent}
              err_data={refErr.value.code?.[0] ?? ""}
              clan="smsCaptcha"
              onToggle={clickSendCode}
              modelValue={formData.code}
              onUpdate:modelValue={(code: string) => {
                console.log("code :>> ", code);
                formData.code = code;
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
            {/* </FormItem> */}
          </Form>
        </div>
      </MainLayout>
    );
  },
});
