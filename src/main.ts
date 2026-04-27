import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { use_auth_store } from "@/stores/use_auth_store";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const auth_store = use_auth_store(pinia);
auth_store.load_token();

app.use(router);

app.mount("#app");
