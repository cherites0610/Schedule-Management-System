<template>
    <Calendar ref="calendar" @confirm="confirm" @select="select" :props="formParameter" />

    <van-dialog @closed="dialogClosed" :lazy-render="false" @confirm="dialogConFirm" v-model:show="addSchedulingShow"
        :title='formParameter.confirmText' show-cancel-button>
        <SchedulingForm ref="form" />
    </van-dialog>
</template>

<script setup>
import Calendar from '../components/Calendar.vue';
import SchedulingForm from '../components/SchedulingForm.vue';
import { getWorkIdByName, editSchedulingBySchedulingId } from '../axios/schedulingApi';
import { calculateHourDifference } from '../util/calculateHourDifference';
import { showSuccessToast, showFailToast, showDialog } from 'vant';
const calendar = ref(null)
const form = ref(null)
const addSchedulingShow = ref(false)

const formatterDate = (day) => {
    const year = day.getFullYear();
    let month = day.getMonth() + 1;
    let date = day.getDate();

    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (date.toString().length == 1) {
        date = '0' + date;
    }
    const formatterDate = year + '-' + month + '-' + date

    return formatterDate;
}

const dialogConFirm = () => {
    form.value.Sform.validate().then((reject) => {
        if (formParameter.value.confirmText == '添加排班') {
            form.value.Sform.submit();
        } else {
            getWorkIdByName(form.value.schedulingForm.workName).then((result) => {
                let newScheduling = {
                    wId: result.data[0].wId,
                    date: form.value.schedulingForm.date,
                    time: form.value.schedulingForm.startTime + '-' + form.value.schedulingForm.endTime,
                    hour: calculateHourDifference(form.value.schedulingForm.startTime, form.value.schedulingForm.endTime) - form.value.schedulingForm.restHours,
                    hourlyRate: form.value.schedulingForm.hourRate * form.value.schedulingForm.checked
                }
                editSchedulingBySchedulingId(form.value.schedulingForm.sId, JSON.stringify(newScheduling))
                    .then((result) => {
                        showSuccessToast('修改成功');
                    }).catch((err) => {
                        showFailToast('修改失敗');
                    })
            }).catch((err) => {
                showFailToast('修改失敗');
            });
        }
    }).catch((err) => {
        addSchedulingShow.value = true
    })

}

const formParameter = ref({
    'showTitle': false,
    'poppable': false,
    'showConfirm': true,
    'confirmText': '添加排班',
    'showCalendar': true,
    'calendarType': 'single'
})

const confirm = (day) => {
    const date = formatterDate(day)
    if (formParameter.value.confirmText === '添加排班') {
        form.value.schedulingForm.date = date
        addSchedulingShow.value = true
    } else {
        addSchedulingShow.value = true
        form.value.schedulingForm.sId = calendar.value.schedulesData[calendar.value.schedulesDate.indexOf(date)].sId;
        form.value.schedulingForm.date = date
        let times = calendar.value.schedulesTime[calendar.value.schedulesDate.indexOf(date)].split('-');
        form.value.schedulingForm.startTime = times[0];
        form.value.schedulingForm.endTime = times[1];
        form.value.schedulingForm.restHours = calendar.value.schedulesData[calendar.value.schedulesDate.indexOf(date)].restHour;
    }
}

const dialogClosed = () => {
    form.value.schedulingForm.date = '';
    form.value.schedulingForm.startTime = '';
    form.value.schedulingForm.endTime = '';
    form.value.schedulingForm.restHours = 0;
}

const select = (day) => {
    const date = formatterDate(day)

    if (calendar.value.schedulesDate.includes(date)) {
        formParameter.value.confirmText = '修改排班'
    } else {
        formParameter.value.confirmText = '添加排班'
    }

}

</script>

<style lang="less" scoped></style>