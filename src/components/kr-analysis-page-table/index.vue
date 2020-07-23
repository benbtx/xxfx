<template>
    <div class="content">
        <div class="title">
            {{ title }}
        </div>
        <div class="table">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "index",
    props: {
        title: {
            type: String,
            default: "列表详情"
        }
    }
};
</script>

<style scoped lang="scss">
.content {
    height: 100%;
    width: 100%;
    .title {
        height: 50px;
        line-height: 50px;
        background-color: #f6f7fc;
        padding-left: 20px;
    }
    .table{
        height: calc(100% - 50px);
        overflow-y: auto;
    }
}
</style>
