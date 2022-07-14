import { createApp } from "vue";
import App from "./App.vue";
import Vue3Signature from "../lib/index";
import "default-passive-events";

createApp(App).use(Vue3Signature).mount("#app");
