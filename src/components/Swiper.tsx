// Import Swiper Vue.js components
// import { Swiper, SwiperSlide } from "swiper/vue";
import { Swipe, SwipeItem } from "vant";
// Import Swiper styles
// import "swiper/css?inline";

export const SwiperView = defineComponent({
  name: "SwiperView",
  setup() {
    return () => (
      <div>
        <Swipe
          indicator-color="white"
          style={{
            color: "#fff",
            fontSize: "20px",
            lineHeight: "150px",
            textAlign: "center",
            backgroundColor: "#39a9ed",
          }}
        >
          <SwipeItem>Slide 1</SwipeItem>
          <SwipeItem>Slide 2</SwipeItem>
          <SwipeItem>Slide 3</SwipeItem>
        </Swipe>
      </div>
    );
  },
});
