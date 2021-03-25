// import Vue3Signature from "./Vue3Signature.vue"
//
// const components = [ Vue3Signature ]
//
// const install = (Vue) => {
//     components.forEach(component => Vue.component(component.name, component))
// }
//
// export default {
//     install,
//     Vue3Signature
// }

// import Vue3Signature from "./Vue3Signature.vue"
//
// export default {
//     install: (app,options) => {
//         app.provide("Vue3Signature", options)
//     }
// }


import Vue3Signature from "./Vue3Signature.vue";

const install = (app) => {
    app.component("Vue3Signature", Vue3Signature);
}

Vue3Signature.install = install;

console.log(Vue3Signature)
export default Vue3Signature;