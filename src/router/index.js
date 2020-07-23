import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import { ROUTER_MODE } from "../config/app";

import zhfx from "./module/zhfx";

const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");

export const constantRouterMap = [
    {
        path: "*",
        redirect: "/zhfx",
        component: err404,
        hidden: true
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        hidden: true,
        meta: {
            title: "401"
        }
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        hidden: true,
        meta: {
            title: "404 Not Found"
        }
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        hidden: true,
        meta: {
            title: "500"
        }
    },
    ...zhfx
];

export default new VueRouter({
    // mode: 'history', //后端支持可开
    mode: ROUTER_MODE,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [...zhfx];
