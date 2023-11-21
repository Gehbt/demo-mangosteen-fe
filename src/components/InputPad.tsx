import { defineComponent } from "vue";
import s from "./InputPad.module.scss";
import svg from "@svg_map";
import SvgIcon from "./SvgIcon";
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
export const InputPad = defineComponent({
  name: "InputPad",
  setup(props, context) {
    return () => (
      <div class={s.inputPad}>
        <div class={s.dataAmount}>
          <span class={s.date}>
            <SvgIcon src={svg.datetime} w="24px" class={s.icon} />
            <span>2023-01-01</span>
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
