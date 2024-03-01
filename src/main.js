import { createApp } from 'vue' 
import 'vant/es/notify/style';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/lib/index.css';
import App from './App.vue'
import { router } from './router';
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App);

app.use(pinia)
app.use(router)
app.mount('#app');