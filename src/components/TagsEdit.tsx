import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./TagsEdit.module.scss";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "./Button";
import {
  type RulesType,
  validate,
  InvalidateError,
  errorFree,
} from "@/composables/validate";
import { Form, FormItem } from "./Form";
import { showDialog } from "vant";
import { httpClient } from "@/shared";
import { AxiosError } from "axios";

export const TagsEdit = defineComponent({
  name: "TagsEdit",
  setup(props, context) {
    const router = useRouter();
    // const kind = useRouteQuery("kind");
    return () => (
      <>
        <MainLayout
          title="新建标签"
          icon={svgs.back}
          toggle={() => router.replace("/items/create")}
        >
          <TagsForm>
            <Button
              class={[s.formItem, s.btn]}
              onClick={() => {
                // TODO:
                console.log("Form summit :>> ");
              }}
            >
              保存
            </Button>
          </TagsForm>
          <div class={s.actions}>
            <Button
              level="danger"
              class={[s.btn, s.removeTags]}
              // TODO:
              onClick={() => console.log("todo :>> ")}
            >
              删除标签
            </Button>
            <Button
              level="danger"
              class={[s.btn, s.removeAll]}
              // TODO:
              onClick={() => console.log("todo :>> ")}
            >
              删除标签和记账
            </Button>
          </div>
        </MainLayout>
      </>
    );
  },
});
export const TagsCreate = defineComponent({
  name: "TagsCreate",
  setup(props, context) {
    const router = useRouter();
    const kind = useRouteQuery<TagKindType>("kind");
    if (!kind.value) {
      showDialog({ message: "参数不存在" });
      router.back();
      return;
    }
    console.log("kind :>> ", kind.value);
    return () => (
      <MainLayout
        title="新建标签"
        icon={svgs.back}
        toggle={() => router.replace("/items/create")}
      >
        <TagsForm>
          <Button
            clan="submit"
            class={[s.formItem, s.btn]}
            onClick={() => {
              console.log("Form summit :>> ");
              // refForm.value?.submit();
            }}
          >
            确定
          </Button>
        </TagsForm>
      </MainLayout>
    );
  },
});
export const TagsForm = defineComponent({
  name: "TagForm",
  setup(props, context) {
    const router = useRouter();
    const kind = useRouteQuery<TagKindType>("kind");
    // todo: 向上传递
    const formData = reactive({
      kind: kind.value,
      name: "",
      sign: "",
    });
    const errData: Ref<InvalidateError<typeof formData>> = ref({}); // : { name: string; msg: string }[];
    const onSubmit = async (e: Event) => {
      const rules: RulesType<typeof formData> = [
        {
          clan: "required",
          key: "name",
          msg: "标签名必填",
          required: true,
        },
        {
          clan: "required",
          key: "sign",
          msg: "标签必填",
          required: true,
        },
        {
          clan: "pattern",
          key: "name",
          msg: "标签名太长",
          pattern: /^.{20,100}$/,
        },
        {
          clan: "pattern",
          key: "name",
          msg: "标签名太短",
          pattern: /^.{1,3}$/,
        },
      ];
      errData.value = validate(formData, rules);
      // console.log("errData.value.name?.[0] :>> ", errData.value.name?.[0]);
      // console.log("formData :>> ", formData);
      e.preventDefault();
      if (!errorFree(errData.value)) {
        console.log("errData.value :>> ", errData.value);
        return Promise.reject();
      } else {
        const response = await httpClient
          .post("/tags", formData, {
            params: { _mock: "tagCreate" },
          })
          .catch((err: AxiosError) => {
            if (err.response?.status === 422) {
              showDialog({ message: "错误: " + err.message });
              return;
            }
            throw err.cause;
          });
        console.log("response :>> ", response);
        router.back();
      }
    };
    return () => (
      <Form class={s.form} onSubmit={onSubmit}>
        <FormItem
          label="标签名 (3~20个字)"
          modelValue={formData.name}
          err_data={errData.value.name?.[0] ?? ""}
          onUpdate:modelValue={(itemName: string) => {
            console.log("itemName :>> ", itemName);
            formData.name = itemName;
          }}
          clan="input"
        ></FormItem>
        <FormItem
          label="标签符号:"
          clan="emoji"
          modelValue={formData.sign}
          err_data={errData.value.sign?.[0] ?? ""}
          onUpdate:modelValue={(emoji: string) => {
            console.log("emoji :>> ", emoji);
            formData.sign = emoji;
          }}
        ></FormItem>
        <div>
          <p class={s.tips}>记账时,长按标签即可进行编辑</p>
          <div class={s.formItem_value} onClick={onSubmit}>
            {context.slots.default?.()}
          </div>
        </div>
      </Form>
    );
  },
});
