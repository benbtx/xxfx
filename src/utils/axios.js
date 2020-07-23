import axios from "axios";
import {
    Message
} from "element-ui";

// 创建axios实例
const service = axios.create({
    baseURL: "/ias", // api的base_url
    timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        return config;
    },
    error => {
        // Do something with request error
        Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    response => {
        const data = response.data;
        //请求不成功
        if (data.code != 0) {
            Message({
                message: data.msg,
                type: "error"
            });
        }
        return data;
    },
    error => {
        Message({
            message: error.message,
            type: "error",
            duration: 1000
        });
        return Promise.reject(error);
    }
);

export default service;
