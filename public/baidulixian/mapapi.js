var bmap_config = {
    //地图瓦片路径
    tiles_path: str,
    // "http://static.freenat.club:6545/tiles",
    //"/baidulixian/tiles", http://freenat.club:6545/,
    // tiles_path: "http://192.168.13.86:10123/tiles",
    //http://static.freenat.club:6545/tiles/roadmap/8/42/12.png 大家点下看这个能够访问吗
    home: "./baidulixian/"
};

(function() {
    window.BMap_loadScriptTime = new Date().getTime();
    document.write(
        '<script type="text/javascript" src="' +
        bmap_config.home +
        'modules/main.min.js"></script>'
    );
})();