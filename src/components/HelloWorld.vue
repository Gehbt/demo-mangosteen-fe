<script setup lang="ts">
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x 改变了！')
  })
}
trackChange($$(count))
</script>

<template>
  <div>
    {{ count }}
  </div>
  <div><button @click="increment">+1</button></div>
</template>

<style scoped></style>
<!-- <route lang="json">
//   {
//     "path": "/hello",
//     "component": "/src/components/users.vue",
//     "children": [
//       {
//         "path": "",
//         "component": "/src/pages/users/index.vue",
//         "name": "users"
//       },
//       {
//         "path": ":id",
//         "component": "/src/pages/users/[id].vue",
//         "name": "users-id"
//       }
//     ]
//   }
</route> -->
