import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon",
    },
    path: {
      type: String,
      default: "src-assets-icons",
    },
    name: {
      type: String,
      required: false,
      default: "empty_img",
    },
    src: {
      // alias name;from `img`;
      type: String,
      required: false,
    },
    custom: {
      type: Boolean,
      required: false,
      default: false,
    },
    w: {
      type: String,
      required: false,
    },
    h: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const symbolId = computed(
      () => `#${props.prefix}-${props.path}-${props.src ?? props.name}`
    );
    return { symbolId, size: { w: props.w, h: props.h } };
  },
  render() {
    return (
      <svg aria-hidden="true" width={this.size.w} height={this.size.h}>
        <use xlinkHref={this.symbolId} />
      </svg>
    );
  },
});
