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
                        format="yyyy-MM-dd"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        @focus="tooltipFullscreen('el-picker-panel')"
                        @change="dateChange"
                    >
                    </el-date-picker>
                </div>
                <div class="block">
                    <el-button size="small" @click="analysisHistory"
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
                        style="margin: 18px 12px;font-size: 16px;cursor: pointer"
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
                class="input-normal-width"
                v-model="keyWords"
                :fetch-suggestions="querySearch"
                placeholder="请输入"
                clearable
                style="width: 150px"
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
            <el-dropdown
                ref="dropdown"
                size="medium"
                split-button
                type="primary"
                trigger="click"
                :hide-on-click="false"
                @visible-change="tooltipFullscreen('el-dropdown-menu ')"
            >
                {{ selectOptions.title }}
                <el-dropdown-menu slot="dropdown">
                    <el-checkbox-group v-model="selectList">
                        <el-dropdown-item
                            v-for="item in selectOptions.options"
                            :key="item.value"
                        >
                            <el-checkbox :label="item.value">{{
                                item.label
                            }}</el-checkbox>
                        </el-dropdown-item>
                    </el-checkbox-group>
                    <el-dropdown-item divided style="text-align: center"
                        ><el-button type="text" @click="selectConfirm"
                            >确认</el-button
                        ></el-dropdown-item
                    >
                </el-dropdown-menu>
            </el-dropdown>
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
            // default() {
            //     return {
            //         nodes: [
            //             { id: "1", name: "张1" },
            //             { id: "2", name: "张2" },
            //             { id: "3", name: "张3" },
            //             { id: "4", name: "张4" },
            //             { id: "5", name: "张5" },
            //             { id: "6", name: "张6" }
            //         ],
            //         links: [
            //             [
            //                 {
            //                     source: "1",
            //                     target: "6",
            //                     relation: [{ count: 100, type: "通联" }]
            //                 }
            //             ],
            //             [
            //                 {
            //                     source: "1",
            //                     target: "2",
            //                     relation: [
            //                         { count: 100, type: "通联" },
            //                         { count: 100, type: "通联" },
            //                         { count: 100, type: "通联" }
            //                     ]
            //                 },
            //                 {
            //                     source: "2",
            //                     target: "3",
            //                     relation: [
            //                         { count: 100, type: "交易" },
            //                         { count: 100, type: "通联" },
            //                         { count: 100, type: "通联" }
            //                     ]
            //                 },
            //                 {
            //                     source: "3",
            //                     target: "6",
            //                     relation: [{ count: 100, type: "同户" }]
            //                 }
            //             ],
            //             [
            //                 {
            //                     source: "1",
            //                     target: "4",
            //                     relation: [{ count: 100, type: "同住" }]
            //                 },
            //                 {
            //                     source: "4",
            //                     target: "5",
            //                     relation: [{ count: 100, type: "同事" }]
            //                 },
            //                 {
            //                     source: "5",
            //                     target: "6",
            //                     relation: [{ count: 100, type: "投资" }]
            //                 }
            //             ],
            //             [
            //                 {
            //                     source: "1",
            //                     target: "4",
            //                     relation: [{ count: 100, type: "飞机" }]
            //                 },
            //                 {
            //                     source: "4",
            //                     target: "5",
            //                     relation: [{ count: 100, type: "大巴" }]
            //                 },
            //                 {
            //                     source: "5",
            //                     target: "6",
            //                     relation: [{ count: 100, type: "火车" }]
            //                 }
            //             ]
            //         ]
            //     };
            // }
        }
    },
    data() {
        return {
            //导航功能菜单
            toolbarList: [
                {
                    name: "筛选",
                    icon: "icon-shaixuan",
                    isCheck: false,
                    type: "button"
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

            offsetX: 100,
            distance: 60,
            source: {},
            target: {},

            //svg 样式相关数据
            width: "",
            height: "",
            nodeConf: {
                fillColor: "#1490FF",
                borderColor: "#1490FF",
                strokeColor: "none",
                strokeWidth: 1,
                textFillColor: "#0C1231",
                textFontSzie: 12,
                radius: 20,
                clickFillColor: "#1490FF"
            },
            lineConf: {
                strokeColor: "#E3E6F8",
                lineTextFontSize: 12,
                strokeWidth: 1
            },
            menusConf: {
                innerRadius: 20,
                outerRadius: 50,
                fillColor: "rgba(51,204,204,0.7)",
                hoverFillColor: "rgba(51,204,204,1)",
                textFill: "#fff"
            },
            labelConf: {
                height: 25,
                fontSize: 12
            },

            //图形配置项
            scaleExtent: [0.2, 3], //缩放范围
            clickDistance: 3, //拖动距离小于这个值的视为点击事件
            isFixed: true,
            dragMoveTtoggleNode: true, //是否开启按住空格拖动时移动相关一级节点,
            isMaker: true, //是否显示箭头
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
        setTimeout(()=>{
            this.emptyData();
            this.createSvg()
        },1000)
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
            this.$refs.dropdown.hide();
        },
        dateChange() {
            this.$emit("dateChange", this.dateValue);
        },
        querySearch(queryString, cb) {
            this.restaurants = [];
            this.graph.nodes.map(value => {
                this.restaurants.push({
                    value: value.name,
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
            this.searchNodeToggleClick(item.id);
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
                });

            this.container = this.svg.append("g").attr("class", "container");

            //连线组
            this.linkLineGroup = this.container
                .append("g")
                .attr("id", "linkGroup");

            // 连线文字组
            this.lineTextGroup = this.container.append("g");

            //节点组
            this.nodeCircleGroup = this.container.append("g");

            //初始化节点和边的数据
            this.initNodeAndLine(cloneDeep(this.graph));
        },

        //初始化数据
        initNodeAndLine(graphData) {
            const shelf = this;

            let { nodes, links } = graphData;


            nodes.map(value=>{

                if(value.isSource){
                    value.x=this.offsetX
                    value.y=this.height / 2
                    value.nodeId="node" + this.addId
                    this.addId += 1;
                    this.source = value;
                    this.nodesData.push(value);
                }
                if(value.isTarget){
                    value.x=this.width - this.offsetX
                    value.y=this.height / 2
                    value.nodeId="node" + this.addId
                    this.addId += 1;
                    this.target = value;
                    this.nodesData.push(value);
                }
            })

            // 生成 nodes map
            this.nodesMap = this.getNodesMap(nodes);
            let isTop = true;
            let group = 0;
            let linksList=[]
            links.map(value => {
                let distanceX = (this.width - 2 * this.offsetX) / value.length;
                value.map((line, ind) => {
                    if(line.target!=this.target.id){
                        this.nodesData.push({
                            ...this.nodesMap[line.target],
                            x:this.offsetX + (ind + 1) * distanceX,
                            nodeId : "node" + this.addId,
                            isTop,
                            group:parseInt(group / 2)
                        });
                        this.addId += 1;
                    }
                    linksList.push({
                        ...line,
                        isTop,
                        id:"line"+this.addId,
                        group:parseInt(group / 2)
                    })
                    this.addId += 1;
                });
                if (value.length != 1) {
                    group = group + 1;
                    isTop = !isTop;
                }
            });

            linksList.map(value=>{
                this.nodesData.map(node=>{
                    if(value.source==this.source.id){
                        value.source=this.source.nodeId
                    }
                    if(value.target==this.target.id){
                        value.target=this.target.nodeId
                    }
                    if(value.source==node.id&&value.group===node.group&&value.isTop===node.isTop){
                        value.source=node.nodeId
                    }
                    if(value.target==node.id&&value.group===node.group&&value.isTop===node.isTop){
                        value.target=node.nodeId
                    }
                })

            })
            let nodesMap={}
            this.nodesData.map(value=>{
                if(value.y==undefined){
                    value.y=this.computeY(value.x,value.group,value.isTop)
                }
                nodesMap[value.nodeId]=value
            })
            linksList.map(value=>{
                value.source=nodesMap[value.source]
                value.target=nodesMap[value.target]
            })
            this.linksData=linksList

            this.linksMap = this.getLinksMap(this.linksData);

            this.createNodeAndLine();
        },

        /*根据x的坐标计算Y 的坐标(椭圆计算方式)
         *@param x number x轴坐标
         *@param n number 线的组数（两条一组）
         *@param index number 线是的位置（0表示下，1表示上）
         *@return number y轴的坐标
         */
        computeY(x, n, isTop) {
            var distance = (n + 1) * this.distance;
            var a = (this.width - 2 * this.offsetX) / 2,
                moveY = this.height / 2,
                y;
            if (isTop) {
                y =
                    moveY -
                    distance *
                        Math.sqrt(
                            1 -
                                Math.pow(x - this.offsetX - a, 2) /
                                    Math.pow(a, 2)
                        );
            } else {
                y =
                    distance *
                        Math.sqrt(
                            1 -
                                Math.pow(x - this.offsetX - a, 2) /
                                    Math.pow(a, 2)
                        ) +
                    moveY;
            }
            return y;
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
                .attr("id", node => "node-" + node.nodeId);

            //添加circle
            enterNode
                .append("circle")
                .style("fill", this.nodeConf.fillColor)
                .style("stroke", this.nodeConf.strokeColor)
                .style("stroke-width", 5)
                .attr("class", "node-circle")
                .attr("id", node => "node-circle-" + node.nodeId)
                .attr("r", this.nodeConf.radius)
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
                        .attr("width", this.nodeConf.radius * 2)
                        .attr("height", this.nodeConf.radius * 2)
                        .attr("xlink:href", node => this.getImg(node));

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
                    //清除定时器
                    this.isClick = false;
                    window.clearTimeout(this.timer);
                    this.toggleNode(this.nodeCircle, currNode, false);
                    this.toggleLine(this.linkLine, currNode, false);
                    this.toggleLineText(this.lineText, currNode, false);
                })
                .on("click", currNode => {
                    this.$emit("nodeClick", currNode);
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
                    }
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
                .attr("dy", "2.5em")
                .text(d => d.userName);
            var enterLine = this.linkLineGroup
                .selectAll(".link")
                .data(this.linksData)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", link => this.initLine(link))
                .attr("id", link => "link-" + link.id)
                .style("fill", "none")
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("cursor", "pointer");
                console.log(enterLine)
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
                .style("cursor", "pointer")
                .attr("transform", line => this.getLineText(line));

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
                .attr("fill", line =>
                    line.relation.length == 1
                        ? this.getLabelColor(line.relation[0].relationType)
                        : ""
                )
                .attr("dy", 17)
                .attr("dx", 3)
                .text(link => this.getLabeltext(link));
            enterLineText.each(function(line) {
                if (line.relation && line.relation.length > 1) {
                    d3.select(this)
                        .append("circle")
                        .style("fill", "#CACBDC")
                        .attr("r", 8)
                        .attr("cy", 4)
                        .attr(
                            "cx",
                            shelf.getLabelWidth(shelf.getLabeltext(line)) + 3
                        );
                    d3.select(this)
                        .append("text")
                        .style("font-size", 16)
                        .style("font-weight", 500)
                        .attr("dy", 10)
                        .attr(
                            "dx",
                            shelf.getLabelWidth(shelf.getLabeltext(line)) - 2
                        )
                        .text("+");
                }
            });
            enterLineText
                .on("click", function (currNode) {
                    shelf.lineTextClick(currNode,this);
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

        //绘制曲线
        initLine(line) {
            const $shelf = this;
            var data = [];
            if(line.px){
                console.log(line)
                return  "M" + line.source.x + " " + line.source.y + " Q" + line.px + " " + line.py + "," + line.target.x + " " + line.target.y
            }
            if (
                line.source.id == this.source.id &&
                line.target.id == this.target.id
            ) {
                return this.getLinkPath(line);
            }
            for (let n = 0; n < 10; n++) {
                data.push(1);
            }
            var scale_x = d3
                .scaleLinear()
                .domain([0, data.length - 1])
                .range([line.source.x, line.target.x]);
            var line_generator = d3
                .line()
                .curve(d3.curveBasis)
                .x(function(d, i) {
                    return scale_x(i);
                }) //曲线中x的值
                .y(function(d, i) {
                    return $shelf.computeY(scale_x(i), line.group, line.isTop);
                }); //曲线中y的值
            return line_generator(data);
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
        },

        //生成节点map
        getNodesMap(nodes) {
            const hash = {};
            nodes.map(value => {
                hash[value.id] = value;
            });
            return hash;
        },

        //生成节点map
        getLinksMap(links) {
            const hash = {};
            links.map(value => {
                const key = value.source.nodeId + "-" + value.target.nodeId;
                hash[key] = value;
            });
            return hash;
        },

        // 生成关系连线路径
        getLinkPath(link) {
            let sx = link.source.x;
            let tx = link.target.x;
            let sy = link.source.y;
            let ty = link.target.y;
            if(link.px){
                return  "M" + sx + " " + sy + " Q" + link.px + " " + link.py + "," + tx + " " + ty
            }else {
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
            var x = (line.source.x + line.target.x) / 2;
            var y =
                this.computeY(x, line.group, line.isTop) -
                this.labelConf.height / 2 -
                2;

            if (
                (line.source.id == this.source.id &&
                    line.target.id == this.target.id) ||
                (line.target.id == this.source.id &&
                    line.source.id == this.target.id)
            ) {
                y = line.source.y - this.labelConf.height / 2;
            }
            if(line.px){
                let x0 = line.source.x,
                    y0 = line.source.y,
                    x2 = line.target.x,
                    y2 = line.target.y,
                    t=0.5,cx,cy
                cx=Math.pow(1-t,2)*x0+2*t*(1-t)*line.px+Math.pow(t,2)*x2
                cy=Math.pow(1-t,2)*y0+2*t*(1-t)*line.py+Math.pow(t,2)*y2- this.labelConf.height / 2 - 2
                return "translate(" + cx + "," + cy + ")";
            }else {
                return "translate(" + x + "," + y + ")";
            }

        },

        getLabelWidth(label) {
            var regPos = /^\d+(\.\d+)?$/;
            const textLength = label.toString().length;
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

        //计算线文字的角度
        getLineTextAngle(d, bbox) {
            if (d.target.x < d.source.x) {
                const { x, y, width, height } = bbox;
                const rx = x + width / 2;
                const ry = y + height / 2;
                return "rotate(180 " + rx + " " + ry + ")";
            } else {
                return "rotate(0)";
            }
        },

        //节点hover时改变节点的opacity
        toggleNode(nodeCircle, currNode, isHover) {
            if (isHover) {
                nodeCircle.sort((a, b) =>
                    a.nodeId === currNode.nodeId ? 1 : -1
                );
                this.nodesData.sort((a, b) =>
                    a.nodeId === currNode.nodeId ? 1 : -1
                );
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
                            link.source.nodeId == currNode.source.nodeId &&
                            link.target.nodeId == currNode.target.nodeId
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
                            node.nodeId == currNode.target.nodeId ||
                            node.nodeId == currNode.source.nodeId
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
                    link.source.nodeId == currNode.source.nodeId &&
                    link.target.nodeId == currNode.target.nodeId
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
                if (node.nodeId == currNode.nodeId) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 4);
                } else {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", "none")
                        .style("stroke-width", 0);
                }
            });
        },

        //搜索节点选中时的状态
        searchNodeToggleClick(id) {
            const shelf = this;
            this.nodeCircle.each(function(node) {
                if (node.id == id) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 4);
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
            if (currNode.nodeId == node.nodeId) {
                return true;
            }
            return (
                this.linksMap[currNode.nodeId + "-" + node.nodeId] ||
                this.linksMap[node.nodeId + "-" + currNode.nodeId]
            );
        },

        isLinkLine(node, link) {
            return (
                link.source.nodeId == node.nodeId ||
                link.target.nodeId == node.nodeId
            );
        },

        //边点击事件
        lineClick(line) {
            console.log(line);
        },

        //线文字点击
        lineTextClick(line) {
            if(line.relation&&line.relation.length>1){
                this.linkLine.each(function (l) {
                    if(l.id==line.id){
                        d3.select(this).remove()
                    }
                })
                this.lineText.each(function (l) {
                    if(l.id==line.id){
                        d3.select(this).remove()
                    }
                })
                this.linksData.splice(this.linksData.findIndex(l=>l.id==line.id),1)
                this.arcPath(line);
            }

        },

        arcPath(d) {
            let x0 = d.source.x,
                y0 = d.source.y,
                x2 = d.target.x,
                y2 = d.target.y,
                x,
                y,
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
                } else {
                    y =
                        y0 / 2 +
                        y2 / 2 +
                        Math.round((index + g) / 2) * this.bezierDistance;
                    x = k1 ? (y - b) / k1 : x0 / 2 + x2 / 2;
                }

                d.id="line"+this.addId
                this.linksData.push({
                    ...d,
                    px:x,
                    py:y,
                    relation:[value]
                })
                this.addId+=1
            });

            this.createNodeAndLine()
        },

        addPath(path,x,y) {

            this.lineTextGroup
                .append("text")
                .style("font-size", this.labelConf.fontSize)
                .attr("fill","red")
                .attr("dy", y)
                .attr("dx", x)
                .text("测试");
            this.linkLineGroup
                .append("path")
                .attr("d", path)
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
                .attr("fill", "none");
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
            if (e && e.keyCode == 17) {
                shelf.isCtrl = false;
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
            switch (item.name) {
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
                    .selectAll("."+name)
                    .remove();
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
                    case "zoom":
                        d3.zoom().transform(this.svg, step.transformStart);
                        this.container.attr("transform", step.transformStart);
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
                case "zoom":
                    d3.zoom().transform(this.svg, step.transformEnd);
                    this.container.attr("transform", step.transformEnd);
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

        getImg() {
            return bary;
        },

        getLabelColor(type) {
            let color = "";
            if (!type) {
                return color;
            }
            relationTypeColor.map(value => {
                if (type == value.type) {
                    color = value.color;
                }
            });
            return color;
        },
        getLabeltext(link) {
            let count = 0;
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
    },
    destroyed() {
        document.removeEventListener("keydown", this.keydownEvent);
        document.removeEventListener("keyup", this.keyupEvent);
    },
    watch:{
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
    color: $content-text-color;
}
.radioButton {
    display: inline-block;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 3px;
    margin-left: 10px;
    font-size: 16px;
    border: 1px solid silver;
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
            margin-right: 10px;
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
    top: 60px;
    left: 20px;
    border-radius: 5px;
}
.select {
    position: absolute;
    top: 60px;
    left: 200px;
}
.info {
    position: absolute;
    top: 60px;
    right: 10px;
    max-height: calc(100% - 80px);
    overflow: hidden;
}
</style>
<style>
.linerect {
    -webkit-filter: drop-shadow(240px 0 #900);
    filter: drop-shadow(240px 0 #900);
}
</style>
