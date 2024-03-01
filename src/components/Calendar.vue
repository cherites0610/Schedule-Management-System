<template>
    <van-calendar @confirm="confirm" @select="select" :type="props.calendarType" v-model:show="props.showCalendar" :poppable="props.poppable"
        :show-title='props.showTitle' :show-confirm="props.showConfirm" :confirm-text="props.confirmText"
        :show-subtitle="false" :min-date="minDate" :max-date="maxDate" :formatter="formatter" :style="{ height: '100%' }">
        <template #month-title="{ text, date }">
            <van-row>
                <van-col span="8"><van-button @click="provClick" size="mini"><van-icon
                            name="arrow-left" /></van-button></van-col>
                <van-col span="8">{{ text }}</van-col>
                <van-col span="8"><van-button @click="nextClick" size="mini"><van-icon
                            name="arrow" /></van-button></van-col>
            </van-row>
        </template>
    </van-calendar>
</template>

<script setup>
const { props } = defineProps(['props']);
import { getSchedulingByID } from '/Schedule Management System/src/axios/schedulingApi';
import { storeToRefs } from 'pinia'
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
import { calculateHourDifference } from '../util/calculateHourDifference';
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);
const minDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const maxDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()))
const schedulesData = ref([]);
const schedulesDate = ref([]);
const schedulesTime = ref([]);
const emit = defineEmits(['select', 'confirm'])

const confirm = (day) => {
    emit('confirm', day)
}

const select = (day) => {
    emit('select', day);
}

onMounted(async () => {
    await query();
})

const query = () => {
    getSchedulingByID(uId.value).then((response) => {
        schedulesData.value = response.data;
        for (let i = 0; i < response.data.length; i++) {
            let temp = schedulesData.value[i].time.split('-');
            schedulesData.value[i].restHour = calculateHourDifference(temp[0], temp[1]) - schedulesData.value[i].restHour;
            schedulesDate.value.push(response.data[i].date)
            schedulesTime.value.push(response.data[i].time)
        }
    }).catch((err) => {
        console.log(err)
    });
}

const nextClick = () => {
    let currentYear = minDate.value.getFullYear()
    let currentMonth = minDate.value.getMonth() + 1
    if (currentMonth >= 12) {
        minDate.value = new Date(currentYear + 1, 0, 1)
        maxDate.value = new Date(currentYear + 1, 0, 31)
    } else {
        minDate.value = new Date(currentYear, currentMonth, 1)
        maxDate.value = new Date(currentYear, currentMonth, new Date(currentYear, currentMonth + 1, 0).getDate())
    }
}

const provClick = () => {
    let currentYear = minDate.value.getFullYear()
    let currentMonth = minDate.value.getMonth()
    if (currentMonth <= 0) {
        minDate.value = new Date(currentYear - 1, 11)
        maxDate.value = new Date(currentYear - 1, 11, 31)
    } else {
        minDate.value = new Date(currentYear, currentMonth - 1, 1)
        maxDate.value = new Date(currentYear, currentMonth - 1, new Date(currentYear, currentMonth, 0).getDate())

    }
}


const formatter = computed(() => {
    if (!schedulesDate.value) {
        return (day) => day;
    }
    return (day) => {
        const year = day.date.getFullYear();
        let month = day.date.getMonth() + 1;
        let date = day.date.getDate();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (date.toString().length == 1) {
            date = '0' + date;
        }
        let formatterDate = year + '-' + month + '-' + date;

        if (schedulesDate.value.includes(formatterDate)) {
            day.topInfo = schedulesData.value[schedulesDate.value.indexOf(formatterDate)].name;
            let temp = schedulesTime.value[schedulesDate.value.indexOf(formatterDate)].split('-');
            day.bottomInfo = temp[0] + '-' + temp[1]
        }
        return day;
    };
})

defineExpose({
    schedulesDate,
    schedulesTime,
    schedulesData,
    query,
})
</script>

<style lang="less" scoped></style>