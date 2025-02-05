/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import App from './App.vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import "vue-toastification/dist/index.css";
import Toast, {POSITION} from "vue-toastification";

const app = createApp(App)

app.use(Toast, {
    position: POSITION.TOP_LEFT,
    newestOnTop: true,
    timeout: 5000,
});
registerPlugins(app)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
