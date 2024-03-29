import s from "./Form.module.scss";
import { EmojiSelect } from "./EmojiSelect";
import { DatePicker, Popup } from "vant";
import { Button } from "./Button";
export const Form = defineComponent({
  name: "Form",
  props: {
    onSubmit: {
      type: Function as PropType<(e: Event) => void>,
      required: true,
    },
    // func<(e: Event) => void>().isRequired,
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
      type: String,
      default: "",
    },
    // string().def(""),
    errData: String,
    // string(),
    label: String,
    // string(),
    clan: {
      type: String as PropType<
        "input" | "emoji" | "custom" | "date" | "smsCaptcha" | "email"
      >,
      default: "input",
    },
    // string<
    //   "input" | "emoji" | "custom" | "date" | "smsCaptcha" | "email"
    // >().def("input"),
    placeholder: String,
    // string(),
    onToggle: Function as PropType<(e?: Event) => Promise<any>>,
    // func<(e?: Event) => Promise<any>>(),
    countFrom: {
      type: Number,
      default: 60,
    },
    // number().def(60),
  },
  emits: ["update:modelValue", "update:errData"],
  setup(props, context) {
    const refDateVisible = ref(false);
    const timer = ref<number>();
    const count = ref<number>(props.countFrom);
    const isCounting = computed(() => !!timer.value);
    const useCountDown = () => {
      timer.value = window.setInterval(() => {
        count.value -= 1;
        if (count.value === 0) {
          clearInterval(timer.value);
          // re init
          timer.value = undefined;
          count.value = props.countFrom;
        }
      }, 1000);
    };
    const middleModelValue = useVModel(props, "modelValue", context.emit);
    context.expose({ useCountDown });
    const content = computed(() => {
      switch (props.clan) {
        case "input":
        case "email":
          return (
            <input
              class={[s.formItem, s.input, props.errData !== "" ? s.error : ""]}
              placeholder={props.placeholder}
              type={props.clan}
              value={middleModelValue.value}
              onInput={(e) => {
                middleModelValue.value = (e.target as HTMLInputElement).value;
                // 清理错误
                context.emit("update:errData", undefined);
              }}
              // onUpdate:modelValue={(e) => {
              //   console.log(
              //     "input value :>> ",
              //     (e.target as HTMLInputElement).value
              //   );
              //   context.emit(
              //     "update:modelValue",
              //     (e.target as HTMLInputElement).value
              //   );
              // }}
            ></input>
          );
        case "emoji":
          return (
            <EmojiSelect
              class={[
                s.formItem,
                s.emojiList,
                props.errData !== "" ? s.error : "",
              ]}
              modelValue={middleModelValue.value}
              onUpdate:modelValue={(value: string) => {
                console.log("EmojiSelect value :>> ", value);
                middleModelValue.value = value;
                // 清理错误
                context.emit("update:errData", undefined);
              }}
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
                  props.errData !== "" ? s.error : "",
                ]}
                placeholder={props.placeholder}
              />
              <Popup
                position="bottom"
                onClickOverlay={() => (refDateVisible.value = false)}
                v-model:show={refDateVisible.value}
              >
                <DatePicker
                  modelValue={computedPicker.value}
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
                  props.errData !== "" ? s.error : "",
                ]}
                // !如果使用v-model,这里会报错
                // ![Vue warn]: withDirectives can only be used inside render functions.
                // *或者说原生属性无法使用v-model? 不对,上面用到了(但也改了)
                value={middleModelValue.value}
                onInput={(e) => {
                  middleModelValue.value = (e.target as HTMLInputElement).value;
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
                  props.onToggle?.().catch((err: any) => {
                    console.log(err);
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
          throw "Invalidate Form Item Type";
      }
    });
    return () => (
      <div class={s.formRow}>
        <label class={s.formLabel}>
          <span class={s.formItem_name}>
            {props.clan === "emoji" ? (
              <EmojiLabel
                label={props.label}
                emojiValue={props.modelValue}
                onUpdate:emojiValue={(value) => {
                  context.emit("update:modelValue", value);
                  context.emit("update:errData");
                }}
              />
            ) : (
              props.label
            )}
          </span>
          <div class={s.formItem_value}>{content.value}</div>
          <div class={s.formItem_errorHint}>
            <span>{props.errData}</span>
          </div>
        </label>
      </div>
    );
  },
});

export const EmojiLabel = defineComponent({
  name: "EmojiLabel",
  props: {
    label: String,
    // string(),
    emojiValue: {
      type: String,
      default: "",
    },
    // string().def(""),
  },
  emits: ["update:emojiValue"],
  setup(props, context) {
    const refEmoji = useVModel(props, "emojiValue", context.emit);
    const { history } = useRefHistory(refEmoji);
    const historyList4 = computed(() => history.value.slice(0, 4));
    return () => (
      <span class={s.emojiLabel}>
        <span class={s.labelItem}>
          {props.label}
          <strong>{props.emojiValue}</strong>
        </span>
        <span class={s.labelItem}>
          历史选择
          {historyList4.value.map((value, index) => (
            <span
              key={index}
              onClick={() => {
                console.log("value.snapshot :>> ", value.snapshot);
                context.emit("update:emojiValue", value.snapshot);
              }}
            >
              {value.snapshot}
            </span>
          ))}
        </span>
      </span>
    );
  },
});
