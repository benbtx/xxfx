<template>
    <div class="container">
        <template v-for="(item, index) in path">
            <div class="box" :key="index + '1'" v-if="index == 0">
                {{ item.startSixNodeId.realName }}
            </div>
            <div class="box" :key="index + '2'">
                <div class="line">
                    <span
                        class="type"
                        v-for="(re, ind) in item.sixRelations"
                        :key="ind"
                        @click="getDetail(item)"
                        >{{ ind != 0 ? " ， " : "" }}{{ re.relationType }}</span
                    >
                </div>
            </div>
            <div class="box" :key="index + '3'">
                {{ item.endSixNodeId.realName }}
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: "relationPath",
    props: {
        accountList: {
            type: Array
        },
        path: {
            type: Array
        }
    },
    data() {
        return {};
    },
    methods: {
        getDetail(row) {
            this.$emit("detail",row)
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    white-space: nowrap;
    .box {
        height: 30px;
        line-height: 30px;
        .line {
            border-bottom: 1px solid #d0d0d0;
            line-height: 15px;
            margin: 0 10px;
            padding: 0 30px;
            .type {
                color: $color-primary;
                cursor: pointer;
            }
        }
    }
}
</style>
