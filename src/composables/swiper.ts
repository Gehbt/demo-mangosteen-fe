// !错误的hooks 不要在纯ts里用vue的api
import { type Ref, computed, onMounted, onUnmounted, ref } from "vue";
import { throttle } from "lodash-es";
type Point = { x: number; y: number };
export enum Direction {
  o = "0",
  r = "→",
  l = "←",
  d = "↓",
  u = "↑",
}
interface Options {
  beforeStart: (e: TouchEvent) => void;
  afterStart: (e: TouchEvent) => void;
  beforeMove: (e: TouchEvent) => void;
  afterMove: (e: TouchEvent) => void;
  beforeEnd: (e: TouchEvent) => void;
  afterEnd: (e: TouchEvent) => void;
}
export const useSwiper = (
  el: Ref<HTMLElement | undefined>,
  options?: Partial<Options>
) => {
  const start = ref<Point>({ x: 0, y: 0 });
  const end = ref<Point>();
  // exportd
  const isSwiping = ref(false);
  const distance = computed(() => {
    if (!end.value) {
      return undefined;
    }
    return {
      x: end.value.x - start.value.x,
      y: end.value.y - start.value.y,
    };
  });
  const direction = computed(() => {
    if (!distance.value) {
      return undefined;
    } else if (distance.value.x === 0 && distance.value.y === 0) {
      return Direction.o;
    } else if (Math.abs(distance.value.x) > Math.abs(distance.value.y)) {
      // 这里应该是(-inf,-30],[30,inf) ,但直接设置为(-inf,30],[30,inf)
      return distance.value.x > 0 ? Direction.r : Direction.l;
    } else {
      return distance.value.y > 0 ? Direction.d : Direction.u;
    }
  });
  const onTouchStart = (e: TouchEvent) => {
    options?.beforeStart?.(e);
    start.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isSwiping.value = true;
    options?.afterStart?.(e);
  };
  const onTouching = (e: TouchEvent) => {
    options?.beforeMove?.(e);
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    options?.afterMove?.(e);
  };
  const onTouching_Throttle = throttle(onTouching, 1000, { trailing: false });
  const onTouchEnd = (e: TouchEvent) => {
    options?.beforeEnd?.(e);
    isSwiping.value = false;
    options?.afterEnd?.(e);
  };
  onMounted(() => {
    if (!el.value) {
      return;
    }
    el.value.addEventListener("touchstart", onTouchStart);
    el.value.addEventListener("touchmove", onTouching_Throttle);
    el.value.addEventListener("touchend", onTouchEnd);
  });
  onUnmounted(() => {
    if (!el.value) {
      return;
    } else {
      el.value.removeEventListener("touchstart", onTouchStart);
      el.value.removeEventListener("touchmove", onTouching_Throttle);
      el.value.removeEventListener("touchend", onTouchEnd);
    }
  });
  return {
    isSwiping,
    direction,
    lengthX: distance.value?.x,
    lengthY: distance.value?.y,
  };
};
