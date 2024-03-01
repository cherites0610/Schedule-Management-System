<template>
    <SchedulingForm ref="form" />
    <div style="margin: 16px;">
        <van-button @click="submit" round block type="primary" native-type="submit">
            提交
        </van-button>
    </div>
</template>

<script setup>
const form = ref(null);
function submit() {
    form.value.Sform.submit();
}

</script>

<style lang="scss" scoped></style>