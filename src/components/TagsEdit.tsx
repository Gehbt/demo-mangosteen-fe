import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./TagsEdit.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "./Button";
import {
  type RulesType,
  validate,
  InvalidateError,
} from "@/composables/validate";
import { Form, FormItem } from "./Form";

export const TagsEdit = defineComponent({
  name: "TagsEdit",
  setup(props, context) {
    const router = useRouter();
    return () => (
      <>
        <MainLayout
          title="新建标签"
          icon={svg.back}
          toggle={() => router.replace("/items/create")}
        >
          <TagsForm>
            <Button
              class={[s.formItem, s.btn]}
              onClick={() => console.log("Form summit :>> ")}
            >
              保存
            </Button>
          </TagsForm>
          <div class={s.actions}>
            <Button
              level="danger"
              class={[s.btn, s.removeTags]}
              onClick={() => console.log("todo :>> ")}
            >
              删除标签
            </Button>
            <Button
              level="danger"
              class={[s.btn, s.removeAll]}
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
    return () => (
      <MainLayout
        title="新建标签"
        icon={svg.back}
        toggle={() => router.replace("/items/create")}
      >
        <TagsForm>
          <Button
            class={[s.formItem, s.btn]}
            onClick={() => console.log("Form summit :>> ")}
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
    const formData = reactive({
      name: "",
      sign: "",
    });
    const errData: Ref<InvalidateError<typeof formData>> = ref({}); // : { name: string; msg: string }[];
    const submit = (e: Event) => {
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
      errData.value = validate(toRaw(formData), rules);
      console.log("formData :>> ", toRaw(formData));
      e.preventDefault();
    };
    console.log("errData.value.name?.[0] :>> ", errData.value.name?.[0]);
    return () => (
      <Form class={s.form} onSubmit={submit}>
        <FormItem
          label="标签名"
          modelValue={formData.name}
          err_data={errData.value.name?.[0] ?? ""}
          onUpdate:modelValue={(itemName: string) => {
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
          <p class={s.tips}>记账时长按标签即可进行编辑</p>
          <div class={s.formItem_value}>{context.slots.default?.()}</div>
        </div>
      </Form>
    );
  },
});
