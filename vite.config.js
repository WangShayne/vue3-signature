import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build:{
    lib: {
      entry: path.resolve(__dirname, "./lib/index.js"),
      name: 'vue3-signature'
    },
    rollupOptions:{
      external:['vue'],
      output: {
        globals:{
          vue:'vue'
        }
      }
    }
  }
})
