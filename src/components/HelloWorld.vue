<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const onClick = () => {
  count.value++
}
</script>

<template>
  <div>
    {{ count }}
  </div>
  <div><button @click="onClick">+1</button></div>
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
