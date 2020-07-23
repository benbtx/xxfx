export const LOGIN_TIME_OUT = 2 * 60 * 60 * 1000;
// 系统颜色
export const primary = "#108EE9";
export const success = "#00CC99";
export const warning = "#FF9933";
export const info = "#909399";
export const danger = "#ff3333";
export const purple = "#cc66ff";
export const green = "#00cc00";

// 类型颜色
export const register = "#09BB07"; //同户
export const colleague = "#B620E0"; //同事
export const capital = "#F7B500"; //交易
export const investment = "#E08300"; //投资
export const travel = "#1490FF"; //出行
export const call = "#22B0B5"; //通话
export const accommodation = "#F76260"; //住宿

//关系类型颜色
export const relationTypeColor = [{
        type: "同户",
        color: register
    },
    {
        type: "同事",
        color: colleague
    },
    {
        type: "交易",
        color: capital
    },
    {
        type: "银行卡转账",
        color: capital
    },
    {
        type: "投资",
        color: investment
    },
    {
        type: "飞机",
        color: travel
    },
    {
        type: "大巴",
        color: travel
    },
    {
        type: "火车",
        color: travel
    },
    {
        type: "同行-飞机",
        color: travel
    },
    {
        type: "同行-大巴",
        color: travel
    },
    {
        type: "同行-火车",
        color: travel
    },
    {
        type: "通话",
        color: call
    },
    {
        type: "通联",
        color: call
    },
    {
        type: "同住",
        color: accommodation
    }
];

// 多时空页面人员配色
export const DSK_COLOR = ["#1490FF", "#02ACC1", "#F37C0C", "#43A046", "#3A49AC", "#8E24AB", "#E53934", "#757575", "#6D4C40", "#273237", "#4FC3F6", "#F06291", "#FBC02F", "#617D8B", "#CE93D9"];

// 三等级颜色
export const LEVEL_COLOR = ["#ff3333", "#FF6600", "#FFCC00"];
// 标签颜色
export const SYSTEM_TAGS_COLOR = [{
        name: "涉毒",
        color: warning
    },
    {
        name: "贩毒",
        color: danger
    },
    {
        name: "隐毒",
        color: purple
    },
    {
        name: "多次犯罪",
        color: danger
    },
    {
        name: "暴力",
        color: warning
    },
    {
        name: "盗窃",
        color: purple
    }
];

//默认百度地图中心点经纬度
export const BAIDU_MAP_CENTER = "绵阳市";
// 地图默认放大等级
export const BAIDU_MAP_ZOOM = 6;
// 地图默认中心点坐标
export const BAUDU_MAP_POINT = {
    // lng: 108.93,
    // lat: 34.27104.574581, lat: 33.714072
    // lng: 110.166119,
    // lat: 28.151061
    lng: 101.166119,
    lat: 30.151061
};
//大屏中心点
export const BAIDU_MAP_SCREEN = {
    lng: 101.236209,
    lat: 36.157217
};
// 地图控制范围
export const BAIDU_MAP_ZOOM_LEVEL = {
    min: 6,
    max: 16
};
//百度地图app_key
export const BAIDU_MAP_KEY = "VL2hf4H5okqColtzaGOXO2K8";

// 默认请求列表条数
export const PAGE_SIZE = 10;

