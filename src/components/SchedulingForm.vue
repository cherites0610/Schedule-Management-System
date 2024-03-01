<template>
    <van-form ref="Sform" @submit="onSubmit">
        <van-cell-group inset>
            <!-- 工作名稱 -->
            <van-field label="工作名稱">
                <template #input>
                    <van-dropdown-menu auto-locate>
                        <van-dropdown-item :options="option1" v-model="wId" />
                    </van-dropdown-menu>
                </template>
            </van-field>


            <!-- 時薪 -->
            <van-field type="number" label="時薪" :rules="[{ required: true, message: '請填寫時薪' }]">
                <template #input>
                    <van-stepper :min="183" v-model="schedulingForm.hourRate" />
                </template>
            </van-field>

            <!-- 加給 -->
            <van-field label="特殊加計">
                <template #input>
                    <van-radio-group v-model="schedulingForm.checked" direction="horizontal">
                        <van-radio name="1">*1</van-radio>
                        <van-radio name="2">*2</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <!-- 日期 -->
            <van-field readonly v-model="schedulingForm.date" is-link label="排班日期" placeholder="點擊選擇日期"
                @click="calendarParameter.showCalendar = true" :rules="[{ required: true, message: '請填寫排班日期' }]" />
            <Calendar @confirm="confirm" :props="calendarParameter" />

            <!-- 開始時間 -->
            <van-field readonly v-model="schedulingForm.startTime" is-link label="排班開始時間" placeholder="點擊選擇時間"
                @click="showStartTimePicker = true" :rules="[{ required: true, message: '請填寫開始時間' }]"></van-field>
            <van-popup v-model:show="showStartTimePicker" position="bottom">
                <van-time-picker :min-hour="4" :filter="startTimefilter" @confirm="startTimeOnConfirm"
                    @cancel="showStartTimePicker = false" />
            </van-popup>

            <!-- 結束時間 -->
            <van-field readonly v-model="schedulingForm.endTime" is-link label="排班結束時間" placeholder="點擊選擇時間"
                @click="showEndTimePicker = true" :rules="[{ required: true, message: '請填寫結束時間' }]"></van-field>
            <van-popup v-model:show="showEndTimePicker" position="bottom">
                <van-time-picker :filter="endTimefilter" @confirm="endTimeOnConfirm" @cancel="showEndTimePicker = false" />
            </van-popup>

            <!-- 休息時數 -->
            <van-field type="number" label="休息時數" :rules="[{ required: true, message: '請填寫休息時數' }]">
                <template #input>
                    <van-stepper :min="0" step="0.5" v-model="schedulingForm.restHours" />
                </template>
            </van-field>

        </van-cell-group>

    </van-form>
</template>

<script setup>
import { getWorkById, setSchedulingByID, getWorkIdByName } from '../axios/schedulingApi'
import { calculateHourDifference } from '../util/calculateHourDifference.js'
import { showSuccessToast, showFailToast } from 'vant';
import { storeToRefs } from 'pinia'
import Calendar from './Calendar.vue';
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);
const Sform = ref(null);

const wId = ref('0');
const option1 = ref([
    { text: '暫未讀取', value: '0' }
]);

getWorkById(uId.value).then((result) => {
    option1.value = result.data;
    wId.value = result.data[0].value
}).catch((err) => {
    console.log(err)
})

const calendarParameter = ref({
    'showTitle': false,
    'poppable': true,
    'showConfirm': false,
    'confirmText': '選擇日期',
    'showCalendar': false,
    'calendarType': 'single'
})

const schedulingForm = ref({
    sId: 0,
    workName: '必勝客',
    hourRate: 183,
    date: '',
    startTime: '04:00',
    endTime: '',
    checked: '1',
    restHours: 0,
})

const showStartTimePicker = ref(false);
const showEndTimePicker = ref(false);
const startTimefilter = (type, options, values) => {
    if (schedulingForm.value.endTime) {
        //已選定結束時間
        let endTime = schedulingForm.value.endTime.split(':');
        if (type === 'hour') {
            options = options.filter(
                (option) => {
                    if(endTime[1]=='30'){
                        return Number(option.value)<=Number(endTime[0]);
                    }else{
                        return Number(option.value)<Number(endTime[0]);
                    }
                }
            )
        } else {
            options = options.filter(
                (option) => {
                    if(endTime[1]=='30'&&endTime[0]==values[0]){
                        return Number(option.value)==0;
                    }else{
                        return Number(option.value)%30==0;
                    }
                }
            )
        }
    } else {
        //未選定結束時間
        if (type === 'minute') {
            return options.filter((option) => Number(option.value) % 30 === 0);
        }
    }
    return options;
};

const startTimeOnConfirm = (time) => {
    schedulingForm.value.startTime = new String(time.selectedValues[0] + ':' + time.selectedValues[1]);
    showStartTimePicker.value = false
}

const endTimefilter = (type, options, values) => {
    const startTime = schedulingForm.value.startTime.split(':');

    if (type === 'hour') {
        options = options.filter(
            (option) => {
                // console.log(option)
                if (startTime[1] == '30') {
                    return Number(option.value) > Number(startTime[0]);
                } else {
                    return Number(option.value) >= Number(startTime[0]);
                }
            }
        )
    } else {
        options = options.filter(
            (option) => {
                if (values[0] == startTime[0]) {
                    return Number(option.value) == 30
                } else {
                    return Number(option.value) % 30 == 0
                }
            }
        )
    }
    return options;
}

const endTimeOnConfirm = (time) => {
    schedulingForm.value.endTime = new String(time.selectedValues[0] + ':' + time.selectedValues[1]);
    showEndTimePicker.value = false
}

const confirm = (date) => {
    schedulingForm.value.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let temp = schedulingForm.value.date.split('-');
    if (temp[1].length == 1) {
        temp[1] = '0' + temp[1];
    }
    if (temp[2].length == 1) {
        temp[2] = '0' + temp[2];
    }
    schedulingForm.value.date = temp[0] + '-' + temp[1] + '-' + temp[2]
    calendarParameter.value.showCalendar = false;
};

const onSubmit = () => {
    setSchedulingByID(
        uId.value,
        wId.value,
        schedulingForm.value.date,
        schedulingForm.value.startTime + '-' + schedulingForm.value.endTime,
        calculateHourDifference(schedulingForm.value.startTime, schedulingForm.value.endTime) - schedulingForm.value.restHours,
        schedulingForm.value.hourRate * schedulingForm.value.checked
    ).then((result) => {
        showSuccessToast('添加成功');
    }).catch((err) => {
        showFailToast('添加失敗');
    })
}

defineExpose({
    onSubmit,
    schedulingForm,
    Sform
})
</script>

<style lang="less" scoped></style>