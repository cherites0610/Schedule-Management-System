<template>
    <van-tabbar route :placeholder="true">
        <van-tabbar-item icon="calendar-o" to="/">日曆</van-tabbar-item>
        <van-tabbar-item icon="balance-list-o" to="/list">清單</van-tabbar-item>
        <van-tabbar-item icon="chart-trending-o" to="/statistical">統計</van-tabbar-item>
        <van-tabbar-item icon="upgrade" to="/availabilityScheduling">給班</van-tabbar-item>
        <van-tabbar-item icon="records-o"  to='/template' class="el-dropdown-link">
            模版
        </van-tabbar-item>
    </van-tabbar>
</template>
<script setup>

</script>

<style scoped></style>