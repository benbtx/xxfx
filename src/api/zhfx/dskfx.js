/**
 * Created by sl on 2020/7/16.
 */
import axios from "../../utils/axios";



//spatiotemporalAnalysis/getLxBySj 分类-根据时间属性
export function getLxBySj(query) {
    return axios({
        url: "/spatiotemporalAnalysis/getLxBySj",
        method: "get",
        params: query
    });
}

//spatiotemporalAnalysis/getLxByKj 分类-根据空间属性
export function getLxByKj(query) {
    return axios({
        url: "/spatiotemporalAnalysis/getLxByKj",
        method: "get",
        params: query
    });
}

//spatiotemporalAnalysis/menuOptions 菜单选项 重要时间选择
export function getZysj(query) {
    return axios({
        url: "/spatiotemporalAnalysis/menuOptions",
        method: "get",
        params: query
    });
}

//spatiotemporalAnalysis/getTackTypes 获取轨迹类型
export function getTackTypes(query) {
    return axios({
        url: "/spatiotemporalAnalysis/getTackTypes",
        method: "get",
        params: query
    });
}

///spatiotemporalAnalysis/generateInterval 时间段生成时间区间  根据时间查询年月（年月包含有数据才返回）
export function getNyInfo(data) {
    return axios({
        url: "/spatiotemporalAnalysis/generateInterval",
        method: "post",
        data: data
    });
}


///spatiotemporalAnalysis/timeLineSearch 时间轴信息查询 根据年月查数据
export function getInfobyny(data) {
    return axios({
        url: "/spatiotemporalAnalysis/timeLineSearch",
        method: "post",
        data: data
    });
}



////spatiotemporalAnalysis/getTrackTimeLine 获取轨迹时间轴 地图根据年月查数据
export function getTrackTimeLine(data) {
    return axios({
        url: "/spatiotemporalAnalysis/getTrackTimeLine",
        method: "post",
        data: data
    });
}


///spatiotemporalAnalysis/getTrack 获取轨迹
export function getTrack(data) {
    return axios({
        url: "/spatiotemporalAnalysis/getTrack",
        method: "post",
        data: data
    });
}

////saxx/getSAObjectByDABH 通过档案编号查询涉案对象
export function getSAObjectByDABH(query) {
    return axios({
        url: "/saxx/getSAObjectByDABH",
        method: "post",
        params: query
    });
}











// 谁最懂我相关

// 列表
export function adList(query) {
    return axios({
        url: "/admin/ad/ad/index",
        method: "get",
        params: query
    });
}

// 保存
export function adSave(data, formName, method = "post") {
    var url = formName === "add" ? "/admin/ad/ad/save" : "/admin/ad/ad/edit";
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除
export function adDelete(data) {
    return axios({
        url: "/admin/ad/ad/delete",
        method: "post",
        data: data
    });
}