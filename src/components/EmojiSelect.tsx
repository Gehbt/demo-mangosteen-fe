import { emoji_lists } from "@/static";
import s from "./EmojiSelect.module.scss";

// function* generateListItems() {
//   for (let i = 0; i < 100; i++) {
//     yield <li key={i}>😀</li>;
//   }
// }

export const EmojiSelect = defineComponent({
  name: "EmojiSelect",
  props: {
    class: any<string | string[]>().def(""),
    modelValue: string(),
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
