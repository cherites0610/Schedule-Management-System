<template>
    <van-form ref="tFrom" @submit="onSubmit">
        <van-cell-group inset>
            <van-field v-model="templateFormInf.workId" label="工作編號" placeholder="#"
                :rules="[{ pattern, message: '工作編號必須為#和四位數字' }]" />
            <van-field v-model="templateFormInf.workName" label="工作名" placeholder="工作名"
                :rules="[{ required: true, message: '請填寫工作名' }]" />
            <van-field type="number" label="時薪" :rules="[{ required: true, message: '請填寫時薪' }]">
                <template #input>
                    <van-stepper :min="183" v-model="templateFormInf.hourlyRate" />
                </template>
            </van-field>
        </van-cell-group>
    </van-form>
</template>

<script setup>
import { getWorkTemplateByID, setWorkTemplate } from '/Schedule Management System/src/axios/schedulingApi'
import { storeToRefs } from 'pinia'
import { showSuccessToast, showFailToast } from 'vant';
import { showNotify } from 'vant';
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);
const tFrom = ref(null)

const pattern = /#(\d{4})\b/;
const templateFormInf = ref({
    workId: '#',
    workName: '',
    hourlyRate: 183,
})

const onSubmit = () => {
    getWorkTemplateByID(uId.value).then((result) => {
        const wIDs = (result.data).map(item => item.wId)
        if (wIDs.includes(templateFormInf.value.workId)) {
            showNotify({ type: 'danger', message: '工作編號重複' });
            showFailToast('添加失敗')
            templateFormInf.value.workId = '#';
        } else {
            showSuccessToast('添加成功')
            setWorkTemplate(uId.value, templateFormInf.value.workId, templateFormInf.value.workName, templateFormInf.value.hourlyRate).then((result) => {
                templateFormInf.value = {
                    workId: '#',
                    workName: '',
                    hourlyRate: 183,
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}

defineExpose({
    onSubmit,
    tFrom
});
</script>

<style lang="less" scoped></style>