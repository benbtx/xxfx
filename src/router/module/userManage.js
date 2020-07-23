import Home from "@/views/home/index.vue";
export const userManage = [
    {
        path: "/userManage",
        redirect: "/userManage/adminManage/index",
        component: Home,
        icon: "guanliyuan1",
        name: "userManage",
        meta: {
            title: "用户管理",
            authRule: ["user_manage"]
        },
        // noDropdown: true,
        children: (one => [
            {
                path: "/userManage/adminManage",
                component: () =>
                    import(
                        /* webpackChunkName: "userManage" */ "@/views/userManage/admin/router.vue"
                    ),
                redirect: "/userManage/authAdmin/index",
                name: `${one}adminManage`,
                icon: "",
                meta: {
                    title: "管理组",
                    authRule: ["user_manage/admin_manage"]
                },
                children: (two => [
                    {
                        path: "authAdmin",
                        component: () =>
                            import(
                                /* webpackChunkName: "userManage" */ "@/views/userManage/admin/authAdmin.vue"
                            ),
                        name: `${two}authAdmin`,
                        icon: "",
                        meta: {
                            title: "管理员管理",
                            authRule: ["admin/auth/admin/index"]
                        }
                    },
                    {
                        path: "authRole",
                        component: () =>
                            import(
                                /* webpackChunkName: "userManage" */ "@/views/userManage/admin/authRole.vue"
                            ),
                        name: `${two}authRole`,
                        icon: "",
                        meta: {
                            title: "角色管理",
                            authRule: ["admin/auth/role/index"]
                        }
                    },
                    {
                        path: "authPermissionRule",
                        component: () =>
                            import(
                                /* webpackChunkName: "userManage" */ "@/views/userManage/admin/authPermissionRule.vue"
                            ),
                        name: `${two}authPermissionRule`,
                        icon: "",
                        meta: {
                            title: "权限管理",
                            authRule: ["admin/auth/permission_rule/index"]
                        }
                    }
                ])(`${one}adminManage_`)
            }
        ])("userManage_")
    }
];
export default userManage;
