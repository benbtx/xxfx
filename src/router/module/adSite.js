import Home from "@/views/home/index.vue";
export const adSite = [
    {
        path: "/adManage",
        redirect: "/adManage/adSite",
        component: Home,
        icon: "guanggao",
        name: "广告相关",
        meta: {
            title: "广告相关"
            // authRule: ["ad_manage"]
        },
        // noDropdown: true,
        children: (one => [
            {
                path: "adSite",
                component: () =>
                    import(
                        /* webpackChunkName: "adSite" */ "@/views/adManage/adSite.vue"
                    ),
                name: `${one}adSite`,
                icon: "",
                meta: {
                    title: "广告位管理"
                    // authRule: ["admin/ad/site/index"]
                }
            },
            {
                path: "ad",
                component: () =>
                    import(
                        /* webpackChunkName: "adSite" */ "@/views/adManage/ad.vue"
                    ),
                name: `${one}ad`,
                icon: "",
                meta: {
                    title: "广告管理"
                    // authRule: ["admin/ad/ad/index"]
                }
            }
        ])("userManage_")
    }
];
export default adSite;
