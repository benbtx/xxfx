import Home from "@/views/home/index.vue";
export const components = [
    {
        path: "/components",
        redirect: "/components/uploadList",
        component: Home,
        name: "components",
        icon: "tongyong",
        meta: {
            title: "components"
        },
        children: (one => [
            {
                path: "uploadList",
                name: `${one}uploadList`,
                component: () =>
                    import(
                        /* webpackChunkName: "componentsRouterView" */ "@/views/components/uploadList.vue"
                    ),
                meta: {
                    title: "上传图片的展示"
                }
            },
            {
                path: "tinymce",
                name: `${one}tinymce`,
                component: () =>
                    import(
                        /* webpackChunkName: "componentsRouterView" */ "@/views/components/tinymce-demo.vue"
                    ),
                meta: {
                    title: "tinymce富文本编辑器"
                }
            },
            {
                path: "upload",
                name: `${one}upload`,
                component: () =>
                    import(
                        /* webpackChunkName: "componentsRouterView" */ "@/views/components/upload-demo.vue"
                    ),
                meta: {
                    title: "上传的demo"
                }
            }
        ])("components_")
    }
];
export default components;
