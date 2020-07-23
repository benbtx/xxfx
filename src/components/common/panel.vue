<template>
    <div style="height: 100%">
        <div class="box" :class="{ 'box-hasaside': hasAside }">
            <div
                class="box-header"
                v-if="title || $slots.header"
                :class="{ 'with-border': widthBorder }"
            >
                <slot name="header"
                    ><h3 class="box-title" v-text="title" v-if="title"></h3
                ></slot>
            </div>
            <div class="box-body">
                <slot name="body" v-if="$slots.body">
                    暂无内容显示
                </slot>
                <slot v-else> </slot>
            </div>
            <div class="box-footer" v-text="footer" v-if="footer"></div>
        </div>
        <div class="box-aside" :class="{ 'box-asidecontent': hasAside }">
            <div
                v-if="$slots.aside"
                class="icon-aside  "
                :class="[hasAside ? 'icon-aside_zk' : '']"
                @click="toggleaside"
            >
                <i
                    style="margin-top:25.5px;color:white"
                    :class="[
                        hasAside ? 'el-icon-caret-right' : 'el-icon-caret-left'
                    ]"
                ></i>
            </div>
            <div v-if="hasAside" style="height:100%">
                <slot name="aside" v-if="$slots.aside">
                    暂无内容显示
                </slot>
                <slot v-else> </slot>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
export default {
    name: "ImpPanel",
    props: {
        widthBorder: {
            type: Boolean
        },
        title: {
            type: String
        },
        footer: {
            type: String
        }
    },
    data() {
        return {
            hasAside: true
        };
    },
    methods: {
        toggleaside() {
            this.hasAside = !this.hasAside;
        }
    }
};
</script>
<style type="text/scss" lang="scss" scoped>
.box {
    border: 1px solid #d3dce6;
    border-radius: 8px;
    box-shadow: 2px 2px 2px #ced3d9;
    overflow: hidden;
}

.box {
    position: relative;
    background: #ffffff;
    width: 100%;
    height: 100%;
}
.box-hasaside {
    width: calc(100% - 200px);
}

.box .overlay.dark,
.overlay-wrapper .overlay.dark {
    background: rgba(0, 0, 0, 0.5);
}
.box-header:before,
.box-body:before,
.box-footer:before,
.box-header:after,
.box-body:after,
.box-footer:after {
    content: " ";
    display: table;
}
.box-header:after,
.box-body:after,
.box-footer:after {
    clear: both;
}
.box-header {
    color: #444;
    display: block;
    padding: 15px;
    position: relative;
}
.box-header.with-border {
    border-bottom: 1px solid #f4f4f4;
}
.collapsed-box .box-header.with-border {
    border-bottom: none;
}
.box-header > .fa,
.box-header > .glyphicon,
.box-header > .ion,
.box-header .box-title {
    display: inline-block;
    font-size: 18px;
    margin: 0;
    line-height: 1;
}
.box-header > .fa,
.box-header > .glyphicon,
.box-header > .ion {
    margin-right: 5px;
}
.box-header > .box-tools {
    position: absolute;
    right: 10px;
    top: 5px;
}
.box-header > .box-tools [data-toggle="tooltip"] {
    position: relative;
}
.box-header > .box-tools.pull-right .dropdown-menu {
    right: 0;
    left: auto;
}
.box-header > .box-tools .dropdown-menu > li > a {
    color: #444 !important;
}

.box-body {
    color: #000;
    height: 100%;
}

.box-footer {
    border-top: 1px solid #f4f4f4;
    padding: 10px;
    background-color: #ffffff;
}
.icon-aside {
    position: fixed;
    right: 6px;
    top: calc(50%);
    color: #000;
    width: 14px;
    height: 65px;
    background-color: rgba(24, 144, 255, 1);
    border: none;
    border-radius: 5px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}
.icon-aside_zk {
    right: 200px;
    // transition: right 2s;
}

.box-asidecontent {
    position: absolute;
    right: 0px;
    width: 200px;
    top: 0px;
    padding-top: 20px;
    height: 100%;
    color: #000;
    background: rgba(0, 0, 0, 0.027451);
}
.box-asidecontent-noshowry {
    width: 0;
    display: none;
}
.box-asidecontent-showry {
    display: block;
}
</style>
