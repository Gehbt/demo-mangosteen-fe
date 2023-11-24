import { Ref, defineComponent, reactive, ref, toRaw } from "vue";
import s from "./TagsEdit.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "./Button";
import { EmojiSelect } from "./EmojiSelect";
import {
  type RulesType,
  validate,
  InvalidateError,
} from "@/composables/validate";

export const TagsEdit = defineComponent({
  name: "TagsEdit",
  setup(props, context) {
    return () => <div>TagsEdit</div>;
  },
});
export const TagsCreate = defineComponent({
  name: "TagsCreate",
  setup(props, context) {
    const router = useRouter();
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
      e.preventDefault();
    };
    // console.log("object :>> ", toRaw(formData));
    return () => (
      <MainLayout
        title="新建标签"
        icon={svg.back}
        toggle={() => router.replace("/items/create")}
      >
        {{
          default: () => (
            <form class={s.form} onSubmit={submit}>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>标签名</span>
                  <div class={s.formItem_value}>
                    <input
                      v-model={formData.name}
                      class={[
                        s.formItem,
                        s.input,
                        errData.value.name?.[0] ? s.error : "",
                      ]}
                    ></input>
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>{errData.value.name?.[0]}</span>
                  </div>
                </label>
              </div>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>
                    标签符号:
                    <span>{formData.sign}</span>
                  </span>
                  <div class={s.formItem_value}>
                    <EmojiSelect
                      class={[
                        s.formItem,
                        s.emojiList,
                        errData.value.sign?.[0] ? s.error : "",
                      ]}
                      modelValue={formData.sign}
                      onUpdate:modelValue={(emoji: string) => {
                        formData.sign = emoji;
                      }}
                    />
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>{errData.value.sign?.[0]}</span>
                  </div>
                </label>
              </div>
              <div>
                <p class={s.tips}>记账时长按标签即可进行编辑</p>
                <div class={s.formItem_value}>
                  <Button
                    class={[s.formItem, s.btn]}
                    onClick={() =>
                      console.log("form post:>> ", toRaw(formData))
                    }
                  >
                    确定
                  </Button>
                </div>
              </div>
            </form>
          ),
        }}
      </MainLayout>
    );
  },
});
