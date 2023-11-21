import { computed, defineComponent, ref } from "vue";
import s from "./InputPad.module.scss";
import svg from "@svg_map";
import SvgIcon from "./SvgIcon";
import { DatePicker, Popup } from "vant";
import { time } from "@/composables/date";
import { useSL } from "@/composables/save_load";

export const InputPad = defineComponent({
  name: "InputPad",
  setup(props, context) {
    const numberPart = [
      { text: 1, onclick: () => {} },
      { text: 2, onclick: () => {} },
      { text: 3, onclick: () => {} },
      { text: "删除", onclick: () => {} },
      { text: 4, onclick: () => {} },
      { text: 5, onclick: () => {} },
      { text: 6, onclick: () => {} },
      { text: "+", onclick: () => {} },
      { text: 7, onclick: () => {} },
      { text: 8, onclick: () => {} },
      { text: 9, onclick: () => {} },
      { text: "-", onclick: () => {} },
      { text: "清空", onclick: () => {} },
      { text: 0, onclick: () => {} },
      { text: ".", onclick: () => {} },
      { text: "提交", onclick: () => {} },
    ];
    const nowDate = time(new Date()).format();
    // console.log(nowDate.split("-"));
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
            <SvgIcon src={svg.datetime} w="24px" class={s.icon} />
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
                }}
              >
                <DatePicker
                  v-model={refDate.value}
                  title="选择日期"
                  onConfirm={() => {
                    showPicker.value = false;
                  }}
                  onCancel={() => {
                    refDate.value = data_record.load();
                    showPicker.value = false;
                  }}
                />
              </Popup>
            </span>
          </span>
          <span class={s.amount}>12.34</span>
        </div>
        <div class={s.buttons}>
          {numberPart.map((item) => (
            <button onClick={item.onclick}>{item.text}</button>
          ))}
        </div>
      </div>
    );
  },
});
