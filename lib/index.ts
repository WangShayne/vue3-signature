import Vue3Signature from "./Vue3Signature.vue";

import type { App } from "vue";

const install = (app: App) => {
    app.component("Vue3Signature", Vue3Signature);
}

Vue3Signature.install = install;

export default Vue3Signature;
