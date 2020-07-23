<template>
    <div v-if="!item.hidden && item.children">
        <el-menu-item
            v-if="!item.hidden && item.noDropdown && !item.children[0].children"
            class="submenu-title-noDropdown"
            @click="menuClick(item)"
            :index="item.path + '/' + item.children[0].path"
        >
            <icon-svg v-if="item.icon" :icon-class="item.icon"></icon-svg>
            <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>

        <el-submenu
            class="nest-menu"
            :index="item.path"
            v-else-if="!item.noDropdown && !item.hidden"
        >
            <template slot="title">
                <icon-svg v-if="item.icon" :icon-class="item.icon"></icon-svg>
                <span v-if="item.meta.title" slot="title">{{
                    item.meta.title
                }}</span>
            </template>
            <template v-for="child in item.children">
                <template v-if="!child.hidden">
                    <sidebar-item
                        :key="child.path"
                        v-if="child.children && child.children.length > 0"
                        :item="child"
                    >
                    </sidebar-item>

                    <el-menu-item
                        :key="child.path"
                        v-else
                        :index="item.path + '/' + child.path"
                        @click="menuClick(item, child)"
                    >
                        <icon-svg
                            v-if="child.icon"
                            :icon-class="child.icon"
                        ></icon-svg>
                        <span slot="title">{{ child.meta.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-submenu>
    </div>
</template>

<script>
export default {
    name: "SidebarItem",
    props: {
        item: {}
    },
    methods: {
        menuClick(submenu, menu) {
            let path = "";
            if (menu) {
                let { path: parentPath } = submenu;
                let { path: childPath } = menu;

                path = parentPath + "/" + childPath;
            } else {
                path = submenu.path;
            }
            if (this.$route.path !== path) {
                this.$router.push(path);
            }
        },
        // 查找子节点是否有可显示的节点
        hasFilterChildrenHidden(children) {
            const showingChildren = children.filter(item => {
                return !item.hidden;
            });
            return showingChildren.length === 1;
        }
    }
};
</script>