export const ICON_CLASS = [
    "icon-ditu",
    "icon-dianhua",
    "icon-weibiaoti1",
    "icon-jietu",
    "icon-shouyetianchong",
    "icon-qingdan",
    "icon-zhandou",
    "icon-iconxieti",
    "icon-dingwei",
    "icon-jiudian",
    "icon-weizhi",
    "icon-qiehuanzhanshi",
    "icon-lianxiren",
    "icon-iconset0211",
    "icon-xiugai",
    "icon-right",
    "icon-tuichuquanping",
    "icon-xiazai43",
    "icon-qian",
    "icon-yinxingqia1",
    "icon-zidong",
    "icon-dianhua1",
    "icon-ai-connection",
    "icon-dianhua11",
    "icon-yujing1",
    "icon-jiacu",
    "icon-tuiguangzhuanqian",
    "icon-lujingfenxi",
    "icon-shenqingpingji",
    "icon-shichangfenxi",
    "icon-jingcha",
    "icon-export",
    "icon-sousuo",
    "icon-shangsheng",
    "icon-xiajiang",
    "icon-wo",
    "icon-print",
    "icon-tishi",
    "icon-bianji",
    "icon-huifu",
    "icon-tubiao",
    "icon-yinxingqia",
    "icon-zhongguoyidong",
    "icon-angle-double-right",
    "icon-xiangshang",
    "icon-bank",
    "icon-information",
    "icon-informatiom",
    "icon-jingcha1",
    "icon-dangan2",
    "icon-xingxing",
    "icon-mimaffffffpx",
    "icon-dianhua2",
    "icon-shuju",
    "icon-quyu",
    "icon-document_fill",
    "icon-liulanqi-IE",
    "icon-shichang",
    "icon-xing",
    "icon-set",
    "icon-dianxin",
    "icon-zitiyanse",
    "icon-nongyeyinhang",
    "icon-ft-airplane",
    "icon-tower",
    "icon-shiyongzhinan",
    "icon-jizhan",
    "icon-guanxitu",
    "icon-rank",
    "icon-xiaoxi",
    "icon-nan",
    "icon-guiji",
    "icon-zhaoshangyinhang",
    "icon-liantong",
    "icon-icon-",
    "icon-icon--",
    "icon-che",
    "icon-yule",
    "icon-CCB",
    "icon-biao",
    "icon-gongshangyinhang",
    "icon-yujing",
    "icon-zijin",
    "icon-hezuohuobanmiyueguanli",
    "icon-jinggao",
    "icon-shiyongwendang",
    "icon-shujukanban",
    "icon-zhanghaoquanxianguanli",
    "icon-zhunbeiliangchan",
    "icon-dangan",
    "icon-jizhanguanli",
    "icon-jingcha2",
    "icon--huxiangguanzhu",
    "icon-shijianjibiezhongdingyiguize",
    "icon-shuaxin",
    "icon-zidingyi",
    "icon-xianxing",
    "icon-mn_paiming_fill",
    "icon-fenjifenlei",
    "icon-shehuiguanxi",
    "icon-shilianrenyuan",
    "icon-renyuanjujiyujing",
    "icon-renyuanchaochubianjie",
    "icon-renyuanyidongyujing",
    "icon-duoweidu",
    "icon-icon_zhanghao",
    "icon-gongyezujian-zhishideng",
    "icon-tubiao-zhuzhuangtu",
    "icon-tuxing",
    "icon-yunweidaping",
    "icon-logo",
    "icon-guize",
    "icon-shebeiguanli",
    "icon-yunyingzhongxin",
    "icon-yunyingguanli",
    "icon-riliriqi",
    "icon-jietu1",
    "icon-shangwang_",
    "icon-xiahuaxian",
    "icon-transaction",
    "icon-quanping",
    "icon-yanse1",
    "icon-qia",
    "icon-wenjianjia",
    "icon-jiancezhanshi",
    "icon-duoweisouche",
    "icon-tonghua",
    "icon-tuxing1",
    "icon-guanxi",
    "icon-anjiandangan",
    "icon-dangan1",
    "icon-liebiao",
    "icon-weixianqu",
    "icon-dingweiweizhi",
    "icon-jiaoyin",
    "icon-xiazai",
    "icon-dingwei1",
    "icon-gaojing",
    "icon-xiaoxitongzhi",
    "icon-guangbo",
    "icon-gongdan",
    "icon-chaxun",
    "icon-guizeyinqing",
    "icon-huowudui",
    "icon-lianjieliu",
    "icon-chucun",
    "icon-qiche",
    "icon-shenjing",
    "icon-chengshi",
    "icon-night",
    "icon-manyouroam",
    "icon-zhifeiji",
    "icon-shoucang",
    "icon-quanpingzuidahua"
];

// 成功code
export const SUCCESS_CODE = 0;