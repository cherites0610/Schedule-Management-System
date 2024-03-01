<template>
    <van-cell-group>
        <van-swipe-cell>
            <van-cell>
                <template #title>
                    <h3 class="custom-title">{{ scheduling.date }}</h3>
                    <span>{{ scheduling.time }}</span>
                </template>
                <template #value>
                    <span style="display: block;">{{ scheduling.workName }}</span>
                    <span>${{ scheduling.wage }}</span>
                </template>
            </van-cell>
            <template #right>
                <van-button square type="primary" @click="editScheduling" text="修改" />
                <van-button square type="danger" @click="deleteScheduling" text="删除" />
            </template>
        </van-swipe-cell>
    </van-cell-group>
</template>

<script setup>
import { deleteSchedulingByDateTime } from '/Schedule Management System/src/axios/schedulingApi.js'
const { scheduling } = defineProps(['scheduling'])
import { showSuccessToast, showFailToast } from 'vant';

const deleteScheduling = () => {
    deleteSchedulingByDateTime(scheduling.date,scheduling.time).then((result) => {
        console.log('deleteSchedulingByDateTime成功')
        window.location.reload();
    })
}

const editScheduling = () => {
    showSuccessToast('敬請期待')
}

</script>

<style lang="less" scoped>
#container {
    padding: 0.2rem;
    height: 3rem;
    width: 100%;
    background-color: #ebf5ee;
    border-radius: 0.3rem;
    display: flex;
    flex-direction: column;
}

.van-button--square {
    height: 100%;
}
</style>