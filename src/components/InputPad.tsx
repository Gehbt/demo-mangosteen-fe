import { type PropType, computed, defineComponent, ref } from "vue";
import s from "./InputPad.module.scss";
import { DatePicker, Popup } from "vant";
import { useSL } from "@/composables/save_load";

export const InputPad = defineComponent({
  name: "InputPad",
  props: {
    inputDate: {
      type: Object as PropType<[string, string, string]>,
      default: ["2015", "01", "01"] as [string, string, string],
    },
    inputAmount: string().def("0"),
    handleSubmit: func<() => void>().isRequired,
  },
  emits: ["update:inputAmount", "update:inputDate"],
  setup(props, context) {
    // const refAmount = ref("0");
    const refNumberWithDot = ref(false);
    const dotNumber = ref(0);
    const appendNumber = (n: number | "." = ".") => {
      if (
        // < 11位数
        (refNumberWithDot.value &&
          props.inputAmount.length < /* 11+ "." +2 */ 13) ||
        props.inputAmount.length < 10
      ) {
        // 第一位数
        if (props.inputAmount === "0" && n !== ".") {
          // props.inputAmount = n.toString();
          context.emit("update:inputAmount", n.toString());
        } else {
          // console.log(". n:>> ", refDot.value, dotNumber.value);
          if (!refNumberWithDot.value) {
            //无小数点
            // props.inputAmount + n.toString();
            context.emit(
              "update:inputAmount",
              props.inputAmount + n.toString()
            );
          } else if (refNumberWithDot.value && dotNumber.value < 4) {
            // 有小数点
            dotNumber.value += 1;
            // props.inputAmount += n.toString();
            context.emit(
              "update:inputAmount",
              props.inputAmount + n.toString()
            );
          }
        }
      }
    };
    const numberPart = [
      {
        text: "1",
        onClick: () => {
          appendNumber(1);
        },
      },
      {
        text: "2",
        onClick: () => {
          appendNumber(2);
        },
      },
      {
        text: "3",
        onClick: () => {
          appendNumber(3);
        },
      },
      {
        text: "4",
        onClick: () => {
          appendNumber(4);
        },
      },
      {
        text: "5",
        onClick: () => {
          appendNumber(5);
        },
      },
      {
        text: "6",
        onClick: () => {
          appendNumber(6);
        },
      },

      {
        text: "7",
        onClick: () => {
          appendNumber(7);
        },
      },
      {
        text: "8",
        onClick: () => {
          appendNumber(8);
        },
      },
      {
        text: "9",
        onClick: () => {
          appendNumber(9);
        },
      },
      {
        text: "0",
        onClick: () => {
          appendNumber(0);
        },
      },
      {
        text: ".",
        onClick: () => {
          // console.log("object :>> ", refDot.value);
          if (!refNumberWithDot.value) {
            // 无 dot
            refNumberWithDot.value = true;
            dotNumber.value = 1;
            appendNumber();
          }
        },
      },
      {
        text: "清空",
        onClick: () => {
          // props.inputAmount = "0";
          context.emit("update:inputAmount", "0");
          refNumberWithDot.value = false;
          dotNumber.value = 0;
        },
      },
      {
        text: "记帐",
        onClick: () => {
          props.handleSubmit();
          refNumberWithDot.value = false;
          dotNumber.value = 0;
        },
      },
    ];
    const refDate = useVModel(props, "inputDate", context.emit);
    const date_format = computed(() => {
      return refDate.value.join("-");
    });
    const data_record = useSL(refDate.value);
    const showPicker = ref(false);

    return () => (
      <div class={s.inputPad}>
        <div class={s.dataAmount}>
          <span class={s.date}>
            <svg-icon src={svgs.datetime} w="24px" class={s.icon} />
            <span>
              <span
                onClick={() => {
                  data_record.save(refDate.value);
                  showPicker.value = true;
                }}
              >
                {date_format.value}
              </span>
              <Popup
                position="bottom"
                v-model:show={showPicker.value}
                onClickOverlay={() => {
                  window.setTimeout(() => {
                    // 防止跳动
                    refDate.value = data_record.load();
                  }, 100);
                  showPicker.value = false;
                }}
              >
                <DatePicker
                  v-model={refDate.value}
                  title="选择日期"
                  onConfirm={() => {
                    showPicker.value = false;
                  }}
                  onCancel={() => {
                    window.setTimeout(() => {
                      // 防止跳动
                      refDate.value = data_record.load();
                    }, 100);
                    showPicker.value = false;
                  }}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>
            <svg-icon name={svgs.yuan} class={s.yuan} />
            {props.inputAmount}
          </span>
        </div>
        <div class={s.buttons}>
          {numberPart.map((item) => (
            <button onClick={item.onClick}>{item.text}</button>
          ))}
        </div>
      </div>
    );
  },
});
