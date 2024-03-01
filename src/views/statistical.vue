<template>
    <van-form @submit="onSubmit">
        <van-field v-model="dateShow" readonly is-link label="選擇統計日期" placeholder="點擊選擇日期"
            @click="calendarParameter.showCalendar = true" :rules="[{ required: true, message: '請填寫開始日期' }]" />
        <Calendar @confirm="calendarConfirm" :props="calendarParameter" />
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>
    </van-form>
</template>

<script setup>
import { getStatisticById } from '../axios/schedulingApi';
import { storeToRefs } from 'pinia'
import { showDialog } from 'vant';
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
import Calendar from '../components/Calendar.vue';
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);
const showCalendar = ref(false);
const dateShow = ref();
const startDate = ref();
const endDate = ref();

const calendarParameter = ref({
    'showTitle': false,
    'poppable': true,
    'showConfirm': false,
    'confirmText': '選擇日期',
    'showCalendar': false,
    'calendarType': 'range'
})

const calendarConfirm = (date) => {
    startDate.value = `${date[0].getFullYear()}-${date[0].getMonth() + 1}-${date[0].getDate()}`
    endDate.value = `${date[1].getFullYear()}-${date[1].getMonth() + 1}-${date[1].getDate()}`
    let temp = startDate.value.split('-');
    if (temp[1].length == 1) {
        temp[1] = '0' + temp[1];
    }
    if (temp[2].length == 1) {
        temp[2] = '0' + temp[2];
    }
    startDate.value = temp[0] + '-' + temp[1] + '-' + temp[2];

    temp = endDate.value.split('-');
    if (temp[1].length == 1) {
        temp[1] = '0' + temp[1];
    }
    if (temp[2].length == 1) {
        temp[2] = '0' + temp[2];
    }
    endDate.value = temp[0] + '-' + temp[1] + '-' + temp[2];
    dateShow.value = startDate.value + '至' + endDate.value;
    calendarParameter.value.showCalendar = false;
}

const onSubmit = () => {
    getStatisticById(uId.value, startDate.value, endDate.value).then((result) => {
        let inf = result.data[0];
        showDialog({
            title: startDate.value + '至' + endDate.value,
            message: '總工時:' + inf.totalHour + '\n平均工資:' + inf.avgRate + "\n總工資:" + inf.totalCost
        }).then(() => {
            // on close
        });
    }).catch((err) => {
        console.log(err)
    })
}

</script>

<style scoped></style>