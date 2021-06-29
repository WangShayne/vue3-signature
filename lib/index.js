import Vue3Signature from "./Vue3Signature.vue";

const install = (app) => {
    app.component("Vue3Signature", Vue3Signature);
}

Vue3Signature.install = install;

export default Vue3Signature;