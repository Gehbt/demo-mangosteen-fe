import { PropType, computed, defineComponent, ref } from "vue";
import s from "./Form.module.scss";
import { EmojiSelect } from "./EmojiSelect";
import { DatePicker, Popup } from "vant";
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
    clan: {
      type: String as PropType<
        "input" | "emoji" | "custom" | "date" | "smsCaptcha" | "email"
      >,
      default: "input",
      required: true,
    },
    placeholder: {
      type: String,
    },
    onToggle: {
      type: Function as PropType<(e?: Event) => Promise<void>>,
    },
    countFrom: {
      type: Number,
      default: 60,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const refDateVisible = ref(false);
    const timer = ref<number>();
    const count = ref<number>(props.countFrom);
    const isCounting = computed(() => !!timer.value);
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
              placeholder={props.placeholder}
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
                  refDateVisible.value = true;
                }}
                class={[
                  s.formItem,
                  s.input,
                  props.err_data !== "" ? s.error : "",
                ]}
                placeholder={props.placeholder}
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
                  context.emit(
                    "update:modelValue",
                    (e.target as HTMLInputElement).value
                  );
                }}
                placeholder={props.placeholder}
              />
              <Button
                class={[
                  s.btn,
                  s.formItem,
                  s.smsCaptcha_btn,
                  isCounting.value ? s.toggled : "",
                ]}
                disableByCtx={isCounting.value}
                clan="button"
                onClick={() => {
                  props
                    .onToggle?.()
                    .then(() => {
                      timer.value = setInterval(() => {
                        count.value -= 1;
                        if (count.value === 0) {
                          clearInterval(timer.value);
                          // re init
                          timer.value = undefined;
                          count.value = props.countFrom;
                        }
                      }, 1000);
                    })
                    .catch(() => {
                      return;
                    });
                }}
              >
                {isCounting.value
                  ? count.value.toString() + "秒后再发送"
                  : "发送"}
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
          <span class={s.formItem_name}>
            {props.label}
            <span>{props.clan === "emoji" ? props.modelValue : ""}</span>
          </span>
          <div class={s.formItem_value}>{content.value}</div>
          <div class={s.formItem_errorHint}>
            <span>{props.err_data}</span>
          </div>
        </label>
      </div>
    );
  },
});
function useCountDown() {}
