<template>
    <div id="full">
        <div class="toolbar box-shadow">
            <template v-for="item in toolbarList">
                <el-tooltip
                    v-if="item.type == 'radio'"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                        :class="{ 'is-active': item.isCheck }"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
                <el-tooltip
                    v-if="item.type == 'button'"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </template>
            <div class="toolbar-right">
                <div class="block">
                    <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        align="right"
                        unlink-panels
                        size="small"
                        style="width: 230px"
                        range-separator="~"
                        start-placeholder="开始日期"
                        value-format="yyyyMMdd"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @focus="tooltipFullscreen('el-picker-panel')"
                        @change="dateChange"
                    >
                    </el-date-picker>
                </div>
                <div class="block">
                    <el-button
                        size="small"
                        @click="analysisHistory"
                        style="margin-right: 10px"
                        >分析记录</el-button
                    >
                    <el-button type="primary" size="small" @click="saveAnalysis"
                        >保存分析</el-button
                    >
                </div>
            </div>
        </div>
        <div class="toolbarBottom box-shadow">
            <div v-for="(item, index) in toolbarBottomList" :key="index">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="toolbarBottomTooltip(item.name)"
                    :hide-after="0"
                    popper-class="toolbarBottomTooltip"
                    placement="right"
                    :key="item.name"
                    v-if="item.is"
                >
                    <div
                        style="margin: 20px 12px;font-size: 16px;cursor: pointer"
                        @click="toolbarBottomClick(item.name)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div class="search  box-shadow">
            <el-autocomplete
                popper-class="my-autocomplete"
                v-model="keyWords"
                :fetch-suggestions="querySearch"
                placeholder="请输入"
                style="width: 150px"
                clearable
                @focus="tooltipFullscreen('el-autocomplete-suggestion')"
                @select="handleSelect"
            >
                <i class="el-icon-search el-input__icon" slot="suffix"> </i>
                <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                </template>
            </el-autocomplete>
        </div>
        <div class="select  box-shadow" v-if="selectOptions.options.length">
            <el-select
                v-model="selectList"
                clearable
                style="width: 130px"
                :placeholder="selectOptions.title"
                @focus="tooltipFullscreen('el-select-dropdown')"
                @change="selectConfirm"
            >
                <el-option
                    v-for="item in selectOptions.options"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                ></el-option>
            </el-select>
        </div>
        <div class="tooltip">
            <ul>
                <li v-for="(item, index) in imgs" :key="index">
                    <div style="float: left">
                        <img :src="item.img" alt="" width="25" />
                        <div style="float: right;margin-left: 5px">
                            {{ item.type }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="info  box-shadow">
            <slot name="info"></slot>
        </div>
        <div class="graphBox" id="main"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
import { cloneDeep } from "loadsh";
import { relationTypeColor } from "@/config/index.js";
import dqfxry from "@/assets/image/dqfxry.png";
import dqfxdw from "@/assets/image/dqfxdw.png";
import bary from "@/assets/image/bary.png";
import fbary from "@/assets/image/fbary.png";
import badw from "@/assets/image/badw.png";
import fbadw from "@/assets/image/fbadw.png";
export default {
    props: {
        selectOptions: {
            type: Object,
            default: () => {
                return {
                    options: [],
                    title: ""
                };
            }
        },
        graph: {
            type: Object,
            default() {
                return {
                    nodes: [],
                    links: []
                };
            }
        },
        model: {
            type: String,
            default: "graph"
        },
        date: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            toolbarList: [
                {
                    name: "筛选",
                    icon: "icon-shaixuan",
                    isCheck: false,
                    type: "button"
                },
                {
                    name: "添加节点",
                    icon: "el-icon-plus",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "添加关系",
                    icon: "icon--kehuguanxiguanli",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "删除节点",
                    icon: "icon-jianqie1",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "回到中心",
                    icon: "icon-shouye",
                    isCheck: false,
                    type: "button"
                },
                {
                    name: "刷新",
                    icon: "icon-shuaxin1",
                    isCheck: false,
                    type: "button"
                }
            ],
            toolbarBottomList: [
                { name: "全屏", icon: "icon-quanpingzuidahua", is: true },
                { name: "退出全屏", icon: "icon-tuichuquanping", is: false },
                { name: "上一步", icon: "icon-shangyibu", is: true },
                { name: "下一步", icon: "icon-xiayibu", is: true },
                { name: "放大", icon: "icon-fangda", is: true },
                { name: "缩小", icon: "icon-suoxiao", is: true }
            ],

            //节点、连线相关数据
            nodesMap: {},
            linksMap: {},
            nodesData: [],
            linksData: [], //处理过的线
            linesData: [], //未处理的线
            menus: [
                { event: "扩展", proportion: 1 },
                { event: "删除", proportion: 1 }
            ],
            menusClickNode: "",

            selectList: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            dateValue: "",
            keyWords: "",
            restaurants: [],
            timer: "",
            isCtrl: false,
            isSpace: false,
            dragNode: "", //正在拖动的点
            dragNodeX: "", //拖动点X偏移
            dragNodeY: "", //拖动点Y偏移,
            moveNodes: [],
            dragStartPos: {},
            dragEndPos: {},
            isAddNode: false,
            isAddLine: false,
            isDeleteNodes: false, //自定删除
            addId: 1,
            addD3Event: "", //添加时的点击事件,
            addLineNodes: [],
            stepList: [],
            stepIndex: "end",
            zoomTransform: "",

            //svg 样式相关数据
            offsetX: 100,
            width: "",
            height: "",
            nodeConf: {
                fillColor: "#1490FF",
                borderColor: "#1490FF",
                strokeColor: "none",
                strokeWidth: 1,
                textFillColor: "#0C1231",
                textFontSzie: 12,
                radius: 23,
                clickFillColor: "#1490FF"
            },
            lineConf: {
                strokeColor: "#7a7b85",
                lineTextFontSize: 12,
                strokeWidth: 1
            },
            menusConf: {
                innerRadius: 20,
                outerRadius: 50,
                fillColor: "rgba(20,144,255,0.7)",
                hoverFillColor: "rgba(20,144,255,1)",
                textFill: "#fff"
            },
            labelConf: {
                height: 25,
                fontSize: 12
            },
            imgs: {
                "001": {
                    img: dqfxry,
                    type: "当前分析对象"
                },
                "011": {
                    img: dqfxdw,
                    type: "当前分析单位"
                },
                "002": {
                    img: bary,
                    type: "本案人员"
                },
                "012": {
                    img: badw,
                    type: "本案单位"
                },
                "003": {
                    img: fbary,
                    type: "非本案人员"
                },
                "013": {
                    img: fbadw,
                    type: "非本案单位"
                }
            },

            //图形配置项
            scaleExtent: [0.2, 3], //缩放范围
            clickDistance: 3, //拖动距离小于这个值的视为点击事件
            isFixed: true,
            dragMoveTtoggleNode: true, //是否开启按住空格拖动时移动相关一级节点,
            isMaker: false, //是否显示箭头
            bezierDistance: 50 //二阶贝塞尔曲线顶点间隔
        };
    },
    mounted() {
        document.getElementById("main").oncontextmenu = function() {
            return false;
        };
        document.addEventListener("fullscreenchange", () => {
            var isFull = document.webkitIsFullScreen;
            this.toolbarBottomList.map(value => {
                if (value.name == "全屏") {
                    value.is = !isFull;
                }
                if (value.name == "退出全屏") {
                    value.is = isFull;
                }
            });
        });
        this.width = document.getElementById("main").offsetWidth;
        this.height = document.getElementById("main").offsetHeight;

        if (this.dragMoveTtoggleNode) {
            //开启事件监听
            this.createEventListener();
        }
    },
    methods: {
        analysisHistory() {
            this.$emit("analysisHistory");
        },
        saveAnalysis() {
            this.$emit("saveAnalysis");
        },
        selectConfirm() {
            this.$emit("selectChange", this.selectList);
        },
        dateChange() {
            this.$emit("dateChange", this.dateValue);
        },
        querySearch(queryString, cb) {
            this.restaurants = [];
            this.graph.nodes.map(value => {
                this.restaurants.push({
                    value: value.nodeName,
                    id: value.id
                });
            });
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelect(item) {
            this.nodeToggleClick(item);
        },
        handleIconClick(ev) {
            console.log(ev);
        },
        createFilter(queryString) {
            return restaurant => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },

        //创建图形
        createSvg() {
            // 缩放器
            this.zoom = d3
                .zoom()
                .scaleExtent(this.scaleExtent)
                .on("start", this.zoomStart)
                .on("zoom", this.zoomFn)
                .on("end", this.zoomEnd);

            this.drag = d3
                .drag()
                .clickDistance(this.clickDistance)
                .on("start", this.dragstartFn)
                .on("drag", this.dragFn)
                .on("end", this.dragendFn);

            // SVG
            this.svg = d3
                .select("#main")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .append("g")
                .call(this.zoom)
                .on("dblclick.zoom", null);

            // 缩放层
            this.zoomOverlay = this.svg
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("class", "background")
                .style("fill", "none")
                .style("cursor", "move")
                .style("pointer-events", "all")
                .on("click", () => {
                    this.clearStatus();
                    if (this.isAddNode) {
                        let transfrom = d3.zoomTransform(this.svg.node());
                        let offsetX = d3.event.offsetX,
                            offsetY = d3.event.offsetY;
                        let x = (offsetX - transfrom.x) / transfrom.k,
                            y = (offsetY - transfrom.y) / transfrom.k;
                        let addNode = {
                            id: "add" + this.addId,
                            name: "添加" + this.addId,
                            fx: x,
                            fy: y,
                            x,
                            y,
                            nodeType: "00",
                            objectType: "3",
                            nodeName: "555"
                        };
                        this.addNodeLine([addNode], []);
                        this.addId += 1;
                    }
                })
                .on("mousedown", () => {
                    // if (d3.event.button == 0){
                    //     this.isZoomMove=false
                    // }
                });

            //监听添加关系事件
            this.svg.on("mousemove", () => {
                if (this.isAddLine && this.addLineNodes.length == 1) {
                    var transform = d3.zoomTransform(this.svg.node());

                    d3.select("#main")
                        .select(".container")
                        .insert("path", "#linkGroup")
                        .attr("class", "movePath");

                    var m =
                        "M" +
                        this.addLineNodes[0].x +
                        "," +
                        this.addLineNodes[0].y +
                        " L" +
                        (d3.event.offsetX / transform.k -
                            transform.x / transform.k) +
                        "," +
                        (d3.event.offsetY / transform.k -
                            transform.y / transform.k);
                    d3.select(".movePath")
                        .style("stroke", () => this.lineConf.strokeColor)
                        .attr("stroke-dasharray", "2 2")
                        .attr("d", m);
                }
            });

            this.container = this.svg.append("g").attr("class", "container");

            //监听框选事件
            this.selectEvent();

            //连线组
            this.linkLineGroup = this.container
                .append("g")
                .attr("id", "linkGroup");

            // 连线文字组
            this.lineTextGroup = this.container.append("g");

            //节点组
            this.nodeCircleGroup = this.container.append("g");

            //初始化节点和边的数据
            this.initNodeAndLine(cloneDeep(this.graph), [
                this.width / 2,
                this.height / 2
            ]);
        },

        //初始化数据
        initNodeAndLine(graphData, center) {
            const shelf = this;

            let { nodes, links } = graphData;

            this.linesData = [...links];

            this.linksMap = this.getLinksMap(links);

            // 生成 nodes map
            this.nodesMap = this.getNodesMap(nodes);

            //节点数据
            this.nodesData = nodes;

            //连线数据
            this.linksData = this.getLinksData(links);

            if (this.model == "pathRelation") {
                for (let n = 0; n < 10; n++) {
                    let x =
                        this.offsetX +
                        ((this.width - 2 * this.offsetX) / 8) * (n + 1);
                    nodes.push({
                        x,
                        y: this.height / 2,
                        fx: x,
                        fy: this.height / 2,
                        id: "test" + n,
                        isRemove: true
                    });
                }
                this.nodesData.map(value => {
                    if (value.isSource) {
                        value.x = this.offsetX;
                        value.y = this.height / 2;
                        value.fx = value.x;
                        value.fy = value.y;
                    }
                    if (value.isTarget) {
                        value.x = this.width - this.offsetX;
                        value.y = this.height / 2;
                        value.fx = value.x;
                        value.fy = value.y;
                    }
                });
            }

            this.force = d3
                .forceSimulation(this.nodesData)
                .force("charge", d3.forceManyBody().strength(-500))
                .force(
                    "link",
                    d3
                        .forceLink(this.linksData)
                        .id(d => d.id)
                        .distance(180)
                )
                .alphaTarget(1);

            if (this.model == "pathRelation") {
                this.force.force("charge", d3.forceCollide(120));
            }
            if (this.model == "graph") {
                this.force.force(
                    "center",
                    center ? d3.forceCenter(center[0], center[1]) : () => {}
                );
            }

            // 布局计算 手动控制计算次数
            for (let i = 0, n = 1000; i < n; ++i) {
                this.force.tick();
            }
            // 停止力布局
            this.force.stop();

            // 固定所有节点
            for (let n = 0; n < this.nodesData.length; n++) {
                if (this.nodesData[n].isRemove) {
                    this.nodesData.splice(n--, 1);
                } else {
                    this.nodesData[n].fx = this.nodesData[n].x;
                    this.nodesData[n].fy = this.nodesData[n].y;
                }
            }

            //创建节点和边
            this.createNodeAndLine();

            // 监听力学图运动事件，更新坐标
            this.force.on("tick", this.tick);
        },

        //创建节点和边
        createNodeAndLine() {
            const shelf = this;
            // 节点g
            var enterNode = this.nodeCircleGroup
                .selectAll(".node")
                .data(this.nodesData)
                .enter()
                .append("g")
                .style("cursor", "pointer")
                .attr("class", "node")
                .attr("id", node => "node-" + node.id)
                .call(this.drag); // 节点可拖动

            //添加circle
            enterNode
                .append("circle")
                .style("fill", this.nodeConf.fillColor)
                .style("stroke", this.nodeConf.strokeColor)
                .style("stroke-width", 5)
                .attr("class", "node-circle")
                .attr("id", node => "node-circle-" + node.id)
                .attr("r", node => this.getRadius(node))
                .style("fill", d => {
                    //创建圆形图片
                    var defs = this.svg
                        .append("defs")
                        .attr("id", "imgdefs" + d.id);

                    var catpattern = defs
                        .append("pattern")
                        .attr("id", "catpattern" + d.id)
                        .attr("height", 1)
                        .attr("width", 1);

                    catpattern
                        .append("image")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", this.getRadius(d) * 2)
                        .attr("height", this.getRadius(d) * 2)
                        .attr("xlink:href", this.getImg(d));

                    return "url(#catpattern" + d.id + ")";
                });
            // 鼠标交互
            enterNode
                .on("mouseenter", currNode => {
                    //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
                    this.timer = setTimeout(() => {
                        this.toggleNode(this.nodeCircle, currNode, true);
                        this.toggleLine(this.linkLine, currNode, true);
                        this.toggleLineText(this.lineText, currNode, true);
                    }, 100);
                })
                .on("mouseleave", currNode => {
                    this.deleteMenu();
                    //清除定时器
                    this.isClick = false;
                    window.clearTimeout(this.timer);
                    this.toggleNode(this.nodeCircle, currNode, false);
                    this.toggleLine(this.linkLine, currNode, false);
                    this.toggleLineText(this.lineText, currNode, false);
                })
                .on("mousedown", function(currNode) {
                    if (shelf.menus.length && d3.event.button == 2) {
                        shelf.menusClickNode = currNode;
                        if (this.model != "pathRelation") {
                            shelf.createMenu(this);
                        }
                    }
                })
                .on("click", currNode => {
                    this.nodeToggleClick(currNode);
                    if (this.isAddLine) {
                        if (this.addLineNodes.length > 1) {
                            this.addLineNodes.splice(0, 1);
                        }
                        this.addLineNodes.push(currNode);
                        if (this.addLineNodes.length == 2) {
                            var line = {
                                source: this.addLineNodes[0].id,
                                target: this.addLineNodes[1].id,
                                label: "新加关系",
                                id: "ll" + this.addId
                            };
                            if (
                                this.linksMap[line.source + "-" + line.target]
                            ) {
                                this.$message.warning("已存在关系");
                            } else {
                                this.addNodeLine([], [line]);
                                this.addId += 1;
                            }
                            this.addLineNodes = [];
                            d3.select(".movePath").remove();
                            this.clearStatus();
                        }
                        return;
                    }
                    this.$emit("nodeClick", currNode);
                });

            // 节点文字
            enterNode
                .append("text")
                .attr("class", "nodetext")
                .attr("id", node => "node-text-" + node.id)
                .style("font-size", this.nodeConf.textFontSzie)
                .style("font-weight", 400)
                .style("fill", () => this.nodeConf.textFillColor)
                .attr("text-anchor", "middle")
                .attr("dy", node => this.getRadius(node) + 10)
                .text(d => d.nodeName);
            if (this.isMaker) {
                this.container
                    .append("marker")
                    .attr("id", "resolved")
                    .attr("markerUnits", "strokeWidth")
                    .style("fill", this.lineConf.strokeColor)
                    .attr("markerWidth", "6")
                    .attr("markerHeight", "6")
                    .attr("viewBox", "0 0 12 12")
                    .attr("refX", this.nodeConf.radius + 10)
                    .attr("refY", "6")
                    .attr("orient", "auto")
                    .append("path")
                    .style("stroke", this.lineConf.strokeColor)
                    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
            }
            var enterLine = this.linkLineGroup
                .selectAll(".link")
                .data(this.linksData)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", link => this.getLinkPath(link))
                .attr("id", link => "link-" + link.id)
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("cursor", "pointer")
                .style("fill", "none")
                .attr("marker-end", "url(#resolved)");

            //线事件
            enterLine
                .on("click", currNode => {
                    this.lineClick(currNode);
                })
                .on("mouseenter", currNode => {
                    //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
                    this.timer = setTimeout(() => {
                        this.linkToggleNode(currNode, true);
                        this.linkToggleLine(currNode, true);
                        this.linkToggleLineText(currNode, true);
                    }, 100);
                })
                .on("mouseleave", currNode => {
                    if (this.isClick) {
                        return;
                    }
                    //清除定时器
                    window.clearTimeout(this.timer);
                    this.toggleNode(this.nodeCircle, currNode, false);
                    this.toggleLine(this.linkLine, currNode, false);
                    this.toggleLineText(this.lineText, currNode, false);
                });

            // 连线的文字
            var enterLineText = this.lineTextGroup
                .selectAll(".linetext")
                .data(this.linksData)
                .enter()
                .append("g")
                .attr("class", "linetext")
                .style("cursor", "pointer");

            enterLineText
                .append("rect")
                .attr("class", "linerect")
                .attr("height", this.labelConf.height)
                .attr("width", line =>
                    this.getLabelWidth(this.getLabeltext(line))
                )
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("fill", "#fff")
                .style("stroke", "#c9c9c9")
                .style("stroke-width", 1);
            enterLineText
                .append("text")
                .style("font-size", this.labelConf.fontSize)
                .attr("fill", line => this.getLabelColor(line))
                .attr("dy", 17)
                .attr("dx", 3)
                .text(link => this.getLabeltext(link));

            if (this.model == "pathRelation") {
                enterLineText.each(function(line) {
                    if (line.relation && line.relation.length > 1) {
                        d3.select(this)
                            .append("circle")
                            .style("fill", "#CACBDC")
                            .attr("r", 8)
                            .attr("cy", 4)
                            .attr(
                                "cx",
                                shelf.getLabelWidth(shelf.getLabeltext(line)) +
                                    3
                            );
                        d3.select(this)
                            .append("text")
                            .style("font-size", 16)
                            .style("font-weight", 500)
                            .attr("dy", 10)
                            .attr(
                                "dx",
                                shelf.getLabelWidth(shelf.getLabeltext(line)) -
                                    2
                            )
                            .text("+");
                    }
                });
            }

            enterLineText
                .on("click", function(currNode) {
                    shelf.lineTextClick(currNode, this);
                })
                .on("mouseenter", currNode => {
                    //设置定时器0.1秒之后触发（避免鼠标快速滑过造成的页面闪烁）
                    this.timer = setTimeout(() => {
                        this.linkToggleNode(currNode, true);
                        this.linkToggleLine(currNode, true);
                        this.linkToggleLineText(currNode, true);
                    }, 100);
                })
                .on("mouseleave", currNode => {
                    if (this.isClick) {
                        return;
                    }
                    //清除定时器
                    window.clearTimeout(this.timer);
                    this.toggleNode(this.nodeCircle, currNode, false);
                    this.toggleLine(this.linkLine, currNode, false);
                    this.toggleLineText(this.lineText, currNode, false);
                });

            this.bindNodeLine();
            this.tick();
        },

        //绑定数据
        bindNodeLine() {
            this.nodeCircle = this.nodeCircleGroup
                .selectAll(".node")
                .data(this.nodesData);
            this.linkLine = this.linkLineGroup
                .selectAll(".link")
                .data(this.linksData);
            this.lineText = this.lineTextGroup
                .selectAll(".linetext")
                .data(this.linksData);
        },

        zoomStart() {
            this.zoomTransform = cloneDeep(d3.event.transform);
        },
        //缩放和平移
        zoomFn() {
            const { transform } = d3.event;
            this.container.attr("transform", transform);
        },

        zoomEnd() {
            let transform = cloneDeep(d3.event.transform);
            this.addStep({
                type: "zoom",
                transformStart: this.zoomTransform,
                transformEnd: transform
            });
        },

        // 更新位置
        tick() {
            const shelf = this;
            this.nodeCircle.attr(
                "transform",
                node => "translate(" + node.x + "," + node.y + ")"
            );
            // 连线路径
            this.linkLine.attr("d", link => this.getLinkPath(link));
            // 连线文字位置
            this.lineText.attr("transform", function(link) {
                return shelf.getLineText(link);
            });
        },

        // 拖动时更新坐标位置，只更新拖拽相关节点
        dragMove(moveNode) {
            const shelf = this;
            this.nodeCircle
                .filter(node => this.isdragMoveNode(moveNode, node))
                .attr(
                    "transform",
                    node => "translate(" + node.x + "," + node.y + ")"
                );
            // 连线路径
            this.linkLine
                .filter(link => this.isdragMoveLine(moveNode, link))
                .attr("d", link => this.getLinkPath(link));
            // 连线文字位置
            this.lineText
                .filter(link => this.isdragMoveLine(moveNode, link))
                .attr("transform", function(link) {
                    return shelf.getLineText(link);
                });
        },

        //判断是否是拖拽需要移动的节点
        isdragMoveNode(moveNode, node) {
            if (this.dragMoveTtoggleNode == false || this.isSpace == false) {
                return moveNode.id == node.id ? true : false;
            } else {
                if (moveNode.id == node.id) {
                    return true;
                } else {
                    let is =
                        (this.linksMap[moveNode.id + "-" + node.id] ||
                            this.linksMap[node.id + "-" + moveNode.id]) &&
                        node.weight == 1;
                    if (is) {
                        node.x += this.dragNodeX;
                        node.y += this.dragNodeY;
                        node.fx = node.x;
                        node.fy = node.y;
                    }
                    return is;
                }
            }
        },

        //获取移动节点
        getMoveNodes(moveNode) {
            var nodes = [];
            this.nodesData.map(node => {
                if (
                    this.dragMoveTtoggleNode == false ||
                    this.isSpace == false
                ) {
                    if (moveNode.id == node.id) {
                        nodes.push(node);
                    }
                } else {
                    if (moveNode.id == node.id) {
                        nodes.push(node);
                    } else {
                        let is =
                            (this.linksMap[moveNode.id + "-" + node.id] ||
                                this.linksMap[node.id + "-" + moveNode.id]) &&
                            node.weight == 1;
                        if (is) {
                            node.x += this.dragNodeX;
                            node.y += this.dragNodeY;
                            node.fx = node.x;
                            node.fy = node.y;
                            nodes.push(node);
                        }
                    }
                }
            });
            return nodes;
        },

        //判断是否是拖拽需要移动的边
        isdragMoveLine(moveNode, link) {
            return link.source.id == moveNode.id ||
                link.target.id == moveNode.id
                ? true
                : false;
        },

        //开始移动
        dragstartFn(d) {
            this.dragNode = d;
            this.dragNodeX = 0;
            this.dragNodeY = 0;
            this.moveNodes = [];
            this.dragStartPos.x = d.x;
            this.dragStartPos.y = d.y;
        },

        //拖动中
        dragFn(d) {
            this.dragNodeX = d3.event.x - d.x;
            this.dragNodeY = d3.event.y - d.y;
            d.x = d3.event.x;
            d.y = d3.event.y;
            this.dragMove(d);
        },

        //拖动结束
        dragendFn(d) {
            let x, y;
            d.fx = d.x;
            d.fy = d.y;
            this.dragEndPos.x = d.x;
            this.dragEndPos.y = d.y;
            this.dragNode = "";
            x = this.dragEndPos.x - this.dragStartPos.x;
            y = this.dragEndPos.y - this.dragStartPos.y;
            if (
                Math.abs(x) > this.clickDistance ||
                Math.abs(y) > this.clickDistance
            ) {
                this.addStep({
                    type: "drag",
                    nodes: this.getMoveNodes(d),
                    startPos: this.dragStartPos,
                    endPos: this.dragEndPos
                });
            }
        },

        //生成节点map
        getNodesMap(nodes) {
            const hash = {};
            nodes.map(value => {
                value.weight = 0;
                this.linesData.map(line => {
                    if (line.source == value.id || line.target == value.id) {
                        value.weight += 1;
                    }
                });
                hash[value.id] = value;
            });

            return hash;
        },

        //生成节点map
        getLinksMap(links) {
            const hash = {};
            links.map(value => {
                const key = value.source + "-" + value.target;
                hash[key] = value;
            });
            return hash;
        },

        //生产连线数据
        getLinksData(links) {
            let data = [];
            links.map(value => {
                let item = { ...value };
                if (item.id == undefined) {
                    item.id = "line" + this.addId;
                    this.addId += 1;
                }
                item.source = this.nodesMap[item.source];
                item.target = this.nodesMap[item.target];
                data.push(item);
            });
            return data;
        },

        // 生成关系连线路径
        getLinkPath(link) {
            let sx = link.source.x;
            let tx = link.target.x;
            let sy = link.source.y;
            let ty = link.target.y;
            if (link.bezier != undefined) {
                var q = this.getBezier(link);
                return (
                    "M" +
                    sx +
                    " " +
                    sy +
                    " Q" +
                    q[0] +
                    " " +
                    q[1] +
                    "," +
                    tx +
                    " " +
                    ty
                );
            } else {
                return "M" + sx + "," + sy + " L" + tx + "," + ty;
            }
        },

        getLineTextDx(d) {
            const sr = this.nodeConf.radius;
            const sx = d.source.x;
            const sy = d.source.y;
            const tx = d.target.x;
            const ty = d.target.y;

            const distance = Math.sqrt(
                Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2)
            );

            // const textLength = d.label.length;
            const textLength = d.label.toString().length;
            const deviation = 8; // 调整误差
            const dx =
                (distance - sr - textLength * this.lineConf.lineTextFontSize) /
                    2 +
                deviation;

            return dx;
        },

        getLineText(line) {
            var x =
                (line.source.x + line.target.x) / 2 -
                this.getLabelWidth(this.getLabeltext(line)) / 2;
            var y =
                (line.source.y + line.target.y) / 2 - this.labelConf.height / 2;
            if (line.bezier != undefined) {
                let x0 = line.source.x,
                    y0 = line.source.y,
                    x2 = line.target.x,
                    y2 = line.target.y,
                    t = 0.5,
                    cx,
                    cy,
                    q = this.getBezier(line);
                cx =
                    Math.pow(1 - t, 2) * x0 +
                    2 * t * (1 - t) * q[0] +
                    Math.pow(t, 2) * x2 -
                    this.getLabelWidth(this.getLabeltext(line)) / 2;
                cy =
                    Math.pow(1 - t, 2) * y0 +
                    2 * t * (1 - t) * q[1] +
                    Math.pow(t, 2) * y2 -
                    this.labelConf.height / 2;
                return "translate(" + cx + "," + cy + ")";
            } else {
                return "translate(" + x + "," + y + ")";
            }
        },

        getLabelWidth(label) {
            var regPos = new RegExp("^[0-9]*$");
            const textLength = label.toString().length;
            label = label + "";
            let l = 0;
            for (let n = 0; n < textLength; n++) {
                if (regPos.test(label[n])) {
                    l = l + 7;
                } else {
                    l += this.labelConf.fontSize;
                }
            }
            return l + 6;
        },

        getLabeltext(link) {
            let count = 0;
            if (link.intimacy != undefined) {
                return link.intimacy;
            }
            if (link.relation) {
                link.relation.map(value => {
                    count += value.count;
                });
                if (link.relation.length > 1) {
                    return "关联" + count;
                }
                if (link.relation.length == 1) {
                    return link.relation[0].relationType + count;
                }
            }
            return "新增关系";
        },

        getLabelColor(line) {
            let color = "";
            if (line.intimacy != undefined) {
                let s = parseInt(line.intimacy);
                if (s < 61) {
                    color = "#1490FF";
                }
                if (s > 60 && s < 81) {
                    color = "#22B0B5";
                }
                if (s > 80) {
                    color = "#E02020";
                }
                return color;
            }
            if (line.relation) {
                let type =
                    line.relation && line.relation > 1
                        ? ""
                        : line.relation[0].relationType;
                if (!type) {
                    return color;
                }
                relationTypeColor.map(value => {
                    if (type == value.type) {
                        color = value.color;
                    }
                });
            }

            return color;
        },

        //计算线文字的角度
        getLineTextAngle(d, bbox) {
            var x =
                    (d.target.x + d.source.x) / 2 -
                    this.getLabelWidth(this.getLabeltext(d)) / 2,
                y =
                    (d.target.y + d.source.y) / 2 -
                    this.labelConf.height / 2 -
                    2;
            return "translate(" + x + "," + y + ")";

            // if (d.target.x < d.source.x) {
            //     const { x, y, width, height } = bbox;
            //     const rx = x + width / 2;
            //     const ry = y + height / 2;
            //     return "rotate(180 " + rx + " " + ry + ")";
            // } else {
            //     return "rotate(0)";
            // }
        },

        //节点hover时改变节点的opacity
        toggleNode(nodeCircle, currNode, isHover) {
            if (isHover) {
                // nodeCircle.sort((a, b) => (a.id === currNode.id ? 1 : -1));
                // this.nodesData.sort((a, b) => (a.id === currNode.id ? 1 : -1));
                nodeCircle
                    .style("opacity", 0.1)
                    .filter(node => this.isLinkNode(currNode, node))
                    .style("opacity", 1);
            } else {
                nodeCircle.style("opacity", 1);
            }
        },

        //节点hover时改变线的opacity
        toggleLine(linkLine, currNode, isHover) {
            if (isHover) {
                // 加重连线样式
                linkLine
                    .style("opacity", 0.1)
                    .filter(link => this.isLinkLine(currNode, link))
                    .style("opacity", 1)
                    .classed("link-active", true);
            } else {
                // 连线恢复样式
                linkLine.style("opacity", 1).classed("link-active", false);
            }
        },

        //节点hover时改变线文字的opacity
        toggleLineText(lineText, currNode, isHover) {
            if (isHover) {
                // 只显示相连连线文字
                lineText.style("opacity", link =>
                    this.isLinkLine(currNode, link) ? 1.0 : 0.0
                );
            } else {
                // 显示所有连线文字
                lineText.style("opacity", "1.0");
            }
        },

        //线hover时改变线的opacity
        linkToggleLine(currNode, isHover) {
            if (isHover) {
                // 加重连线样式
                this.linkLine
                    .style("opacity", 0.1)
                    .filter(link => {
                        if (
                            link.source.id == currNode.source.id &&
                            link.target.id == currNode.target.id
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .style("opacity", 1)
                    .classed("link-active", true);
            } else {
                // 连线恢复样式
                this.linkLine.style("opacity", 1).classed("link-active", false);
            }
        },

        //线hover时改变节点的opacity
        linkToggleNode(currNode, isHover) {
            if (isHover) {
                this.nodeCircle
                    .style("opacity", 0.1)
                    .filter(
                        node =>
                            node.id == currNode.target.id ||
                            node.id == currNode.source.id
                    )
                    .style("opacity", 1);
            } else {
                this.nodeCircle.style("opacity", 1);
            }
        },

        //线hover时改变线文字的opacity
        linkToggleLineText(currNode, isHover) {
            if (isHover) {
                // 只显示相连连线文字
                this.lineText.style("opacity", link =>
                    link.source.id == currNode.source.id &&
                    link.target.id == currNode.target.id
                        ? 1.0
                        : 0.0
                );
            } else {
                // 显示所有连线文字
                this.lineText.style("opacity", "1.0");
            }
        },

        //节点选中时的状态
        nodeToggleClick(currNode) {
            const shelf = this;
            this.nodeCircle.each(function(node) {
                if (node.id == currNode.id) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 5);
                } else {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", "none")
                        .style("stroke-width", 0);
                }
            });
        },

        //判断是否是连线节点
        isLinkNode(currNode, node) {
            var is = false;
            if (currNode.id === node.id) {
                return true;
            }
            this.linksData.map(value => {
                if (
                    value.source.id == node.id &&
                    value.target.id == currNode.id
                ) {
                    is = true;
                }
                if (
                    value.target.id == node.id &&
                    value.source.id == currNode.id
                ) {
                    is = true;
                }
            });
            return is;
        },

        isLinkLine(node, link) {
            return link.source.id == node.id || link.target.id == node.id;
        },

        //边点击事件
        lineClick(line) {
            this.$emit("lineClick", line);
        },

        //线文字点击
        lineTextClick(line) {
            if (
                this.model == "pathRelation" &&
                line.relation &&
                line.relation.length > 1
            ) {
                this.linkLine.each(function(l) {
                    if (l.id == line.id) {
                        d3.select(this).remove();
                    }
                });
                this.lineText.each(function(l) {
                    if (l.id == line.id) {
                        d3.select(this).remove();
                    }
                });
                this.linksData.splice(
                    this.linksData.findIndex(l => l.id == line.id),
                    1
                );
                this.arcPath(line);
            } else {
                this.$emit("lineClick", line);
            }
            this.clearStatus();
        },

        arcPath(d) {
            let x0 = d.source.x,
                y0 = d.source.y,
                x2 = d.target.x,
                y2 = d.target.y,
                x,
                y,
                bezier,
                g = 0,
                k = (y2 - y0) / (x2 - x0),
                k1 = k ? -1 / k : 0,
                b = (y2 + y0) / 2 - k1 * (x0 / 2 + x2 / 2);
            g = d.relation.length % 2 == 0 ? 1 : 0;
            d.relation.map((value, index) => {
                if (index % 2 == 0) {
                    y =
                        y0 / 2 +
                        y2 / 2 -
                        Math.round((index + g) / 2) * this.bezierDistance;
                    x = k1 ? (y - b) / k1 : x0 / 2 + x2 / 2;
                    bezier = -Math.round((index + g) / 2) * this.bezierDistance;
                } else {
                    y =
                        y0 / 2 +
                        y2 / 2 +
                        Math.round((index + g) / 2) * this.bezierDistance;
                    x = k1 ? (y - b) / k1 : x0 / 2 + x2 / 2;
                    bezier = Math.round((index + g) / 2) * this.bezierDistance;
                }

                d.id = "line" + this.addId;
                this.linksData.push({
                    ...d,
                    px: x,
                    py: y,
                    bezier,
                    relation: [value]
                });
                this.addId += 1;
            });

            this.createNodeAndLine();
        },

        getBezier(d) {
            let x0 = d.source.x,
                y0 = d.source.y,
                x2 = d.target.x,
                y2 = d.target.y,
                x,
                y,
                k = (y2 - y0) / (x2 - x0),
                k1 = k ? -1 / k : 0,
                b = (y2 + y0) / 2 - k1 * (x0 / 2 + x2 / 2);

            if (Math.abs(x0 - x2) > Math.abs(y0 - y2)) {
                y = y0 / 2 + y2 / 2 + d.bezier;
                x = k1 ? (y - b) / k1 : x0 / 2 + x2 / 2;
            } else {
                x = x0 / 2 + x2 / 2 + d.bezier;
                y = k1 ? k1 * x + b : y0 / 2 + y2 / 2;
            }
            return [x, y];
        },

        //创建鼠标右键菜单
        createMenu(th) {
            const shelf = this;
            var menu = d3
                .select(th)
                .append("g")
                .attr("id", "graphNodeMenu");
            var arc_generator = d3
                .arc()
                .innerRadius(this.menusConf.innerRadius)
                .outerRadius(this.menusConf.outerRadius);

            var angle_data = d3.pie().value(d => {
                return d.proportion;
            });

            var pieg = menu
                .selectAll("g")
                .data(angle_data(this.menus))
                .enter()
                .append("g")
                .attr("class", "pie")
                .style("fill", this.menusConf.fillColor)
                .on("click", d => {
                    this.menuClick(d.data.event);
                    this.deleteMenu();
                    this.toggleNode(this.nodeCircle, {}, false);
                    this.toggleLine(this.linkLine, {}, false);
                    this.toggleLineText(this.lineText, {}, false);
                    d3.event.stopPropagation();
                })
                .on("mouseover", function() {
                    d3.select(this).style(
                        "fill",
                        shelf.menusConf.hoverFillColor
                    );
                })
                .on("mouseleave", function() {
                    d3.select(this).style("fill", shelf.menusConf.fillColor);
                });

            //pie
            pieg.append("path")
                .attr("d", arc_generator)
                .style("stroke", "rgba(255,255,255)")
                .style("stroke-width", 4)
                .on("click", d => {
                    this.menuClick(d.data.event);
                    this.deleteMenu();
                    this.toggleNode(this.nodeCircle, {}, false);
                    this.toggleLine(this.linkLine, {}, false);
                    this.toggleLineText(this.lineText, {}, false);
                    d3.event.stopPropagation();
                });

            //text
            pieg.append("text")
                .text(d => {
                    return d.data.event;
                })
                .attr("transform", d => {
                    var deg =
                        (((d.startAngle + d.endAngle) / Math.PI) * 180) / 2;
                    return (
                        "translate(" +
                        arc_generator.centroid(d) +
                        ") rotate(" +
                        deg +
                        ")"
                    );
                })
                .attr("text-anchor", "middle")
                .attr("dy", "5")
                .style("fill", this.menusConf.textFill)
                .attr("class", "pieText");
        },

        //节点菜单点击
        menuClick(type) {
            switch (type) {
                case "扩展":
                    // this.addData(this.menusClickNode);
                    break;
                case "删除":
                    this.deleteNodes([this.menusClickNode]);
                    break;
            }
        },

        //删除邮件菜单
        deleteMenu() {
            d3.selectAll("#graphNodeMenu").remove();
        },

        //删除节点
        deleteNodes(nodes, isStep) {
            const shelf = this;
            let deleteNodes = [],
                deleteLines = [];

            //删除图形相关元素
            nodes.forEach(node => {
                this.nodeCircle.filter(function(d) {
                    if (d.id == node.id) {
                        d3.select(this).remove();
                    }
                });
                this.linkLine.filter(function(line) {
                    if (
                        line.source.id == node.id ||
                        line.target.id == node.id
                    ) {
                        d3.select(this).remove();
                    }
                });
                this.lineText.filter(function(line) {
                    if (
                        line.source.id == node.id ||
                        line.target.id == node.id
                    ) {
                        d3.select(this).remove();
                    }
                });
            });

            //删除数据
            for (let n = 0; n < shelf.nodesData.length; n++) {
                let index = nodes.findIndex(d => d.id == shelf.nodesData[n].id);
                if (index != -1) {
                    deleteNodes.push(shelf.nodesData[n]);
                    shelf.nodesData.splice(n--, 1);
                }
            }
            for (let n = 0; n < shelf.linksData.length; n++) {
                let index = nodes.findIndex(
                    d =>
                        shelf.linksData[n].source.id == d.id ||
                        shelf.linksData[n].target.id == d.id
                );
                if (index != -1) {
                    shelf.linksData.splice(n--, 1);
                }
            }
            for (let n = 0; n < shelf.linesData.length; n++) {
                let index = nodes.findIndex(
                    d =>
                        shelf.linesData[n].source == d.id ||
                        shelf.linesData[n].target == d.id
                );
                if (index != -1) {
                    deleteLines.push(shelf.linesData[n]);
                    shelf.linesData.splice(n--, 1);
                }
            }

            if (!isStep) {
                this.addStep({
                    type: "delete",
                    nodes: deleteNodes,
                    links: deleteLines
                });
            }

            this.bindNodeLine();
        },

        //添加节点
        addData(node) {
            let nodes = [],
                links = [];
            for (let n = 0; n < 100; n++) {
                nodes.push({ id: node.id + n, name: "张" + node.id + n });
                links.push({
                    source: node.id,
                    target: node.id + n,
                    label: "关系1",
                    id: node.id + n
                });
            }
            this.addNodeLine(nodes, links);
        },

        //添加节点和线
        addNodeLine(nodes, lines, isStep) {
            let addNodes = [],
                addLinks = [];
            nodes.map(value => {
                let index = this.nodesData.findIndex(n => n.id == value.id);
                if (index == -1) {
                    this.nodesData.push(value);
                    addNodes.push(value);
                }
            });
            lines.map(value => {
                let index = this.linesData.findIndex(
                    l =>
                        (l.source == value.source &&
                            l.target == value.target) ||
                        (l.target == value.source && l.source == value.target)
                );
                if (index == -1) {
                    this.linesData.push(value);
                    addLinks.push(value);
                }
            });
            this.initNodeAndLine({
                nodes: this.nodesData,
                links: this.linesData
            });
            if (!isStep) {
                this.addStep({
                    type: "add",
                    nodes: addNodes,
                    links: addLinks
                });
            }
        },

        //创建事件监听
        createEventListener() {
            const shelf = this;
            document.addEventListener("keydown", shelf.keydownEvent);
            document.addEventListener("keyup", shelf.keyupEvent);
        },

        //监听键盘keydown事件
        keydownEvent(event) {
            const shelf = this;
            var e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                shelf.isSpace = true;
                event.preventDefault();
                return false;
            }
            if (e && e.keyCode == 17) {
                shelf.isCtrl = true;
                event.preventDefault();
                return false;
            }
            if (e && e.keyCode == 90) {
                if (shelf.isCtrl) {
                    shelf.previousStep();
                }
            }
            if (e && e.keyCode == 89) {
                if (shelf.isCtrl) {
                    shelf.nextStep();
                }
            }
        },

        //监听键盘keydup事件
        keyupEvent(event) {
            const shelf = this;
            var e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                shelf.isSpace = false;
            }
            if (e && e.keyCode == 17) {
                shelf.isCtrl = true;
            }
        },

        //头部工具栏操作
        toolbarClick(item) {
            if (item.type == "radio") {
                this.toolbarList.map(value => {
                    if (value.name != item.name && value.type == "radio") {
                        value.isCheck = false;
                    }
                    if (value.name == item.name) {
                        value.isCheck = !value.isCheck;
                    }
                });
            }
            this.isAddNode = false;
            this.isAddLine = false;
            this.isDeleteNodes = false;
            this.addLineNodes = [];
            this.clearStatus();
            switch (item.name) {
                case "添加节点":
                    this.isAddNode = item.isCheck;
                    break;
                case "添加关系":
                    this.isAddLine = item.isCheck;
                    break;
                case "删除节点":
                    this.isDeleteNodes = item.isCheck;
                    break;
                case "回到中心":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        zoomStart = cloneDeep(zoom);
                    zoom.k = 1;
                    zoom.x = 0;
                    zoom.y = 0;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "刷新":
                    this.emptyData();
                    this.createSvg();
                    break;
                case "筛选":
                    this.$emit("filterClick");
                    break;
            }
            this.zoomOverlay.style(
                "cursor",
                this.isDeleteNodes ? "crosshair" : "move"
            );
            this.stopZoom();
        },

        //左下角工具栏操作
        toolbarBottomClick(type) {
            switch (type) {
                case "全屏":
                    var fullDiv = document.getElementById("full");
                    this.fullscreen(fullDiv);
                    break;
                case "退出全屏":
                    this.fullscreen();
                    break;
                case "放大":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        x = zoom.x,
                        y = zoom.y,
                        zoomStart = cloneDeep(zoom);
                    zoom.k =
                        zoom.k + 0.4 < this.scaleExtent[1]
                            ? zoom.k + 0.4
                            : this.scaleExtent[1];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "缩小":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        x = zoom.x,
                        y = zoom.y,
                        zoomStart = cloneDeep(zoom);
                    zoom.k =
                        zoom.k - 0.2 > this.scaleExtent[0]
                            ? zoom.k - 0.2
                            : this.scaleExtent[0];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "上一步":
                    this.previousStep();
                    break;
                case "下一步":
                    this.nextStep();
                    break;
            }
        },

        //清楚状态
        clearStatus() {
            this.nodeCircle
                .select("circle")
                .style("stroke", "none")
                .style("stroke-width", 0);
            this.nodeCircle.style("opacity", 1);
            this.linkLine.style("opacity", 1);
            this.lineText.style("opacity", 1);
        },

        //全屏
        fullscreen(div) {
            if (!div) {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // 进入全屏
                if (div.requestFullscreen) {
                    div.requestFullscreen();
                } else if (div.webkitRequestFullScreen) {
                    div.webkitRequestFullScreen();
                } else if (div.mozRequestFullScreen) {
                    div.mozRequestFullScreen();
                } else if (div.msRequestFullscreen) {
                    div.msRequestFullscreen();
                }
            }
        },

        tooltipFullscreen(name) {
            var isFull = document.webkitIsFullScreen;
            if (isFull) {
                setTimeout(() => {
                    var htmls = document.getElementsByClassName(name);
                    for (let n = 0; n < htmls.length; n++) {
                        document.getElementById("main").appendChild(htmls[n]);
                    }
                }, 100);
            } else {
                d3.select("#main")
                    .selectAll("." + name)
                    .remove();
            }
        },

        //监听框选事件
        selectEvent() {
            let start = [0, 0],
                end = [0, 0],
                isdown = false,
                isMove = false;
            d3.select("#main")
                .select("svg")
                .on("mousedown", () => {
                    if (d3.event.button == 0 && this.isDeleteNodes) {
                        start = [d3.event.offsetX, d3.event.offsetY];
                        isdown = true;
                        d3.select(".selectBox").remove();
                        d3.select("#main svg")
                            .append("rect")
                            .attr("width", 0)
                            .attr("height", 0)
                            .attr("class", "selectBox")
                            .attr("x", start[0])
                            .attr("y", start[1])
                            .style("stroke", "red")
                            .style("stroke-width", 1)
                            .style("stroke-dasharray", "3 2")
                            .style("fill", "none");
                    }
                })
                .on("mousemove", () => {
                    if (isdown) {
                        isMove = true;
                        end = [d3.event.offsetX, d3.event.offsetY];
                        var w = end[0] - start[0],
                            h = end[1] - start[1];
                        d3.select(".selectBox")
                            .attr("width", Math.abs(w))
                            .attr("height", Math.abs(h));
                        if (w >= 0 && h < 0) {
                            d3.select(".selectBox")
                                .attr("x", start[0])
                                .attr("y", end[1]);
                        } else if (w < 0 && h >= 0) {
                            d3.select(".selectBox")
                                .attr("x", end[0])
                                .attr("y", start[1]);
                        } else if (w < 0 && h < 0) {
                            d3.select(".selectBox")
                                .attr("x", end[0])
                                .attr("y", end[1]);
                        }
                    }
                })
                .on("mouseup", () => {
                    if (d3.event.button == 0 && this.isDeleteNodes && isMove) {
                        this.findSelectNode(start, end);
                        isdown = false;
                        isMove = false;
                        start = [0, 0];
                        end = [0, 0];
                        d3.select(".selectBox").remove();
                    }
                })
                .on("mouseleave", () => {
                    if (isdown == true) {
                        isdown = false;
                        start = [0, 0];
                        end = [0, 0];
                        d3.select(".selectBox").remove();
                    }
                });
        },

        //查找选中的点
        findSelectNode(start, end) {
            let boxX,
                boxY,
                hideList = [],
                zoom = d3.zoomTransform(this.svg.node()),
                sacle = zoom.k,
                translate = [zoom.x, zoom.y];
            if (start[0] <= end[0]) {
                boxX = [start[0], end[0]];
            } else {
                boxX = [end[0], start[0]];
            }
            if (start[1] <= end[1]) {
                boxY = [start[1], end[1]];
            } else {
                boxY = [end[1], start[1]];
            }

            this.nodesData.map(node => {
                var isX = false,
                    isY = false;
                var outW = this.nodeConf.radius * sacle;
                var x = node.x * sacle + translate[0];
                var y = node.y * sacle + translate[1];
                var minx = x - outW,
                    maxx = x + outW,
                    maxy = y + outW,
                    miny = y - outW;
                if (minx > boxX[1]) {
                    isX = false;
                } else if (maxx < boxX[0]) {
                    isX = false;
                } else {
                    isX = true;
                }
                if (miny > boxY[1]) {
                    isY = false;
                } else if (maxy < boxY[0]) {
                    isY = false;
                } else {
                    isY = true;
                }
                if (isX && isY) {
                    hideList.push(node);
                    return true;
                } else {
                    return false;
                }
            });
            if (hideList.length > 0) {
                this.deleteNodes(hideList);
            }
        },

        //自定义删除时停止zoom事件
        stopZoom() {
            if (this.isDeleteNodes) {
                this.svg.on("mousedown.zoom", null);
                this.svg.on("mousemove.zoom", null);
                this.svg.on("dblclick.zoom", null);
                this.svg.on("touchstart.zoom", null);
                this.svg.on("wheel.zoom", null);
                this.svg.on("mousewheel.zoom", null);
            } else {
                this.svg.call(this.zoom);
            }
        },

        //清空数据和图形
        emptyData() {
            //节点、连线相关数据
            this.nodesMap = {};
            this.linksMap = {};
            this.nodesData = [];
            this.linksData = [];
            this.linesData = [];
            this.linesData = [];
            this.dragNodeX = "";
            this.dragNodeY = "";
            this.isAddNode = false;
            this.isAddLine = false;
            this.isDeleteNodes = false;
            this.addLineNodes = [];
            this.stepList = [];
            this.stepIndex = "end";
            d3.select("#main")
                .select("svg")
                .remove();
        },

        //添加操作步骤
        addStep(step) {
            if (this.stepIndex == "start") {
                this.stepList = [];
                this.stepIndex = "end";
            }
            if (this.stepList[this.stepIndex]) {
                this.stepList.splice(
                    this.stepIndex,
                    this.stepList.length - this.stepIndex
                );
            }
            this.stepList.push(step);
        },

        //上一步
        previousStep() {
            if (!this.stepList.length) {
                return;
            }
            this.stepIndex =
                this.stepIndex == "end"
                    ? this.stepList.length - 1
                    : this.stepIndex;
            if (this.stepIndex != "start") {
                let step = this.stepList[this.stepIndex];
                switch (step.type) {
                    case "add":
                        this.deleteNodes(step.nodes, true);
                        break;
                    case "delete":
                        this.addNodeLine(step.nodes, step.links, true);
                        break;
                    case "zoom":
                        d3.zoom().transform(this.svg, step.transformStart);
                        this.container.attr("transform", step.transformStart);
                        break;
                    case "drag":
                        step.nodes.map(value => {
                            value.x = value.x - step.endPos.x + step.startPos.x;
                            value.y = value.y - step.endPos.y + step.startPos.y;
                        });
                        this.tick();
                        break;
                }
                this.stepIndex =
                    this.stepIndex > 0 ? this.stepIndex - 1 : "start";
            }
        },

        //下一步
        nextStep() {
            if (!this.stepList.length || this.stepIndex == "end") {
                return;
            }
            let step;
            this.stepIndex = this.stepIndex == "start" ? 0 : this.stepIndex;
            step = this.stepList[this.stepIndex];
            switch (step.type) {
                case "add":
                    this.addNodeLine(step.nodes, step.links, true);
                    break;
                case "delete":
                    this.deleteNodes(step.nodes, true);
                    break;
                case "zoom":
                    d3.zoom().transform(this.svg, step.transformEnd);
                    this.container.attr("transform", step.transformEnd);
                    break;
                case "drag":
                    step.nodes.map(value => {
                        value.x = value.x + step.endPos.x - step.startPos.x;
                        value.y = value.y + step.endPos.y - step.startPos.y;
                    });
                    this.tick();
                    break;
            }
            this.stepIndex = this.stepList[this.stepIndex + 1]
                ? this.stepIndex + 1
                : "end";
        },

        toolbarBottomTooltip(name) {
            var tip = name;
            if (name == "上一步") {
                if (!this.stepList.length || this.stepIndex == "start") {
                    tip = "无上一步";
                }
            }
            if (name == "下一步") {
                if (!this.stepList.length || this.stepIndex == "end") {
                    tip = "无下一步";
                }
            }
            return tip;
        },
        getImg(node) {
            return this.imgs[node.nodeType + "" + node.objectType].img;
        },

        getRadius(node) {
            return node.objectType == 1
                ? this.nodeConf.radius + 3
                : this.nodeConf.radius;
        }
    },
    destroyed() {
        document.removeEventListener("keydown", this.keydownEvent);
        document.removeEventListener("keyup", this.keyupEvent);
    },
    watch: {
        graph() {
            this.emptyData();
            this.createSvg();
        },
        selectOptions() {
            if (this.selectOptions.value) {
                this.selectList = this.selectOptions.value;
            }
        },
        time() {
            this.dateValue = this.time;
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/basic-color.scss";
#full {
    background-color: #fff;
    background: url("../..//assets/image/wangge.jpg") repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.graphBox {
    height: 100%;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
.radioButton {
    display: inline-block;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 3px;
    font-size: 16px;
    border: 1px solid silver;
    margin-left: 20px;
    cursor: pointer;
    &:active {
        color: $color-primary;
        border: 1px solid $color-primary;
    }
}
.is-active {
    color: $color-primary;
    border: 1px solid $color-primary;
}
.toolbar {
    padding: 10px 0;
    background-color: #fff;
    .toolbar-right {
        float: right;
        .block {
            display: inline-block;
            margin-right: 20px;
        }
    }
}
.toolbarBottom {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: #fff;
}
.search {
    position: absolute;
    top: 70px;
    left: 20px;
    border-radius: 5px;
}
.select {
    position: absolute;
    top: 70px;
    left: 190px;
    border-radius: 5px;
}
.info {
    position: absolute;
    top: 70px;
    right: 20px;
    height: calc(100% - 90px);
    overflow: hidden;
}
.tooltip {
    position: absolute;
    top: 126px;
    left: 20px;
    line-height: 25px;
    font-size: 12px;
    ul {
        margin: 0;
        padding: 0;
        li {
            height: 25px;
        }
    }
}
</style>
<style></style>
