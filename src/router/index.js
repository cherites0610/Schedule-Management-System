import homeVue from "../views/home.vue";
import addScheduling from '../views/addScheduling.vue'
import list from '../views/list.vue'
import statistical from '../views/statistical.vue'
import account from '../views/account.vue'
import template from '../views/template.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../views/login.vue'
import { showNotify } from 'vant';
import { auth } from '../axios/userApi';

const routes = [
    { path: '/', component: homeVue, meta: { needLogin: true } },
    { path: '/addScheduling', component: addScheduling, meta: { needLogin: true } },
    { path: '/list', component: list, meta: { needLogin: true } },
    { path: '/statistical', component: statistical, meta: { needLogin: true } },
    { path: '/login', name: 'login', component: login },
    { path: '/account', component: account, meta: { needLogin: true } },
    { path: '/template', component: template, meta: { needLogin: true }}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeResolve((to, from, next) => {
    if (to.meta && to.name != 'login') {
        //頁面需要登入
        if (localStorage.getItem('token')) {
            //驗證使用者登入狀態
            auth(localStorage.getItem('token')).then((result) => {
                if (result.data.status) {
                    //狀態正常，放行並核發新token
                    localStorage.setItem('token', result.data.token);
                    next()
                } else {
                    //狀態異常，重定向至登入並且刪除token
                    localStorage.clear();
                    showNotify({ type: 'danger', message: '登錄狀態異常，請重新登錄' });
                    next('/login')
                }
            })
        } else {
            //訪問者未登入
            showNotify({ type: 'danger', message: '該頁面需要登入' });
            next('/login')
        }
    } else {
        //頁面不需要登入
        next()
    }
})