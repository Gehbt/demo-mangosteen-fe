import { computed, defineComponent, ref } from "vue";
import s from "./InputPad.module.scss";
import { DatePicker, Popup } from "vant";
import { time } from "@/composables/date";
import { useSL } from "@/composables/save_load";

export const InputPad = defineComponent({
  name: "InputPad",
  setup(props, context) {
    const refAmount = ref("0");
    const refDot = ref(false);
    const dotNumber = ref(0);
    const appendNumber = (n: number | "." = ".") => {
      if (
        // < 11位数
        (refDot.value && refAmount.value.length < /* 11+ "." +2 */ 14) ||
        refAmount.value.length < 11
      ) {
        // 第一位数
        if (refAmount.value === "0" && n !== ".") {
          refAmount.value = n.toString();
        } else {
          // console.log(". n:>> ", refDot.value, dotNumber.value);
          if (!refDot.value) {
            //无小数点
            refAmount.value += n.toString();
          } else if (refDot.value && dotNumber.value < 4) {
            // 有小数点
            dotNumber.value += 1;
            refAmount.value += n.toString();
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
          if (!refDot.value) {
            // 无 dot
            refDot.value = true;
            dotNumber.value = 1;
            appendNumber();
          }
        },
      },
      {
        text: "清空",
        onClick: () => {
          refAmount.value = "0";
          refDot.value = false;
          dotNumber.value = 0;
        },
      },
      {
        text: "记录",
        onClick: () => {
          // todo: record
          console.log("amount :>> ", refAmount.value);
          refAmount.value = "0";
          refDot.value = false;
          dotNumber.value = 0;
        },
      },
    ];
    const nowDate = time(new Date()).format();
    const refDate = ref<[string, string, string]>(
      nowDate.split("-") as [string, string, string]
    );
    const date_format = computed(() => {
      return refDate.value.join("-");
    });
    let data_record = useSL(refDate.value);
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
                  setTimeout(() => {
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
                    setTimeout(() => {
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
            {refAmount.value}
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
