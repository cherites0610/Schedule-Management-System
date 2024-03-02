<template>
  <van-pull-refresh v-model="loading" @refresh="getList">
    <van-cell  clickable center>
      <template #title>
        <van-space @click="calendarParameter.showCalendar = true" :fill="true">
          日期選擇區間
        </van-space>
      </template>
      <template #label>
        <van-space :fill="true" @click="calendarParameter.showCalendar = true">
          {{ dateShow }}
        </van-space>
        
      </template>
      <template #value>
        <van-space @click="handleSortChange">
          調整排序
          <van-icon :name="iconName" />
        </van-space>
      </template>


    </van-cell>
    <Card v-for="(item, index) in schedulings" :scheduling="schedulings[index]" />
    <van-empty v-if="schedulings.length == 0" description="查無資料" />
  </van-pull-refresh>

  <Calendar @confirm="calendarConfirm" :props="calendarParameter" />
  <van-back-top bottom="10vh" />
</template>

<script setup>
import Card from '../components/list/card.vue';
import { getListByID } from '../axios/schedulingApi';
import { storeToRefs } from 'pinia'
import { useUserStroe } from '/Schedule Management System/src/pinia/userStore'
import Calendar from '../components/Calendar.vue';
const userStore = useUserStroe();
const { uId, name } = storeToRefs(userStore);

const dateShow = ref('未選擇');
const startDate = ref();
const endDate = ref();
const iconName = ref('arrow-up');
const order = ref('ascending')

const loading = ref(false);
const schedulings = ref([])

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

  getList();

}

function handleSortChange() {
  if (iconName.value == 'arrow-down') {
    iconName.value = 'arrow-up';
    order.value = '123';
  } else {
    iconName.value = 'arrow-down';
    order.value = 'ascending'
  }
  const data = schedulings.value;
  if (order.value == "ascending") {
    data.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    data.sort((a, b) => a.date.localeCompare(b.date));
  }
  schedulings.value = data;
}

const getList = () => {
  getListByID(uId.value, startDate.value, endDate.value).then((response) => {
    schedulings.value = response.data
    handleSortChange('ascending')
    loading.value = false
  }).catch((err) => {
    console.log(err)
    loading.value = false
  })
}

getList();
</script>

<style lang="less" scoped></style>