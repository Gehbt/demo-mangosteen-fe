import { defineComponent, reactive } from "vue";
import s from "./TagsEdit.module.scss";
import svg from "@svg_map";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "./Button";
import { EmojiSelect } from "./EmojiSelect";

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
    return () => (
      <MainLayout
        title="新建标签"
        icon={svg.back}
        toggle={() => router.replace("/items/create")}
      >
        {{
          default: () => (
            <form class={s.form}>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>标签名</span>
                  <div class={s.formItem_value}>
                    <input
                      v-model={formData.name}
                      class={[s.formItem, s.input, s.error]}
                    ></input>
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>必填</span>
                  </div>
                </label>
              </div>
              <div class={s.formRow}>
                <label class={s.formLabel}>
                  <span class={s.formItem_name}>
                    符号:
                    <span>{formData.sign}</span>
                  </span>
                  <div class={s.formItem_value}>
                    <EmojiSelect
                      class={[s.formItem, s.emojiList, s.error]}
                      modelValue={formData.sign}
                      onUpdate:modelValue={(emoji: string) => {
                        formData.sign = emoji;
                      }}
                    />
                  </div>
                  <div class={s.formItem_errorHint}>
                    <span>必填</span>
                  </div>
                </label>
              </div>
              <div>
                <p class={s.tips}>记账时长按标签即可进行编辑</p>
                <div class={s.formItem_value}>
                  <Button
                    class={[s.formItem, s.btn]}
                    onClick={() => console.log("form :>> ", formData)}
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
