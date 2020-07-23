import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import dayjs from "dayjs"

import "./mock"; // 模拟数据

import "element-ui/lib/theme-chalk/index.css";
import "./assets/icons/iconfont.css";

import IconSvg from "./components/common/IconSvg.vue"; // svg组件
import krGraph from "@/components/kr-graph/index.vue";
import krChoose from "@/components/kr-choose/index.vue";
import krMap from "@/components/kr-map/indexMap.vue";
import krRelationPath from "@/components/kr-relation-patn/index.vue";
import krAnalysisPage from "@/components/kr-analysis-page/index.vue";
import krAnalysisPageTable from "@/components/kr-analysis-page-table/index.vue";
import krTable from "@/components/kr-table/index.vue";
import krPagination from "@/components/kr-pagination/index.vue";
import KrSectionTitle from "@/components/kr-section-title";
import krIcon from "@/components/kr-icon";

import ImpPanel from "./components/common/panel.vue";
import {Message} from "element-ui";

// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
Vue.component(ImpPanel.name, ImpPanel);
Vue.component("krGraph", krGraph);
Vue.component("krMap", krMap);
Vue.component("krRelationPath", krRelationPath);
Vue.component("krAnalysisPage", krAnalysisPage);
Vue.component("krAnalysisPageTable", krAnalysisPageTable);
Vue.component("krTable", krTable);
Vue.component("krPagination", krPagination);
Vue.component("KrSectionTitle", KrSectionTitle);
Vue.component("KrChoose", krChoose);
Vue.component("krIcon", krIcon);

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.prototype.$dayjs = dayjs;

Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
