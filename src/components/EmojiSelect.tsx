import { computed, defineComponent, ref } from "vue";
import s from "./EmojiSelect.module.scss";
import {
  face,
  hand,
  person,
  animal,
  plant,
  food,
  place,
  transport,
  time,
  event,
  sport,
  crafts,
  clothing,
  sound,
  equipment,
  misc2,
  message,
  tool,
  mark,
} from "@emoji_list";
// function* generateListItems() {
//   for (let i = 0; i < 100; i++) {
//     yield <li key={i}>😀</li>;
//   }
// }
const emoji_lists: Array<[string, Readonly<Array<[string, string[]]>>]> = [
  ["表情", face],
  ["手势", hand],
  ["职业", person],
  ["动物", animal],
  ["自然", plant],
  ["食物", food],
  ["地理", place],
  ["交通", transport],
  ["时间", time],
  ["事件", event],
  ["运动", sport],
  ["工艺", crafts],
  ["衣服", clothing],
  ["声音", sound],
  ["装备", equipment],
  ["金钱", misc2],
  ["信息", message],
  ["工具", tool],
  ["标志", mark],
];
export const EmojiSelect = defineComponent({
  name: "EmojiSelect",
  props: {
    class: any<string | string[]>().def(""),
    // {
    //   type: String as PropType<string | string[]>,
    //   required: false,
    // },
    modelValue: string(),
    // {
    //   type: String as PropType<string>,
    //   required: false,
    // },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const selectedElementIndex = ref(0);
    const emoji_title = computed(() => {
      return emoji_lists.map((item, index) => (
        <span
          key={index}
          class={selectedElementIndex.value === index ? s.selected : ""}
          onClick={() => {
            selectedElementIndex.value = index;
          }}
        >
          {item[0]}
        </span>
      ));
    });
    const emoji = computed(() => {
      const selectedPartEmoji = emoji_lists[selectedElementIndex.value][1];
      return selectedPartEmoji.map((item) =>
        item[1].map((emoji, index) => (
          <li
            onClick={() => {
              // console.log("emoji :>> ", emoji);
              exportEmoji(emoji);
            }}
            key={index}
          >
            {emoji}
          </li>
        ))
      );
    });
    const exportEmoji = (emoji: string) => {
      context.emit("update:modelValue", emoji);
    };
    return () => (
      <div class={[props.class, s["emoji-select"]]}>
        <nav>{emoji_title.value}</nav>
        <ol>{emoji.value}</ol>
      </div>
    );
  },
});
