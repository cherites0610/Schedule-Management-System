<template>
    <van-cell title="選擇起始日期以及週期" is-link @click="showPopup" />
    <van-popup v-model:show="popupShow" position="bottom">
        <van-picker-group title="選擇資訊" :tabs="['选择日期', '选择週期']" next-step-text="下一步" @confirm="onConfirm"
            @cancel="onCancel">
            <van-date-picker :formatter="formatter" v-model="selectedDate" />
            <van-picker :columns="cycleText" v-model="cycle" />
        </van-picker-group>
    </van-popup>
    <van-cell-group v-if="cellShow">
        <van-cell center :key="index" :title="key.format('YYYY-MM-DD(ddd)')" v-for="(key, index) in cycleDate">
            <template #value>
                <van-space>
                    <van-field v-model="inputData[Number(index)]" placeholder="请输入給班時間" />
                </van-space>
            </template>
        </van-cell>
        <van-cell @click="exportData" title="匯出" is-link />
    </van-cell-group>
</template>

<script setup>
import moment from 'moment';
import { showDialog } from 'vant';
const popupShow = ref(false);
const cellShow = ref(false);
const showPopup = () => {
    popupShow.value = true
}
const inputData = ref([]);
const selectedDate = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);
const cycle = ref(['7']);
const cycleDate = ref([]);
const cycleText = [
    { text: '一周', value: '7' },
    { text: '半月', value: '14' },
    { text: '三周', value: '21' },
    { text: '一月', value: '28' },
]

const formatter = (type, option) => {
    if (type === 'year') {
        option.text += '年';
    }
    if (type === 'month') {
        option.text += '月';
    }
    if (type === 'day') {
        option.text += '日';
    }
    return option;
};

const onConfirm = () => {
    popupShow.value = false

    cycleDate.value = [];

    for (let i = 0; i < cycle.value; i++) {
        let tempDate = new moment(selectedDate.value);
        tempDate.subtract(1, 'months');
        tempDate.add(i, 'days')
        cycleDate.value.push(tempDate);
    }

    cellShow.value = true;
};

const exportData = () => {
    let outputText = '';

    for (let i = 0; i < cycleDate.value.length; i++) {
        outputText += cycleDate.value[i].format('MM/DD') + ' : ';
        if (inputData.value[i]) {
            outputText += inputData.value[i]
        } else {
            outputText += 'X'
        }
        outputText += '\n'
    }
    showDialog({ title: "給班表", message: outputText });
}

const onCancel = () => {
    popupShow.value = false
};
</script>

<style lang="scss" scoped></style>