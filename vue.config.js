const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: process.env.outputDir,
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
            config.externals = {
                vue: "Vue",
                vuex: "Vuex",
                "vue-router": "VueRouter",
                "element-ui": "ELEMENT"
            };
        } else {
            // 为开发环境修改配置...
        }
    },
    lintOnSave: true,
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("api", resolve("src/api"));
        config.plugin("html").tap(args => {
            args[0].template = process.env.template;
            return args;
        });
    },
    devServer: {
        proxy: {
            "/": {
                ws: false,
                // target: "http://192.168.7.184:8081", // 测试
                // target: "http://192.168.7.102:8081", // 李鸿宇
                target: "http://192.168.7.132:8081", // 赵家兴
                // target: "http://192.168.7.250", // 服务器
                changeOrigin: false
            }
        }
    }
};
