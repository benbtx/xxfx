<template>
    <el-container class="wrapper">
        <el-scrollbar
            class="container-left"
            wrap-class="container-left-wrap"
            :class="{ 'slide-hide': isCollapse, 'slide-in-left': menuShow }"
        >
            <el-menu
                class="menu"
                :default-active="onRoutes"
                :collapse="isCollapse"
                style="border: none;"
                text-color="rgb(191, 203, 217)"
                background-color="#00152A"
                unique-opened
            >
                <template v-for="(item,index) in menus">
                    <el-menu-item
                        :key="index"
                        :index="item.path"
                        v-if="!item.children.length"
                        @click="menuClick(item.path)"
                    >
                        <i class="iconfont icon-shuju1"></i>
                        {{ item.name }}
                    </el-menu-item>
                    <el-submenu :index="index+1+''"  :key="index" v-else>
                        <template slot="title">
                            <kr-icon :icon="item.icon" style="margin-right: 5px"></kr-icon>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item
                            v-for="(it,ind) in item.children"
                            :key="ind"
                            :index="it.path"
                            @click="menuClick(it.path)"
                        >
                            {{ it.name }}
                        </el-menu-item>
                    </el-submenu>
                </template>
            </el-menu>
            <div class="collapse" @click="isCollapse = !isCollapse">
                <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
                ></i>
            </div>
        </el-scrollbar>

        <el-container class="container-box">
            <el-header class="header" style="height: 55px;line-height: 55px">{{
                $route.meta.title
            }}</el-header>
            <el-main class="main">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import SidebarItem from "./SidebarItem.vue";
import { asyncRouterMap } from "@/router/index.js";

export default {
    data() {
        return {
            menuShow: false,
            isCollapse: false,
            levelList: null,
            routers: asyncRouterMap,
            menus: []
        };
    },
    components: {
        SidebarItem
    },
    computed: {
        onRoutes() {
            return this.$route.path;
        }
    },
    mounted() {},
    methods: {
        getMenus(router = [], path = "") {
            var menus = [];
            router.map(value => {
                let p = path ? path + "/" + value.path : value.path;
                menus.push({
                    name: value.meta.title,
                    path: p,
                    icon: value.icon,
                    children:
                        value.children && value.children.length
                            ? this.getMenus(value.children, p)
                            : []
                });
            });
            return menus;
        },
        menuClick(path) {
            this.$router.push({
                path:path,
                query:this.$route.query,
                params:this.$route.params,
            });
        }
    },
    created() {
        this.menus = this.getMenus(asyncRouterMap);
    },
    watch: {}
};
</script>

<style type="text/scss" lang="scss">
@import "../../styles/mixin";
@import "@/styles/basic-color.scss";
.collapse {
    text-align: center;
    cursor: pointer;
    font-size: 20px;
    line-height: 50px;
    background-color: $menu-title-hover;
    position: absolute;
    width: 100%;
    bottom: 0px;
    color: #BFCBD9;
    &:hover{
        color: #fff;
    }
}
.el-header {
    /*background-color: #eef1f6;*/
    color: #333;
    padding: 0 10px;
}

.el-aside {
    color: #333;
}

.el-main {
    position: relative;
    background-color: $content-background-color;
}
.main-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200%;
    z-index: 100;
    background-color: #000;
    opacity: 0.3;
}

.move-enter-active,
.move-leave-active {
    transition: opacity 0.5s;
}

.move-enter,
.move-leave {
    opacity: 0;
}

.wrapper {
    height: 100%;
    overflow-y: hidden;
    background-color: #f5f7f9;
}

.container-box {
    height: 100%;
    transition: -webkit-transform 0.3s ease-in-out;
    transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
    overflow-y: auto;
}

.container-left {
    background-color: rgb(48, 65, 86);
    transition: left 0.23s ease-in-out;
    height: 100%;
    flex: 0 0 auto;
}
.container-left-wrap {
    overflow-x: hidden !important;
}

.container-left .svg-icon {
    font-size: 20px;
    margin-right: 5px;
}

.container-left:not(.slide-hide) {
    width: 200px;
}

.container-left.slide-hide {
    .logo img {
        display: none;
    }
    .logo span {
        display: inline-block;
    }
}

.menu {
    width: 100% !important;
}

/*.menu::-webkit-scrollbar{*/
/*display: none;*/
/*}*/

.header {
    position: relative;
    text-align: left;
    font-size: 18px;
    line-height: $header-height;
    border-bottom: 1px solid #d8dce5;
    background-color: #fff;
    color: #0c1231;
    font-weight: 500;
}

.logo {
    display: block;
    width: 100%;
    line-height: 80px;
    text-align: center;
    color: #fff;
    transition: display 0.7s ease-in-out;
    img {
        vertical-align: middle;
    }
    span {
        display: none;
    }
}

.header-left {
    display: inline-block;
    height: $header-height;
    overflow: hidden;
}

.header-tabs-box {
    display: inline-block;
    height: $header-height;
    max-width: 60%;
    overflow: hidden;
}

.header-right {
    display: flex;
    width: 80px;
    height: 100%;
    margin-left: 10px;
    float: right;
    .el-dropdown {
        display: flex;
        cursor: pointer;
    }
    span {
        display: inline-block;
        @include text-overflow;
    }
    i {
        line-height: $header-height;
        margin-top: 2px;
    }
}

.app-levelbar {
    margin-left: 20px;
    line-height: 57px !important;
}

/*宽屏时出现*/
.slide-toggle {
    display: inline-block;
    height: $header-height;
    line-height: $header-height;
    text-align: center;
    cursor: pointer;
}

.slide-toggle span {
    display: inline-block;
    width: 2px;
    height: 12px;
    background-color: rgba(135, 141, 153, 0.8);
    margin-left: 5px;
}
.slide-toggle-open span {
    display: block;
    margin-left: 4px;
    margin-top: 4px;
    width: 16px;
    height: 2px;
}
.slide-toggle-open {
    padding-top: 17px;
}

@media screen and (min-width: 768px) {
    .main-mask {
        display: none;
    }
}

/*.slide-hide {*/
/*width: 64px !important;*/
/*}*/

@media screen and (max-width: 768px) {
    .main {
        overflow-y: scroll !important;
        -webkit-overflow-scrolling: touch;
    }

    .slide-hide.slide-in-left {
        -webkit-transform: translate3d(64px, 0, 0) !important;
        transform: translate3d(64px, 0, 0) !important;
    }
    .container-left.slide-hide.slide-in-left {
        left: -64px;
        width: 64px;
    }
    .container-left.slide-in-left {
        left: 0;
    }
    .container-left {
        margin-right: 0;
        opacity: 1;
        position: absolute !important;
        top: 0;
        left: -225px;
        z-index: 10;
        padding: 0;
    }

    .container-box.slide-in-left {
        min-width: 0;
        opacity: 1;
        -webkit-transform: translate3d(187px, 0, 0);
        transform: translate3d(187px, 0, 0);
        overflow: initial;
    }
    .header-toggle {
        display: block;
        /*background-color: #26a2ff;*/
        border-radius: 4px;
        /*border: 1px solid #fff;*/
        height: 40px;
        margin: 10px 0;
        padding: 2px 6px;
        outline: none;
        width: 40px;
        z-index: 10;
    }

    .header-toggle span {
        display: block;
        width: 100%;
        height: 4px;
        margin: 5px auto;
        background-color: rgba(135, 141, 153, 0.8);
    }

    .logo {
        display: none;
    }
    .slide-toggle {
        display: none;
    }
}
</style>
