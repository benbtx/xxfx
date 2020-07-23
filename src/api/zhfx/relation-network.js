import axios from "../../utils/axios";
// 保存分析结果
export function saveAnalysis(params, method = "post") {
    return axios({
        url: "/analysis/relative/save",
        method: method,
        params
    });
}

// 涉案信息查询相关接口
export function getSAObjectByDABH(params, method = "post") {
    return axios({
        url: "/saxx/getSAObjectByDABH",
        method,
        params
    });
}

// 查看历史分析记录
export function queryHistory(method = "post") {
    return axios({
        url: "/analysis/relative/query?caseId=01",
        method
    });
}

// 关系网分析
export function network(data, method = "post") {
    return axios({
        url: "/analysis/relative/network",
        method: method,
        data: data
    });
}

// 同事维度查询
export function colleague(data, method = "post") {
    return axios({
        url: "/analysis/detail/colleague",
        method: method,
        data: data
    });
}

// 同住维度查询
export function live(data, method = "post") {
    return axios({
        url: "/analysis/detail/live",
        method: method,
        data: data
    });
}

// 火车维度查询
export function train(data, method = "post") {
    return axios({
        url: "/analysis/detail/train",
        method: method,
        data: data
    });
}

// 交易维度查询
export function transfer(data, method = "post") {
    return axios({
        url: "/analysis/detail/transfer",
        method: method,
        data: data
    });
}

// 投资维度查询
export function invest(data, method = "post") {
    return axios({
        url: "/analysis/detail/invest",
        method: method,
        data: data
    });
}

// 飞机维度查询
export function fly(data, method = "post") {
    return axios({
        url: "/analysis/detail/fly",
        method: method,
        data: data
    });
}

// 同户维度查询
export function family(data, method = "post") {
    return axios({
        url: "/analysis/detail/family",
        method: method,
        data: data
    });
}

// 大巴维度查询
export function bus(data, method = "post") {
    return axios({
        url: "/analysis/detail/bus",
        method: method,
        data: data
    });
}
