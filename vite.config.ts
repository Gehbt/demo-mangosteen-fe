import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base:"/mangosteen-fe/dist/", // build path in github
  plugins: [vue()],
})
