<template>
    <div>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="account.username" name="用户名" label="用户名" placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]" />
                <van-field v-model="account.password" type="password" name="密码" label="密码" placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    登錄
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStroe } from '../pinia/userStore'
import { showNotify } from 'vant';
import { login, auth } from '../axios/userApi';
import CryptoJS from 'crypto-js';
import { router } from '../router';
const secretKey = '7#9$2%1&5*8@4'
const userStore = useUserStroe();
const {uId,name} = storeToRefs(userStore);

const account = ref({
    username: '',
    password: '',
})


const onSubmit = () => {
    login(account.value.username, CryptoJS.AES.encrypt(account.value.password, secretKey).toString()).then((result) => {
        if (result.data.status) {
            localStorage.setItem('token',result.data.token);
            uId.value = parseInt(result.data.uId);
            name.value = result.data.name;
            router.push('/')
        } else {
            showNotify({ type: 'danger', message: '登錄失敗' });
        }
    }).catch((err) => {
        console.log(err)
    })
}
</script>

<style lang="scss" scoped></style>