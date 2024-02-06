// Import Swiper Vue.js components
// import { Swiper, SwiperSlide } from "swiper/vue";
import { Swipe, SwipeItem } from "vant";
import { Dsetup, Fsetup } from "./Dsetup";
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
          <SwipeItem>{h(Dsetup)}</SwipeItem>
          <SwipeItem>
            <Fsetup />
          </SwipeItem>
        </Swipe>
      </div>
    );
  },
});
