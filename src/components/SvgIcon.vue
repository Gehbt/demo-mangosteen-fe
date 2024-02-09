<template>
  <svg :aria-hidden="true" :width="props.w" :height="props.h ?? props.w" :color="props.color">
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">

defineOptions({
  name: "SvgIconVue",
})
const props = withDefaults(
  defineProps<{
    prefix?: string,
    path?: string,
    name?: string // keyof typeof svgs, 但 json的value 只能推断出 string
    src?: string // keyof typeof svgs, 但 json的value 只能推断出 string
    custom?: boolean,
    w?: string, h?: string
    color?: string
  }>(), {
  prefix: "icon", 
  path: "src-assets-icons",
  name: "empty_img",
  custom: false,
  w: "1.2em"
})

const symbolId = computed(
  () => `#${props.prefix}-${props.path}-${props.src ?? props.name}`
);
</script>
