import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from "@vant/auto-import-resolver";
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue-router'
      ]
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],

  server: {
    //使用IP能访问
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  },

})
