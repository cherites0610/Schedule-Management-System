import { createApp } from 'vue' 
import 'vant/es/notify/style';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/lib/index.css';
import App from './App.vue'
import { router } from './router';
import { createPinia } from 'pinia'
import moment from 'moment';

const pinia = createPinia()
const app = createApp(App);
moment.updateLocale('en', {
    weekdaysShort: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
});
app.use(pinia)
app.use(router)
app.mount('#app');