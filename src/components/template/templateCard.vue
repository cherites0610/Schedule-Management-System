<template>
    <van-cell-group>
        <van-swipe-cell>
            <van-cell center="">
                <template #title>
                    <h3 class="custom-title">{{ template.name }}</h3>
                    <span>{{ template.wId }}</span>
                </template>
                <template #value>
                    <span>時薪:{{ template.hourRate }}</span>
                </template>
            </van-cell>
            <template #right>
                <van-button square type="primary" text="修改" />
                <van-button square type="danger" @click="deleteTemplate" text="删除" />
            </template>
        </van-swipe-cell>
    </van-cell-group>
</template>

<script setup>
import { deleteWorkTemplateByID } from '../../axios/schedulingApi';
import { showSuccessToast, showFailToast } from 'vant';
const { template } = defineProps(['template'])

const deleteTemplate = () => {
    deleteWorkTemplateByID(template.wId).then((result) => {
        showSuccessToast('刪除成功')
        window.location.reload();
    }).catch((err) => {
        console.log(err)
    })
}
</script>

<style lang="less" scoped>
.van-button--square {
    height: 100%;
}
</style>