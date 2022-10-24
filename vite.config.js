import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    // proxy:{
    //   '/api': 'http://192.168.1.48:4080'
    // }
    // host: '0.0.0.0'
  },
  base: "./",
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/styles/quasar.variables.sass",
    }),
    
  ],
  // server: {
  //   host: '0.0.0.0'
  // },
});
