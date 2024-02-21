<template>
  <div :class="s.container">
    <p :class="s.text">页面 <span :class="s.blue">{{ $route.fullPath }}</span></p>
    <p :class="[s.text,s.red]">
      Not Found!
    </p>
    <RouterLink to="/">
      <p :class="[s.text,s.blue]">回到首页</p>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" module="s">
.container {
  height: 100vh;
  display: flex;
  width: 100vw;
  overflow: clip;
  flex-direction: column;
}
.red{
  color: red;
}
.blue{
  color: rgb(70, 104, 255);
  text-decoration: underline;
  text-underline-offset: auto;
}
.text {
  text-align: center;
  font-size: 28px;
  padding: 12vw;
}
</style>
