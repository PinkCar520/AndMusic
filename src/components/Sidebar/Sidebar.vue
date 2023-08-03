<template>
    <div class="discover-buttons">
        <div class="button" v-for="(category, index) in categoryList" :key="index" @click="handleCategoryClick(category)">
            {{ category }}
        </div>
    </div>
</template>
  
<script lang="ts" setup>
// 接收父组件传递的数据
defineProps(["categoryList"]);
// 定义子组件向父组件传递数据的事件
const emit = defineEmits(['onCategoryClick']);
// 定义点击事件处理函数
function handleCategoryClick(category: string) {
    // 触发自定义事件，将 category 传递给父组件的方法
    emit('onCategoryClick', category)
}
</script>
<style lang="scss" scoped>
.discover-buttons {
    background: #ededed;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    & .button {
        width: 120px;
        height: 40px;
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #048bff;
        background-color: rgb(250, 250, 250);
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 550;
    }
}
</style>