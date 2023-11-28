import { PropType, computed, defineComponent, ref } from "vue";
import s from "./Form.module.scss";
import { EmojiSelect } from "./EmojiSelect";
import { DatePicker, Popup } from "vant";
import { Time } from "@/composables/date";
import { Button } from "./Button";
export const Form = defineComponent({
  name: "Form",
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props, context) {
    return () => (
      <form class={s.form} onSubmit={props.onSubmit}>
        {context.slots.default?.()}
      </form>
    );
  },
});
export const FormItem = defineComponent({
  name: "FormItem",
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
    err_data: {
      type: String as PropType<string | undefined>,
      required: true,
    },
    label: {
      type: String as PropType<string>,
      required: false,
    },
    simple: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    clan: {
      type: String as PropType<
        "input" | "emoji" | "custom" | "date" | "smsCaptcha" | "email"
      >,
      default: "input",
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const refDateVisible = ref(false);
    const content = computed(() => {
      switch (props.clan) {
        case "input":
        case "email":
          return (
            <input
              class={[
                s.formItem,
                s.input,
                props.err_data !== "" ? s.error : "",
              ]}
              type={props.clan}
              value={props.modelValue}
              onChange={(e) => {
                console.log(
                  "input value :>> ",
                  (e.target as HTMLInputElement).value
                );
                context.emit(
                  "update:modelValue",
                  (e.target as HTMLInputElement).value
                );
              }}
            ></input>
          );
        case "emoji":
          return (
            <EmojiSelect
              class={[
                s.formItem,
                s.emojiList,
                props.err_data !== "" ? s.error : "",
              ]}
              modelValue={props.modelValue}
              onUpdate:modelValue={(value: string) =>
                context.emit("update:modelValue", value)
              }
            />
          );
        case "date":
          const computedPicker = computed(() => props.modelValue?.split("-"));
          return (
            <>
              <input
                readonly={true}
                value={props.modelValue}
                onClick={() => {
                  console.log("props.modelValue :>> ", props.modelValue);
                  refDateVisible.value = true;
                }}
                class={[
                  s.formItem,
                  s.input,
                  props.err_data !== "" ? s.error : "",
                ]}
              />
              <Popup
                position="bottom"
                onClickOverlay={() => (refDateVisible.value = false)}
                v-model:show={refDateVisible.value}
              >
                <DatePicker
                  v-model={computedPicker.value}
                  title="选择年月日"
                  onConfirm={(date) => {
                    const emitPicker = (date.selectedValues as string[]).join(
                      "-"
                    );
                    console.log("date :>> ", emitPicker);
                    context.emit("update:modelValue", emitPicker);
                    refDateVisible.value = false;
                  }}
                  onCancel={() => (refDateVisible.value = false)}
                />
              </Popup>
            </>
          );
        case "smsCaptcha":
          return (
            <>
              <input
                class={[
                  s.formItem,
                  s.input,
                  s.smsCaptcha,
                  props.err_data !== "" ? s.error : "",
                ]}
                value={props.modelValue}
                onChange={(e) => {
                  console.log(
                    "input value :>> ",
                    (e.target as HTMLInputElement).value
                  );
                  context.emit(
                    "update:modelValue",
                    (e.target as HTMLInputElement).value
                  );
                }}
              />
              <Button
                class={[s.btn, s.formItem, s.smsCaptcha_btn]}
                clan="button"
              >
                提交
              </Button>
            </>
          );
        case "custom":
          return context.slots.default?.();
        default:
          throw new Error("Invalidate Form Item Type");
      }
    });
    return () => (
      <div class={s.formRow}>
        <label class={s.formLabel}>
          {!props.simple && (
            <span class={s.formItem_name}>
              {props.label}
              <span>{props.clan === "emoji" ? props.modelValue : ""}</span>
            </span>
          )}
          <div class={s.formItem_value}>{content.value}</div>
          {!props.simple && (
            <div class={s.formItem_errorHint}>
              <span>{props.err_data}</span>
            </div>
          )}
        </label>
      </div>
    );
  },
});
