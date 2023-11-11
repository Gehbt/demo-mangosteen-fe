import { Ref, computed, onMounted, onUnmounted, ref } from "vue";
import { throttle } from "lodash";
type Point = { x: number; y: number };
export enum Direction {
  o = "0",
  r = "→",
  l = "←",
  d = "↓",
  u = "↑",
}
export const useSwiper = (el: Ref<HTMLElement | null>) => {
  const start = ref<Point>({ x: 0, y: 0 });
  const end = ref<Point>();
  // exportd
  const isSwipping = ref(false);
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
      return distance.value.x > 0 ? Direction.r : Direction.l;
    } else {
      return distance.value.y > 0 ? Direction.d : Direction.u;
    }
  });
  const onTouchStart = (e: TouchEvent) => {
    start.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isSwipping.value = true;
  };
  const onTouching = (e: TouchEvent) => {
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const onTouching_Throttle = throttle(onTouching, 100, { trailing: false });
  const onTouchEnd = (_e: TouchEvent) => {
    isSwipping.value = false;
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
    isSwipping,
    direction,
    lengthX: distance.value?.x,
    lengthY: distance.value?.y,
  };
};
