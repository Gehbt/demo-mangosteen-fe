export const useLonePress = <T>(longPressAct: (touchSign: T) => void) => {
  const timer = ref<number>();
  const currentTag = ref<HTMLDivElement>();
  const pointedElement = ref<HTMLDivElement>();
  const onTouchStart = (e: TouchEvent, touchSign: T) => {
    currentTag.value = e.currentTarget as HTMLDivElement;
    timer.value = window.setTimeout(() => {
      longPressAct(touchSign);
    }, 500);
  };
  const onTouchMove = (e: TouchEvent) => {
    pointedElement.value = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    ) as HTMLDivElement;
    if (
      pointedElement.value !== currentTag.value &&
      currentTag.value?.contains(pointedElement.value) === false
    ) {
      clearTimeout(timer.value);
    }
  };

  const onTouchEnd = () => {
    clearTimeout(timer.value);
  };
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
