<template>
    <van-cell-group inset>
        <van-cell title="使用者編號" :value="uId" is-link />
        <van-cell title="使用者姓名" :value="name" is-link />
        <div style="margin: 16px;">
            <van-button @click="logout" round block type="primary" native-type="submit">
                登出
            </van-button>
        </div>
    </van-cell-group>
</template>

<script setup>
import { showNotify } from 'vant';
import { router } from "../router/index";
import { storeToRefs } from 'pinia'
import { useUserStroe } from '../pinia/userStore'

const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);

const logout = () => {
    localStorage.clear();
    uId.value = 0;
    name.value = '';
    showNotify({ type: 'danger', message: '已登出' });
    router.push('/login');
}
</script>

<style lang="less" scoped></style>