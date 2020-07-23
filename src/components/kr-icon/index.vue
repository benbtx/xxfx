<template>
    <i
        :class="cls"
        :style="{ fontSize: sizes, color: colors, lineHeight: '1em' }"
    ></i>
</template>

<script>
export default {
    name: "kr-icon",

    props: {
        icon: {
            type: String,
            required: true
        },
        size: {
            type: Number
        },
        color: {
            type: String
        }
    },

    computed: {
        cls() {
            const icon = this.icon;
            const baseIcon = "iconfont";
            const isEl = /el-icon/.test(icon);
            return isEl ? icon : `${baseIcon} ${icon}`;
        },
        sizes() {
            return this.size + "px";
        },
        colors() {
            return this.color;
        }
    }
};
</script>

<style></style>
