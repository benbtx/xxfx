import axios from "../../utils/axios";

//获取六度关系分析
export const getAnalysisData = args =>
    axios({
        method: "post",
        url: "/sixRelation/query",
        data: args
    });

//获取保存历史
export const getAnalysisList = args =>
    axios({
        method: "post",
        url: "/analysis/relative/query",
        params: args
    });

//保存记录
export const saveAnalysisList = args =>
    axios({
        method: "post",
        url: "/analysis/relative/save",
        data: args
    });

//删除保存记录
export const delAnalysis = args =>
    axios({
        method: "post",
        url: "/analysis/relative/delete",
        params: args
    });
//编辑保存历史
export const getAnalysisCondition = args =>
    axios({
        method: "post",
        url: "/analysis/relative/query",
        params: args
    });
