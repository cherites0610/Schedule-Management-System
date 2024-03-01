<template>
    <templateCard v-for="(item, index) in templateInf" :template="item" />
    <div style="margin: 16px;">
        <van-button @click="show = true" round block type="primary" native-type="submit">
            新增模版
        </van-button>
    </div>
    <van-dialog v-model:show="show" title="新增模版" @confirm="confirm" :show-cancel-button="true">
        <templateForm ref="templateFormRef"/>
    </van-dialog>
</template>

<script setup>
import templateCard from '../components/template/templateCard.vue';
import templateForm from '../components/template/templateForm.vue';
import { getWorkTemplateByID } from '../axios/schedulingApi';
import { storeToRefs } from 'pinia'
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);

const show = ref(false);

const templateInf = ref({})
getWorkTemplateByID(uId.value).then((result) => {
    templateInf.value = result.data;
}).catch((err) => {
    console.log(err)
})

const templateFormRef = ref(null)
function confirm() {
    templateFormRef.value.tFrom.validate().then((reject) => {
        templateFormRef.value.tFrom.submit();
    }).catch((err) => {
        show.value=true
    })
}
</script>

<style lang="less" scoped></style>