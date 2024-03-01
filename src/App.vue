<script setup>
import FootNav from './components/FootNav.vue';
import { router } from "./router/index";
import { storeToRefs } from 'pinia'
import { useUserStroe } from './pinia/userStore'
import { auth } from './axios/userApi';

const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);

auth(localStorage.getItem('token')).then((result) => {
  uId.value = result.data.uId;
  name.value = result.data.name;
})

const clickAccount = () => {
  if (localStorage.getItem('token')) {
    router.push('/account');
  } else {
    router.push('/login');
  }

}

</script>

<template>
  <van-nav-bar @click-right="clickAccount" title="排班管理系統">
    <template #left>
      <span style="">{{ name }}</span>
    </template>
    <template #right>
      <van-icon name="user-circle-o" size="0.6rem" />
    </template>
  </van-nav-bar>
  <RouterView />
  <FootNav />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root:root {
  --van-grid-item-content-padding: 0.1rem;
  --van-calendar-info-font-size: 0.15rem;
  --van-dropdown-menu-background: 0;
  --van-dropdown-menu-shadow: 0
}
</style>
