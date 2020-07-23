<template>
    <div v-krLoading="loading" :class="$style.table">
        <kr-custom-columns
            v-if="showCustomColumns"
            title="筛选表格列设置"
            :columns="defaultColumns"
            @on-columns-change="handleColumnsChange"
        ></kr-custom-columns>
        <slot name="bar-search"></slot>
        <div :class="$style['table-container']">
            <d2-crud
                v-bind="$attrs"
                ref="d2Table"
                :index-row="indexRow"
                :selection-row="selectionRow"
                :columns="showCustomColumns ? customColumns : defaultColumns"
                :data="rows"
                @current-change="handleCurrentChange"
                @sort-change="handleSortChange"
                @selection-change="handleSelectionChange"
                :options="tableOptions"
            >
            </d2-crud>
        </div>
        <div :class="$style['table-pagination']">
            <kr-pagination
                v-if="showPagination"
                :total="total"
                :defaultCurrent="current"
                :pageSizes="pageSizes"
                @on-page-change="pageChange"
            ></kr-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: "kr-table",

    props: {
        indexRow: {
            type: [Object, Boolean],
            default() {
                return {
                    title: "序号",
                    width: "50",
                    align: "center"
                };
            }
        },

        selectionRow: {
            type: [Object, Boolean],
            default() {
                return false;
            }
        },

        columns: {
            type: Array,
            default() {
                return [];
            }
        },

        loading: {
            type: Boolean,
            default: false
        },

        rows: {
            type: Array,
            default() {
                return [];
            }
        },

        showPagination: {
            type: Boolean,
            default: true
        },

        showCustomColumns: {
            type: Boolean,
            default: false
        },

        options: {
            type: Object
        },

        total: {
            type: Number
        },

        current: {
            type: Number
        },

        pageSizes: {
            type: Array
        }
    },

    data() {
        return {
            dialogVisible: false,
            tableOptions: {
                border: true,
                headerCellClassName: this.$style.th,
                cellClassName: this.$style.cell,
                ...this.options
            },
            // 自定义列
            customColumns: []
        };
    },

    computed: {
        defaultColumns() {
            const defaultColumns = this.columns.map(item => {
                return {
                    align: "center",
                    ...item
                };
            });
            return defaultColumns;
        }
    },

    methods: {
        pageChange(current, size) {
            this.$emit("on-page-change", current, size);
        },
        handleColumnsChange(columns) {
            this.customColumns = columns;
            // 列改变触发的自定义事件
            this.$emit("on-columns-change", columns);
        },
        handleSortChange({ prop, order }) {
            this.$emit("sort-change", { prop, order });
        },
        handleCurrentChange(val) {
            this.$emit("current-change", val);
        },
        handleSelectionChange(val) {
            this.$emit("selection-change", val);
        }
    },

    mounted() {}
};
</script>

<style lang="scss" module>
@import "@/styles/basic-color.scss";
.table {
    width: 100%;
    overflow: auto;
    font-size: 14px;
    // 自定义表头样式
    .th {
        padding: 15px 0;
        text-align: center;
        font-weight: bold;
        color: #333;
        font-size: 14px;
        background: #fafafa;
    }

    :global {
        .operate {
            white-space: nowrap;
            font-size: 14px;

            a {
                margin: 0 8px;
                color: #1890ff;
                cursor: pointer;

                &.disabled {
                    cursor: not-allowed;
                    color: #ccc !important;
                    // pointer-events: none;
                }
            }
        }
        .is-indeterminate .el-checkbox__inner {
            background-color: $color-primary !important;
            border-color: $color-primary !important;
        }
        .is-checked .el-checkbox__inner {
            background-color: $color-primary !important;
            border-color: $color-primary !important;
        }
    }
}
</style>
