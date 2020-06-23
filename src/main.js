import Vue from "vue";
import VueMeta from "vue-meta";
import { firestorePlugin } from "vuefire";

import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;
Vue.use(VueMeta);
Vue.use(firestorePlugin);

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
