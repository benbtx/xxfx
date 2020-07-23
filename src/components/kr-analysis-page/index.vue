<template>
    <div :class="$style.page">
        <div :class="$style['page-body']" ref="page-body">
            <div :class="$style['page-body-main']">
                <div
                    :class="[
                        $style['slide-module'],
                        showTable ? $style.visable : null
                    ]"
                >
                    <div :class="$style['layout-main']">
                        <div
                            id="layout-content"
                            :class="$style['layout-content']"
                        >
                            <div :class="$style['layout-chart']">
                                <slot name="component-chart"></slot>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    :class="[
                        $style['slide-module'],
                        showTable ? null : $style.visable
                    ]"
                    style="background: #fff"
                >
                    <slot name="component-table"></slot>
                </div>
            </div>
            <div :class="$style.toggle" class="box-shadow" @click="handleToggle">
                <i
                    class="el-icon-d-arrow-left"
                    :style="{
                        transform: showTable
                            ? 'rotate(-90deg)'
                            : 'rotate(90deg)'
                    }"
                    style="transition: all .3s linear"
                ></i>
                <span :class="$style.text">{{
                    showTable ? this.titleA : this.titleB
                }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "kr-page-canvas-layout",

    props: {
        title: {
            type: String
        },
        titleA: {
            type: String,
            default: "关系分析"
        },
        titleB: {
            type: String,
            default: "关系列表"
        },

        headTitle: {
            type: String
        },
        showHeadSelect: {
            type: Boolean,
            default: false
        },
        showToolbar: {
            type: Boolean,
            default: true
        },
        headSelectTitle: {
            type: String
        },
        headSelectList: {
            type: Array,
            default: () => []
        },
        defaultSelectIndex: {
            type: Number,
            default: 0
        },
        headList: {
            type: Array,
            default() {
                return [];
            }
        },

        tabNav: {
            type: Array,
            default() {
                return [];
            }
        },

        modelList: {
            type: Array,
            default() {
                return [];
            }
        },

        modelCheck: {
            type: Array,
            default() {
                return [];
            }
        },

        showInfo: {
            type: Boolean,
            default: false
        },

        isTitle: {
            type: Boolean,
            default: true
        },

        showInfoButton: {
            type: Boolean,
            default: true
        },
        showTableInfo: {
            type: Boolean,
            default: true
        },
        isInfoButton: {
            type: Boolean,
            default: false
        },
        InfoWidth: {
            type: Number,
            default: 280
        }
    },

    data() {
        return {
            showTable: false,
            modelCheckGroup: [],
            selectWith: {
                width: "200px"
            },
            selectOneWidth: 70,
            visible: false,
            newModelList: [],
            isIndeterminate: true,
            checkAll: false,
            checkboxGroup: []
        };
    },
    mounted() {
        if (this.modelList.length > 0) {
            this.initCheckBox();
        }
    },
    methods: {
        handleToggle() {
            this.showTable = !this.showTable;
        },

        handleHideInfo() {
            this.$emit("update:showInfo", this.showInfo ? false : true);
        },

        handleTogglePage(link) {
            if (link.url) {
                const { query } = this.$route;
                this.$router.push({ path: link.url, query });
            } else {
                this.$emit("tabNavClick", link.name);
            }
        },

        getNavActiveCls(str) {
            const { path } = this.$route;
            return path === str ? this.$style.active : null;
        },

        modelCheckChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.modelList.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.modelList.length;
        },

        splitModelList() {
            this.newModelList = [];
            for (let n = 0; n < Math.ceil(this.modelList.length / 3); n++) {
                if ((n + 1) * 3 > this.modelList.length) {
                    this.newModelList.push(this.modelList.slice(n * 3));
                } else {
                    this.newModelList.push(
                        this.modelList.slice(n * 3, (n + 1) * 3)
                    );
                }
            }
        },

        handleCheckAllChange(val) {
            this.checkboxGroup = val
                ? this.modelList.map(value => value.name)
                : [];
            this.isIndeterminate = false;
        },
        initCheckBox() {
            this.modelCheckGroup = this.modelList.map(value => value.name);
            this.splitModelList();
            this.$emit("modelChange", this.modelCheckGroup);
        },

        openCheckbox() {
            if (!this.visible) {
                this.checkboxGroup = this.modelCheckGroup;
                if (this.checkboxGroup.length === this.modelList.length) {
                    this.isIndeterminate = false;
                    this.checkAll = true;
                } else {
                    this.isIndeterminate = false;
                    this.checkAll = false;
                }
            }
        },

        closeCheck() {
            this.visible = false;
        },

        sureCheck() {
            this.modelCheckGroup = this.checkboxGroup;
            this.visible = false;
            this.$emit("modelChange", this.modelCheckGroup);
        },

        handleClose(tag) {
            this.modelCheckGroup.splice(this.modelCheckGroup.indexOf(tag), 1);
            this.$emit("modelChange", this.modelCheckGroup);
        }
    },
    watch: {
        modelList() {
            this.initCheckBox();
        },
        modelCheck() {
            this.modelCheckGroup = this.modelCheck;
        }
    }
};
</script>

<style lang="scss" module>
@import "@/styles/basic-color.scss";

.page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #fff;

    .page-body {
        position: relative;
        flex: 1;
        background: #fff;

        &-main {
            position: relative;
            height: 100%;
            width: 100%;
            overflow: hidden;

            .slide-module {
                display: flex;
                height: 100%;
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                transition: all 0.4s ease-in-out;

                &.visable {
                    transform: translateY(100%);
                }
            }
        }

        .toggle {
            position: absolute;
            left: 50%;
            bottom: 20px;
            padding: 12px 30px;
            border-radius: 5px 5px 0 0;
            transform: translate3d(-50%, 20px, 0);
            color: #fff;
            background: $color-primary;
            z-index: 3;
            cursor: pointer;
            &:hover {
                background: transparentize($color-primary, $opacity);
            }
            .icon {
                transition: all 0.4s ease-in-out;
                transform: rotate(-90deg);
            }

            .text {
                margin-left: 10px;
            }
        }
    }

    .layout-filter {
        width: 250px;
    }

    .layout-main {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 1%;
    }

    .layout-content {
        /*display: flex;*/
        flex: 1;
        width: 100%;
        max-height: 100%;
    }

    .layout-chart {
        width: 100%;
        height: 100%;
        transition: all 0.4s ease-in-out;
    }
}
</style>
