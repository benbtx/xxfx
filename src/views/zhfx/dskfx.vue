<template>
    <imp-panel>
        <!-- <h3 class="box-title" slot="header" style="width: 100%;">
            <el-row style="width: 100%;">
                <el-col
                    class="elcol"
                    :xs="24"
                    :sm="24"
                    :md="10"
                    :lg="8"
                    :xl="8"
                >
                    <div class="el-input" style=" float: left;">
                        <span style="display:inline-block;width:70px">
                            案件：</span
                        >

                        <el-select
                            size="340"
                            v-model="archiveNum"
                            @change="getSAR"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="loading"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col
                    class="elcol"
                    :xs="24"
                    :sm="24"
                    :md="10"
                    :lg="10"
                    :xl="8"
                >
                    <div class="el-input" style=" float: right;">
                        <span style="display:inline-block;width:70px">
                            关联次数:</span
                        >

                        <el-input-number
                            v-model="minnum"
                            controls-position="right"
                            @change="handleChange"
                            :min="1"
                            :max="10000000"
                        ></el-input-number
                        >-
                        <el-input-number
                            v-model="maxnum"
                            controls-position="right"
                            @change="handleChange"
                            :min="1"
                            :max="10000000"
                        ></el-input-number>
                    </div>
                </el-col>

                <el-col class="elcol" :xs="24" :sm="24" :md="2" :lg="6" :xl="6">
                    <el-button type="primary" icon="plus" @click="search"
                        >筛选</el-button
                    >

                    <el-button type="primary" icon="plus" @click="btnReset"
                        >重置</el-button
                    >
                </el-col>
            </el-row>
        </h3> -->
        <!-- <el-row slot="body" :gutter="24" style="margin-bottom: 20px;"> -->

        <kr-analysis-page slot="body" titleA="事件频率列表" titleB="时空轴分析">
            <div slot="component-chart" style="padding:10px;height: calc(100% - 50px);">
                <div class="toolbar">
                    <div style="width: 100%;font-size:12px;">
                        <el-date-picker
                            size="mini"
                            style=" float: right;;padding-right:20px；width: 230px"
                            v-model="dskfx_time"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                        >
                        </el-date-picker>

                        <el-select
                            size="mini"
                            style=" float: right;width:120px;padding-right:20px"
                            v-model="sjdvalue"
                            placeholder="前后1天"
                        >
                            <el-option
                                v-for="item in sjdoptions"
                                :key="item.intervalId"
                                :label="item.intervalName"
                                :value="item.intervalId"
                            >
                            </el-option>
                        </el-select>
                        <span style=" float: right;margin-top:5px">-</span>
                        <el-select
                            size="mini"
                            style=" float: right;width:135px;"
                            v-model="zysjvalue"
                            placeholder="重要时间选择(例:春节)"
                        >
                            <el-option
                                v-for="item in zysjoptions"
                                :key="item.importantTimeId"
                                :label="item.importantTimeName"
                                :value="item.importantTimeId"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <el-tabs  id='tab_sjkj' style="  height: 100%;"
                    v-model="activeName"
                    type="card"
                    @tab-click="handleClick"
                >
                    <el-tab-pane label="时空轴" name="first">
                        <div style="height:100%">
                            <div class="head">
                                <el-card class="box-card">
                                    <el-row :gutter="1">
                                        <el-col style="margin-bottom:5px"
                                            v-for="item in sjlxdata"
                                            :key="item.id"
                                            :xs="12"
                                            :sm="8"
                                            :md="4"
                                            :lg="3"
                                            :xl="2"
                                        >
                                            <el-button
                                                type="info"
                                                :class="{
                                                    sjlx_select: item.status
                                                }"
                                                @click="search(item)"
                                                >{{ item.name }}</el-button
                                            >
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </div>
                            <div
                                class="content"
                                style="height:calc(100% - 120px)"
                            >
                                <div class='con-left'>
                                        <div class="timeline">
                                            <div
                                                class="timeparent "
                                                v-for="item in ymdata"
                                                :key="item.id"
                                                :class="{
                                                    currentjd: item.status
                                                }"
                                            >
                                                <label
                                                    v-if="item.status"
                                                    class="timelabel"
                                                ></label>
                                                <span class="timespan"></span>
                                                <div
                                                    class="timediv"
                                                    @click="getTime(item)"
                                                >
                                                <!-- <a :href="'#'+item.year+'-'+item.month">{{
                                                     item.month == ""
                                                            ? item.year
                                                            : item.month + "月"
                                                    }}</a> -->
                                                    {{
                                                        item.month == ""
                                                            ? item.year
                                                            : item.month + "月"
                                                    }}
                                                </div>
                                            </div>

                                          
                                        </div>
                                    
                                </div>
                                <div class='con-right'>
                                         

                                        <div id='parent' class="eventline" v-if='ymdataInfo.items.length!=0'>
                                            
                                            <div  class="eventparent">
                                                <label
                                                    class="eventlabel eventlabel_event"
                                                ></label>
                                                <span
                                                    class="eventspan eventspan_event"
                                                ></span>
                                                <div
                                                    class="eventdiv eventdiv_ny"
                                                >
                                                    <div class="eventdiv_event">
                                                        {{ymdataInfo.year+'-'+ymdataInfo.month}}
                                                    </div>
                                                </div>
                                            </div>


                                            <div  v-for="item in ymdataInfo.items"   :key="item.id" class="eventparent">
                                                <label
                                                    class="eventlabel" :style="{ 'border-color': item.color }"
                                                ></label>
                                                <span
                                                    class="eventspan eventspan_info"
                                                ></span>
                                                <div class="eventdiv">
                                                    <span   :style="{ color: item.color }">
                                                         {{  item.eventTime+'  '+item.name}}
                                                         <span v-if="item.label!=''" style="    border: 1px solid #f0c180;  background: #fcf3e6;; color: #cc7e10;">{{item.label}}</span>
                                                    </span>
                                                    <div class="eventdivconten">
                                                        <div
                                                            class="eventdivcontentimg"
                                                        >
                                                            <!-- <img
                                                                class="sjpic"
                                                                :src="item.img"
                                                            /> -->
                                                            <kr-icon  class="kjpic" :icon="item.img" :color='item.color' :size='48'></kr-icon>
                                                        </div>
                                                        <div
                                                            class="eventdivcontentinfo"
                                                        >
                                                            <!-- <div>
                                                                航班信息-川航c0890
                                                            </div>
                                                            <div>
                                                                起始地： 时间 ：
                                                                目的地： 时间：
                                                            </div> -->
                                                            <p  v-html='item.content'> </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else>暂无数据</div>
                                </div>
                                
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="地图" style="height:100%" name="second">
                        <div class="dskmap">
                            <div class="dskmap-left">
                               <!-- <div class=lx> -->
                               <el-card class="box-card">
                                    <el-row :gutter="1">
                                        <el-col
                                            v-for="item in kjlxdata"
                                            :key="item.id"
                                            :xs="12"
                                            :sm="12"
                                            :md="12"
                                            :lg="12"
                                            :xl="12"
                                            style="margin-top:5px"
                                        >
                                            <el-button
                                                type="info"
                                                :class="{
                                                    sjlx_select: item.status
                                                }"
                                                @click="search(item)"
                                                >{{ item.name }}</el-button
                                            >
                                        </el-col>
                                    </el-row>
                                </el-card>
                               <!-- </div> -->
                               <div class='timelb'>
                                    <el-card class="box-card" style="    height: 100%;overflow-y: auto;">
                                        <div id='parent' class="eventlinekjqy">
                                            <template  v-for="item in ymdataInfo2"  > 
                                                    <div  v-if="item.dataId==null" :key="item.id"  class="eventlinechild">
                                                      
                                                        <span
                                                            class="child_line_ny "
                                                        ></span>
                                                        <div
                                                            class="eventdiv child_content_ny"
                                                        >
                                                            <div class="eventdiv_event">
                                                            <!-- {{item.year+'-'+item.month}} -->
                                                             {{item.name}}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div v-else  :key="item.id"  class="eventlinechild" 
                                                     :class="{
                                                        currentryjd: item.status
                                                    }"
                                                    @click="btnZbdw(item)">
                                                        <label
                                                            class="child_point"
                                                            :class="{
                                                                currentrypoint: item.status
                                                            }"
                                                        ></label>
                                                        <span
                                                            class="child_line"
                                                        ></span>
                                                        <div class="child_content">
                                                            <!-- 13 13:35:26 张三 -->
                                                          
                                                            <span>  {{item.eventTime.split('-')[2]}}</span>
                                                              <br>
                                                             <span> 
                                                                  <!-- <img
                                                                        class="kjpic"
                                                                        :src="item.img"
                                                                    /> -->
                                                                    <kr-icon  class="kjpic" :icon="item.img"  :size='16' :color='item.color'></kr-icon>
                                                              </span>      
                                                            <!-- {{item.img}} -->
                                                            <span> {{item.name}}</span>
                                                         
                                                        </div>
                                                    </div>

                                            </template>
                                              

                                                


                                        </div>
                                     </el-card>
                               </div>
                            </div>
                            <div class="dskmap-right">
                                
                                <kr-map
                                    :highlightPoint="highlightPoint"
                                    :mapPoint="mapPoint"
                                    :bigScreenBtn="true"
                                    :markerNumber="true"
                                    :isLine="false"
                                    :ryinfo="checkedsarsinfo"
                                    :selectOptions="selectOptions"
                                    @selectChange="selectChange($event)"
                                    @handleBigScreen="handleBigScreen($event)"

                                    
                                       
                                ></kr-map>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="component-table">
                需求设计中。。。
            </div>
        </kr-analysis-page>

      

        <!-- <div slot="aside">
            <div class="sddd">
                <span style="text-align:center;font-size:16px;color: #0C1231;"
                    >对象选择</span
                >
                <div class="sar">
                    <div v-if="sars.length == 0" style="text-align:center">
                        暂无数据
                    </div>
                    <div v-else>
                        <el-checkbox-group v-model="checkedsars">
                            <div class="lb" v-for="item in sars" :key="item.id">
                                <el-checkbox
                                    :label="item.identifier"
                                    :key="item.id"
                                    v-model="item.state"
                                    @change="isShowGJ"
                                    >{{ item.name }}
                                    <span v-if="true">
                                        <span
                                            class="rytl"
                                            :style="{ background: item.color }"
                                        ></span>
                                      
                                    </span>
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>

                    <el-button type="primary" @click="btnKsfx"
                        >开始分析</el-button
                    >
                    <el-button type="primary" @click="btnQkdx"
                        >清空对象</el-button
                    >
                </div>
            </div>
        </div> -->

          <kr-choose @startAnalysis="startAnalysis($event)" @clearAll="clearAll" :all="sars"  :isPerson='true' slot="aside" :max='100' @search="searchPerson"></kr-choose>
    </imp-panel>
</template>
<script type="text/babel">
import { getLxBySj, getLxByKj, getZysj,getTackTypes,getNyInfo,getInfobyny,getTrackTimeLine,getTrack,getSAObjectByDABH} from "../../api/zhfx/dskfx";

import panel from "../../components/common/panel.vue";
import { DSK_COLOR } from "@/config/index.js";


export default {
    // mixins: [ treeter ],
    components: {
        "imp-panel": panel
        // "kr-map": krmap

        // 'el-select-tree': selectTree
    },
    data() {
        return {
            query:null,
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

            selectOptions: {
                options: [
                    { name: "国内轨迹", value: "1" },
                    { name: "上班轨迹", value: "2" },
                    { name: "节假日轨迹", value: "3" },
                    { name: "出入境轨迹", value: "4" },
                    { name: "上下班轨迹", value: "5" }
                ],
                title: "轨迹类型"
            },
            tracktype:[],
            highlightPoint:null,
            mapPoint: [
                //     {   
            //         id:'1',
            //         longitude: 114.001,
            //         latitude: 22.55,
            //         value_: 0,
            //         time: "2019-08-21 09:21:20",
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         name: "刘某",
            //         color: "blue",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'2',
            //         longitude: 114.0143,
            //         latitude: 22.55,
            //         value_: 1,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'3',
            //         longitude: 114.0286,
            //         latitude: 22.54,
            //         value_: 2,
            //         time: "2019-08-21 09:21:20",
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         name: "刘某",
            //         color: "blue",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'4',
            //         longitude: 114.037,
            //         latitude: 22.5535,
            //         value_: 3,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'5',
            //         longitude: 114.046,
            //         latitude: 22.55,
            //         value_: 4,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'6',
            //         longitude: 114.056,
            //         latitude: 22.55,
            //         value_: 5,
            //         time: "2019-08-21 09:21:20",
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         name: "刘某",
            //         color: "blue",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'7',
            //         longitude: 114.065,
            //         latitude: 22.55,
            //         value_: 6,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'8',
            //         longitude: 114.07505,
            //         latitude: 22.5398,
            //         value_: 7,
            //         time: "2019-08-21 09:21:20",
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         name: "刘某",
            //         color: "blue",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'9',
            //         longitude: 114.0851,
            //         latitude: 22.56,
            //         value_: 8,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'10',
            //         longitude: 114.09015,
            //         latitude: 22.55,
            //         value_: 9,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'11',
            //         longitude: 114.10525,
            //         latitude: 22.5604,
            //         value_: 10,
            //         time: "2019-08-21 09:21:20",
            //         num: "c095f6a882b911eabf9a0242ac110002",
            //         name: "3513",
            //         color: "green",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     },
            //     {
            //         id:'12',
            //         longitude: 114.1137,
            //         latitude: 22.5495,
            //         value_: 11,
            //         time: "2020-08-21 09:21:20",
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         name: "刘某",
            //         color: "blue",
            //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
            //     }
            ],
            iconMarker: "",
            // gj: [
            //     //   new BMap.Point(114.00100, 22.550000), new BMap.Point(114.00130, 22.550000),
            //     //   new BMap.Point(114.00160, 22.550000), new BMap.Point(114.00200, 22.550000),
            //     //   new BMap.Point(114.00300, 22.550500), new BMap.Point(114.00400, 22.550000),
            //     //   new BMap.Point(114.00500, 22.550000), new BMap.Point(114.00505, 22.549800),
            //     //   new BMap.Point(114.00510, 22.550000), new BMap.Point(114.00515, 22.550000),
            //     //   new BMap.Point(114.00525, 22.550400), new BMap.Point(114.00537, 22.549500)
            // ],
            zysjoptions: [
                {
                    importantTimeId: "选项1",
                    importantTimeName: "黄金糕"
                },
                {
                    importantTimeId: "选项2",
                    importantTimeName: "双皮奶"
                }
            ],
            zysjvalue: "",

            sjdoptions: [
                {
                    intervalId: "选项1",
                    intervalName: "前后1天"
                },
                {
                    intervalId: "选项4",
                    intervalName: "前后3天"
                },
                {
                    intervalId: "选项5",
                    intervalName: "前后5天"
                }
            ],
            sjdvalue: "",

            dskfx_time: "",

            sjlxdata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],
            kjlxdata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],

            ymdata: [
                // {
                //     year: "",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "9",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "8",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "7",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "9",
                //     value: "",
                //     status: false
                // }

              
            ],
            ymdataInfo:{
                    year: "2020",
                    month: "9",
                  
                    status: false,
                    items:[
                    // {
                    //     name:'刘某',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color:'blue'
                    // },{
                    //     name:'刘某',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "blue",
                    // },{
                    //     name:'刘某',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "blue",

                    // },{
                    //     name:'3513',
                    //     num:'c095f6a882b911eabf9a0242ac110002',
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "green",
                    // },{
                    //     name:'3513',
                    //     num:'c095f6a882b911eabf9a0242ac110002',
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "green",
                    // },{
                    //     name:'3513',
                    //     num:'c095f6a882b911eabf9a0242ac110002',
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "green",
                    // },{
                    //     name:'3513',
                    //     num:'c095f6a882b911eabf9a0242ac110002',
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "green",
                    // }
                    ],
            },

            ymdataInfo2:[
                    // {
                    //     id:'ewrewr',
                    //     year: "2020",
                    //     month: "9",
                    //     status: false,
                    //     name:'2020-07',
                    //     eventTime: " ",
                    //     info:'',
                    // },
                    // {
                    //     id:'1',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     longitude: 114.001,
                    //     latitude: 22.55,
                    //     year: "2020",
                    //     month: "9",
                    //     status: false,
                    //     name:'刘某',
                    //     color: "blue",
                    //     eventTime: " 13 13:35:26 ",
                    //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    // },{
                    //     id:'2',
                    //     num: "c095f6a882b911eabf9a0242ac110002",
                    //     longitude: 114.0143,
                    //     latitude: 22.55,
                    //     year: "2020",
                    //     month: "9",
                    //     status: false,
                    //     name:'3513',
                    //     color: "green",
                    //     eventTime: " 13 13:35:26 ",
                    //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    // },{
                    //     id:'3',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     longitude: 114.0286,
                    //     latitude: 22.54,
                    //     year: "2020",
                    //     month: "9",
                    //     status: false,
                    //     name:'刘某',
                    //     color: "blue",
                    //     eventTime: " 13 13:35:26 ",
                    //     info:'',
                    //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    // },
                    // {
                    //     id:'sdfsdf',
                    //     year: "2020",
                    //     month: "8",
                    //     status: false,
                    //     name:'',
                    //     eventTime: " ",
                    //     info:'',
                    // },{
                    //     id:'4',
                    //     num: "c095f6a882b911eabf9a0242ac110002",
                    //     longitude: 114.037,
                    //     latitude: 22.5535,
                    //     year: "2020",
                    //     month: "8",
                    //     status: false,
                    //     name:'3513',
                    //     color: "green",
                    //     eventTime: " 13 13:35:26 ",
                    //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    // },{
                    //     id:'5',
                    //     num: "c095f6a882b911eabf9a0242ac110002",
                    //     longitude: 114.046,
                    //     latitude: 22.55,
                    //     year: "2020",
                    //     month: "8",
                    //     status: false,
                    //     name:'3513',
                    //     color: "green",
                    //     eventTime: " 13 13:35:26 ",
                    //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
                    // }

            ],

            // ymdataInfo: [
              
            //     {
            //         year: "2020",
            //         month: "9",
                  
            //         status: false,
            //         points:[{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         }],
            //     },

            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },{
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // }


            //     // {
            //     //     year: "2020",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2020",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // }

            //     // {
            //     //    year:'2020',
            //     //    months:[9,8,7]
            //     // },{
            //     //    year:'2019',
            //     //    months:[9,8,7]
            //     // },
            // ],

            
            hascurrentjd: true,
            hasnojd: false,

            currentjd: {
                year: "",
                month: ""
            },
            activeName: "first",
            gxlx: "PPTransfer", //人与人关系类型

            saryx: "",
            lxr: "",

            maxnum: 100000,
            minnum: 1,
            sjdvalue: "",
            nr: "",
            yxh: "",
            startvalue: "",
            endvalue: "",

            loading: false,
            archiveNum: "1",//档案编号
            options: [],
            list: [],
            checkedsars: [], //只包含了id
            checkedsarsinfo: [], //重新构造 传给map 全部信息
            sars: [

                
                // {
                //     num: "c093a3d182b911eabf9a0242ac110012",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "王某",
                //     sex: "女",
                //     identifier: "792892196811231931",
                //         "zjhm": "792892196811231931",
                //     phone: "18828193833",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0",
                //          "mc": "1931",
                // },

                //  {
                //     "sabh": "846adaabc6fe11ea82f00242ac110002",
                //     "dabh": "84646445c6fe11ea82f0",
                //     "mc": "1931",
                //     "xb": "男",
                //     "zjhm": "792892196811231931",
                //     "dhhm": "null",
                //     "gx": "null",
                //     "sfzysar": "N",
                //     "zt": "0",
                //     "bgsj": "null",
                //     "sfsc": "N",
                //     "cjsj": "2020-07-16 08:51:43.0",
                //     "sfsarylx": "N",
                //     "hxbh": "null",
                //     "fsabh": "null",
                //     "zp": "null",
                //     "sarbh": "null",
                //       gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                // },
                // {
                //     num: "c093a3d182b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "刘某",
                //     sex: "女",
                //     identifier: "510000197203249868",
                //     phone: "18828193833",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // },
                // {
                //     num: "c093a40d82b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "测试2",
                //     sex: "男",
                //     identifier: "513902199010129430",
                //     phone: "18782940501",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // },
                // {
                //     num: "c093a41982b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "测试",
                //     sex: "男",
                //     identifier: "513902199010129437",
                //     phone: "18782940532",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // },
                // {
                //     num: "c093a43982b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "测试1",
                //     sex: "男",
                //     identifier: "513902199010129431",
                //     phone: "18782940500",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // },
                // {
                //     num: "c093a44382b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "赵某六",
                //     sex: "男",
                //     identifier: "510000197308182616",
                //     phone: "13928991827",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // },
                // {
                //     num: "c095f6a882b911eabf9a0242ac110002",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "3513",
                //     sex: "男",
                //     identifier: "240301196612133513",
                //     phone: "null",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "green",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0"
                // }
            ],
            // ids:[],
            // sars:[
            // {id:1,name:"张三"},
            // {id:2,name:"李四"},
            // {id:3,name:"王五"},],
            selectIconDialog: false,
            formLabelWidth: "100px",
            defaultProps: {
                children: "children",
                label: "value",
                id: "id"
            },
            maxId: 7000000,
            menuTree: [],
            form: {
                id: null,
                name: "",
                sort: 0,
                icon: "",
                href: "",
                isShow: "",
                delivery: false,
                parentId: null,
                desc: ""
            },

            currentRow: {},
            dialogVisible: false,
            dialogLoading: false,

            roleTree: [],
            listLoading: false,
            searchKey: "",
            typeId: "",
            tableData: {
                pagination: {
                    total: 0,
                    pageNo: 1,
                    pageSize: 10,
                    parentId: 0
                },
                rows: []
            },
            jdform: {
                code: null,
                description: "",
                parent: -1,
                id: -1
            }
        };
    },
    computed: {},
    methods: {

         // 开始分析
        startAnalysis(person) {
           // console.log("开始分析");
           var _this = this;
            //获取当前选择人员的轨迹信息 mapPoint{name:'刘某',points},{name:'3513',points}
            //人员信息增加 ‘显示轨迹按钮’，点击地图上显示那个时间轴拖动 ，再次点击关闭，切换人员点击则传入相应坐标
            //传值给map 对象

            if (this.dskfx_time == '') {
                this.$message("请选择开始日期和结束日期！");
                return;
            }

            // if (this.checkedsars.length == 0) {
            //     this.$message("请选择对象！");
            //     return;
            // }
            if (person.length == 0) {
                this.$message("请选择对象！");
                return;
            }
            //构造 checkedsarsinfo
            // _this.checkedsarsinfo = [];
            // this.sars.forEach(element => {
            //     if (_this.checkedsars.toString().search(element.identifier) > -1) {
            //         _this.checkedsarsinfo.push(element);
            //     }
            // });
            this.checkedsarsinfo=person;
            
            //获取时间轴年月 ,默认选择最新一个月数据
            this.getNyList();


            this.getGjTimeLine();

            this.getGj();
            

           

            //  //组装数据
            //  var data=[
            //     {   year: "2020",
            //         month: "9",
            //         status: false,
            //         points:[
            //             {
            //                 id:'1',
            //                 num: "c093a3d182b911eabf9a0242ac110002",
            //                 longitude: 114.001,
            //                 latitude: 22.55,
            //                 year: "2020",
            //                 month: "9",
            //                 status: false,
            //                 name:'刘某',
            //                 color: "blue",
            //                 date: " 13 13:35:26 ",
            //                 info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：', 
            //             },{
            //                 id:'2',
            //                 num: "c095f6a882b911eabf9a0242ac110002",
            //                 longitude: 114.0143,
            //                 latitude: 22.55,
            //                 year: "2020",
            //                 month: "9",
            //                 status: false,
            //                 name:'3513',
            //                 color: "green",
            //                 date: " 13 13:35:26 ",
            //                 info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //             },{
            //                 id:'3',
            //                 num: "c093a3d182b911eabf9a0242ac110002",
            //                 longitude: 114.0286,
            //                 latitude: 22.54,
            //                 year: "2020",
            //                 month: "9",
            //                 status: false,
            //                 name:'刘某',
            //                 color: "blue",
            //                 date: " 13 13:35:26 ",
            //                 info:'',
            //             },]
            //     },
            //     {   year: "2020",
            //         month: "8",
            //         status: false,
            //         points:[
            //             {
            //                 id:'4',
            //                 num: "c095f6a882b911eabf9a0242ac110002",
            //                 longitude: 114.037,
            //                 latitude: 22.5535,
            //                 year: "2020",
            //                 month: "8",
            //                 status: false,
            //                 name:'3513',
            //                 color: "green",
            //                 date: " 13 13:35:26 ",
            //                 info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //             },{
            //                 id:'5',
            //                 num: "c095f6a882b911eabf9a0242ac110002",
            //                 longitude: 114.046,
            //                 latitude: 22.55,
            //                 year: "2020",
            //                 month: "8",
            //                 status: false,
            //                 name:'3513',
            //                 color: "green",
            //                 date: " 13 13:35:26 ",
            //                 info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //             }
            //             ]
            //     },
               

            //  ];

           
        },

        selectChange(type){
          this.tracktype=type;
        },

        


        // 搜索
        searchPerson() {
        // console.log("search");
        },
        //情况对象
        clearAll() {
              this.checkedsarsinfo=[];
              this.mapPoint=[];
            //   this.ymdataInfo=[]
              this.ymdataInfo2=[];
        },

     
        isShowGJ(item, val, v) {
            // item.state=!item.state;
        },
        btnZbdw(item){
            //地图点击 左侧人员 高亮 右侧人员定位 
            item.status =  !item.status;
            //其他变为false,
            this.ymdataInfo2.forEach(function(it, index, arr) {
                if (item != it) {
                    it.status = false;
                }
            });
            // this.highlightPoint={longitude:item.longitude,latitude:item.latitude};
            this.highlightPoint=item;



        },
        btnKsfx() {
           
        },
        

        getTime(item) {
             if(item.month==''){
                return;
            }
            // this.currentjd.year;
            // this.currentjd.month;
            item.status = true;
            //其他变为false,
            this.ymdata.forEach(function(it, index, arr) {
                if (item.value != it.value) {
                    it.status = false;
                }
            });

            this.getInfobyny(item);

            // this.ymdataInfo={ year: "2020",
            //     month: "8",
                
            //     status: false,
            //     points:[{
            //         name:'刘某d',
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color:'blue'
            //     },{
            //         name:'刘某',
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color: "blue",
            //     },{
            //         name:'3513',
            //         num:'c095f6a882b911eabf9a0242ac110002',
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color: "green",
            //     }],
            // };
           




            // // alert(item.year + "-" + item.month);
             
            // //获取与当前li想匹配的div距离页面顶端的距离
            // var dom=document.getElementById(item.year+'-'+item.month);
            // if(dom==null) return;
            // var div_top = dom.offsetTop;
            // console.log(div_top);
            // // console.log(dom.offset().top); 

            // window.scrollTo(0, div_top);


            // var parent=document.getElementById('parent');
            // parent.scrollTop+=div_top;


            
            

        },

        handleBigScreen(){
            //处理大屏幕

        },

        dataTransform(data,year,month){
           //根据年月获取该月数据
        },
        dataTransform2(){

        },

        handleClick(tab, event) {
            // console.log(tab, event);
            // this.gj=[
            // //         new BMap.Point(114.00100, 22.550000), new BMap.Point(114.00130, 22.550000),
            // //   new BMap.Point(114.00160, 22.550000), new BMap.Point(114.00200, 22.550000),
            // //   new BMap.Point(114.00300, 22.550500), new BMap.Point(114.00400, 22.550000),
            // //   new BMap.Point(114.00500, 22.550000), new BMap.Point(114.00505, 22.549800),
            // //   new BMap.Point(114.00510, 22.550000), new BMap.Point(114.00515, 22.550000),
            // //   new BMap.Point(114.00525, 22.550400), new BMap.Point(114.00537, 22.549500),
            //   {longitude:114.00100,latitude:22.550000,value_:1},
            //   {longitude:114.01430,latitude:22.550000,value_:2},
            //   {longitude:114.02860,latitude:22.540000,value_:3},
            //   {longitude:114.03700,latitude:22.553500,value_:4},
            //   {longitude:114.04600,latitude:22.550000,value_:5},
            //        {longitude:114.05600,latitude:22.550000,value_:6},
            //         {longitude:114.06500,latitude:22.550000,value_:7},
            //         {longitude:114.07505,latitude:22.539800,value_:8},
            //         {longitude:114.08510,latitude:22.560000,value_:9},
            //         {longitude:114.09015,latitude:22.550000,value_:10},
            //         {longitude:114.10525,latitude:22.560400,value_:11},
            //         {longitude:114.1137,latitude:22.549500,value_:12},
            // ];
        },
 
        getyjfxMX() {
            console.log(232323);

            if (this.checkedsars.length == 0) {
                this.$message("请选择涉案人");
                return;
            }
            //  let param={
            //      "strings":this.checkedsars.toString(),
            //     "limit":  this.tableData.pagination.pageSize,
            //     "offset":  this.tableData.pagination.pageNo,
            //     "archivesNum":  this.archiveNum.toString(),
            //     "saryx":this.saryx,
            //     "lxryx":this.lxryx,
            //   }
            //   return http_da
            //   .getmailNonWorkTimeMX(param)
            if (this.gxlx == "PPTransfer") {
                let param = {
                    //  "strings":this.checkedsars.toString(),
                    archivesNum: this.archiveNum.toString(),
                    identifier: this.saryx,
                    otherIdCard: this.lxryx,
                    pageSize: this.tableData.pagination.pageSize,
                    pageNumber: this.tableData.pagination.pageNo
                };

                return http_dwdgxfx
                    .getDWSJMX_JY(param)
                    .then(res => res)
                    .then(data => {
                        if (data.data.code == 200) {
                            this.tableData.rows = data.data.data.rows;
                            this.tableData.pagination.total =
                                data.data.data.total;
                        } else {
                            this.$message(data.data.msg);
                        }
                    })
                    .catch(e => {
                        this.$message("接口操作失败");
                    });
            } else if (this.gxlx == "PPEmail") {
                let param = {
                    //  "strings":this.checkedsars.toString(),
                    archivesNum: this.archiveNum.toString(),
                    saryx: this.saryx,
                    lxryx: this.lxryx,
                    pageSize: this.tableData.pagination.pageSize,
                    pageNumber: this.tableData.pagination.pageNo
                };

                return http_dwdgxfx
                    .getDWSJMX_YJ(param)
                    .then(res => res)
                    .then(data => {
                        if (data.data.code == 200) {
                            // this.graphVo=cloneDeep(data.data.data);
                            // this.gxtData=data.data.data;
                            this.tableData.rows = data.data.data.rows;
                            this.tableData.pagination.total =
                                data.data.data.total;
                        } else {
                            this.$message(data.data.msg);
                        }
                    })
                    .catch(e => {
                        this.$message("接口操作失败");
                    });
            } else {
                this.$message("增加相关类型请及时告知前端进行相应代码相关");
            }
        },
    
        handleClose(done) {
            this.dialogVisible = false;
        },

        // getDA 获取所有案件信息
        getDA() {
            // this.list = [];
            // return http_da
            //     .getDAXX({})
            //     .then(res => res)
            //     .then(data => {
            //         if (data.data.code == 200) {
            //             //生成option
            //             for (const item of data.data.data) {
            //                 this.list.push({
            //                     value: item.num,
            //                     label: item.name
            //                 });
            //             }
            //         } else {
            //             this.$message(res.data.msg);
            //         }
            //     })
            //     .catch(e => {
            //         this.graphLoading = false;
            //         this.$message("接口操作失败");
            //     });
        },

      
        //根据案件查图信息
        getSAR() {
                var _this=this;
            //根据url获取案件编号
            this.checkedsars = [];
            if(location.href.search('=')!=-1){
                  this.query={dabh:location.href.split('=')[1]};
            }else{
                this.$message('未传入案件编号！');
                return;
            }
            getSAObjectByDABH(this.query)
                .then(response => {
                    // this.loading = false;
                    //根据人员个数产生随机色
                   var colors= this.getColor(response.data.saxxModels.length);
                    //追加颜色字段
                    //   for (const item of  response.data.saxxModels) {
                    //      item.color=_this.getRandomColor();
                    //      item.gjindexs=[];
                    //      item.gjline=[];
                    //  } 
                    response.data.saxxModels.forEach((item,i) => {
                        // item.color=colors[i].style.background;
                        item.color=DSK_COLOR[i];
                         item.gjindexs=[];
                         item.gjline=[];
                    });
                     console.log(response.data.saxxModels);
                     _this.sars=response.data.saxxModels;
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sars = [];
                   
                });
            
        },
        //生成随机色 ,不能产生白色相近的颜色
        // getRandomColor(){
        //     //   return '#'+Math.floor(Math.random()*0xffffff).toString(16);
        //       return 'rgba('+Math.floor(Math.random()*255)+','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +',0.8)';
        // },
        /*
        其它一切应该都是不言自明的
        random() 生成[0, 1)
        乘以0xffffff 变成[0, 0xffffff)
        这样会产生一个bug, 因为0xffffff 不会产生
        然后取整rounded/floored, 转换成前缀为#的字符串
        */

        getRandomColor(){
            return '#' +
                (function a(color) {
                    return(color += '5678956789defdef' [Math.floor(Math.random() * 16)]) &&
                        (color.length == 6) ? color :a(color);
                })('');
        },



        //随机色开始
        getColor(hslLength){
            var self = this;
            var hlscolor=this.getHslArray(hslLength);
            var rgbArray = hlscolor.map(function (item) {
                return self.hslToRgb.apply(this, item);
            });

            return rgbArray.map(function (item) {
                return {
                value: item,
                style: { background: 'rgb(' + item.toString() + ')' }
                }
            });
        },
       
        /**
         * HSL颜色值转换为RGB
         * H，S，L 设定在 [0, 1] 之间
         * R，G，B 返回在 [0, 255] 之间
         *
         * @param H 色相
         * @param S 饱和度
         * @param L 亮度
         * @returns Array RGB色值
         */
        hslToRgb: function (H, S, L) {
          var R, G, B;
          if (+S === 0) {
            R = G = B = L; // 饱和度为0 为灰色
          } else {
            var hue2Rgb = function (p, q, t) {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1/6) return p + (q - p) * 6 * t;
              if (t < 1/2) return q;
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
            };
            var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
            var P = 2 * L - Q;
            R = hue2Rgb(P, Q, H + 1/3);
            G = hue2Rgb(P, Q, H);
            B = hue2Rgb(P, Q, H - 1/3);
          }
          return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
        },

        // 获取随机HSL
        randomHsl: function () {
          var H = Math.random();
          var S = Math.random();
          var L = Math.random();
          return [H, S, L];
        },

        // 获取HSL数组
        getHslArray: function (hslLength) {
          var HSL = [];
        //   var hslLength = 16; // 获取数量
          for (var i = 0; i < hslLength; i++) {
            var ret = this.randomHsl();

            // 颜色相邻颜色差异须大于 0.25
            if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
              i--;
              continue; // 重新获取随机色
            }
            ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
            ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

            // 数据转化到小数点后两位
            ret = ret.map(function (item) {
              return parseFloat(item.toFixed(2));
            });

            HSL.push(ret);
          }
          return HSL;
        },

        //随机色结束


        

        search(item) {
           
            item.status = !item.status;

            // this.getDWDGX();
        },
  
     

   
       
       
       




        getSjlxList() {
            // this.loading = true;
            var _this=this;
            this.sjlxdata=[];
            getLxBySj()
                .then(response => {
                    // this.loading = false;
                     for (const item of  response.data) {
                         item.status=true;
                     } 
                    _this.sjlxdata = response.data;

                  
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sjlxdata = [];
                   
                });
        },
        getKjlxList() {
            var _this=this;
            this.kjlxdata=[];
            getLxByKj()
                .then(response => {
                 
                     for (const item of   response.data) {
                         item.status=true;
                     } 
                       _this.kjlxdata = response.data;
                })
                .catch(() => {
                   _this.kjlxdata = [];
                });
        },
        getZysjList() {
            var _this=this;
            this.zysjoptions=[];
            this.sjdoptions=[];
            this.query = {
                dabh : this.archiveNum
            };
            getZysj( this.query)
                .then(response => {
                   
                    _this.zysjoptions = response.data.importantTimes;
                    _this.sjdoptions = response.data.intervals;
                    if(response.data.importantTimes.length==0|| response.data.intervals.length==0) {
                        return;
                    }
                    _this.zysjvalue=response.data.importantTimes[0].importantTimeId;

                    _this.sjdvalue=response.data.intervals[0].intervalId;

                })
                .catch(() => {
                   _this.zysjoptions = [];
                    _this.sjdoptions = [];
                });
        },
        getGjlxList() {
            var _this=this;
            this.selectOptions.options=[];
            getTackTypes()
                .then(response => {
                    _this.selectOptions.options = response.data;
                })
                .catch(() => {
                   _this.selectOptions.options = [];
                });
        },
        
        getNyList() {
            var _this=this;
            this.ymdata=[];
            this.query = {
                "beginTime":this.dskfx_time[0]|| "2020-06-01",
                "finishTime":this.dskfx_time[1]|| "2020-09-30"
            };
            getNyInfo(this.query)
                .then(response => {
                    if(response.data.length==0){
                        this.$message('未查询到相关月份的数据！');
                        return;
                    }
                    for (const item of   response.data) {
                         item.status=false;
                     } 
                     var a= {
                        name:'',
                        year: "",
                        month: "",
                        value: "",
                        status: false
                    };
                    _this.ymdata = [a,...response.data];


                   

                    //默认获取最新一个月数据
                    //月份高亮
                    _this.ymdata[2].status = true;
                    _this.getInfobyny(response.data[0]);
                  

                })
                .catch(() => {
                    _this.ymdata =[];
                });
        },
        getInfobyny(item) {
            var _this=this;
            // this.ymdata=[];
            //构造时间类型数据 this.sjlxdata
            var sjlx=[];
            this.sjlxdata.forEach(element => {
                if(element.status){
                    sjlx.push(element.value) 
                }
            });
             //构造人员信息
            var person=[];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    "idCards":element.zjhm,
                    "logo":"01"
                }) 
            });
            this.query = {
                "beginTime":this.dskfx_time[0]|| "2020-06-01",
                "dabh": "84646445c6fe11ea82f0",
                "finishTime":this.dskfx_time[1]|| "2020-09-30",
                // "idCards": [
                //     {
                //     "idCards":"792892196811231931",
                //     "logo":"01"
                //     }
                // ],
                "idCards":person,
                "importantTimeId":this.zysjvalue ,
                "intervalId":this.sjdvalue,
                "lx":sjlx.toString(),
                "timeInterval":item.value||"2019-09-01to2019-09-30"
            };
            getInfobyny(this.query)
                .then(response => {
                    if(response.data==null){
                        _this.ymdataInfo={
                                    year: "2020",
                                    month: "9",
                                
                                    status: false,
                                    items:[]
                                };
                                this.$message('未查询到相关时间轨迹轴信息！');
                                return;
                    }
                  
                   
                    for (var i = 0; i < response.data.items.length; i++) {
                          //添加颜色字段
                        for (var j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if(response.data.items[i].identifier==_this.checkedsarsinfo[j].zjhm){
                                response.data.items[i].color=_this.checkedsarsinfo[j].color;
                            }
                        }
                        //添加图片位置字段
                        switch (response.data.items[i].value) {
                            case "01":
                                // response.data.items[i].img=require('../../assets/image/kakou48.png');
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "02":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "03":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "04":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "05":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "06":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "07":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "08":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            case "09":
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                break;
                            default :
                                response.data.items[i].img='icon-qiakoushexiangtou';
                                // break;
                        }

                                
                    }

                   _this.ymdataInfo=response.data;

                })
                .catch(() => {
                    _this.ymdataInfo =[];
                });
        },
        getGjTimeLine() {
            var _this=this;
            // this.ymdata=[];
            //构造时间类型数据 this.sjlxdata
             var kjlx=[];
             this.kjlxdata.forEach(element => {
                  if(element.status){
                      kjlx.push(element.value) 
                  }
              });
            //构造人员信息
            var person=[];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    "idCards":element.zjhm,
                    "logo":"01"
                }) 
            });
            this.query = {
                "beginTime":this.dskfx_time[0]|| "2020-06-01",
                "dabh": "84646445c6fe11ea82f0",
                "finishTime":this.dskfx_time[1]|| "2020-09-30",
                // "idCards": [
                //     {
                //     "idCards":"792892196811231931",
                //     "logo":"01"
                //     }
                // ],
                  "idCards":person,
                "importantTimeId":this.zysjvalue ,
                "intervalId":this.sjdvalue,
                "lx":kjlx.toString(),
                "trackTypeCodes":this.tracktype.toString(),
            };
            getTrackTimeLine(this.query)
                .then(response => {
                    if(response.data.length==0){
                        this.$message("未查询到相关空间轨迹轴信息！");
                        // return;
                    }
                    for (const item of  response.data) {
                        item.status=false;
                    } 
                    //添加颜色字段
                    for (var i = 0; i < response.data.length; i++) {
                        for (var j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if(response.data[i].identifier==_this.checkedsarsinfo[j].zjhm){
                                response.data[i].color=_this.checkedsarsinfo[j].color;
                            }
                        }
                         //添加图片位置字段
                        switch (response.data[i].value) {
                            case "01":
                                // response.data[i].img=require('../../assets/image/kakou16.png');
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                             case "02":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "03":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "04":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "05":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "06":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "07":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "08":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            case "09":
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                            default :
                                // response.data[i].img=require('../../assets/image/kakou16.png');
                                response.data[i].img='icon-qiakoushexiangtou';
                                break;
                        }

                                
                    }

                    console.log(11);
                   _this.ymdataInfo2=response.data;

                })
                .catch((e) => {
                    console.log(22);
                    _this.ymdataInfo2 =[];
                });
        },

        getGj() {
            var _this=this;
            // this.ymdata=[];
            //构造时间类型数据 this.sjlxdata
             var kjlx=[];
             this.kjlxdata.forEach(element => {
                  if(element.status){
                      kjlx.push(element.value) 
                  }
              });
            //构造人员信息
            var person=[];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    "idCards":element.zjhm,
                    "logo":"01"
                }) 
            });
            this.query = {
                "beginTime":this.dskfx_time[0]|| "2020-06-01",
                "dabh": "84646445c6fe11ea82f0",
                "finishTime":this.dskfx_time[1]|| "2020-09-30",
                // "idCards": [
                //     {
                //     "idCards":"792892196811231931",
                //     "logo":"01"
                //     }
                // ],
                 "idCards":person,
                "importantTimeId":this.zysjvalue ,
                "intervalId":this.sjdvalue,
                "lx":kjlx.toString(),
                "trackTypeCodes":this.tracktype.toString(),
            };
            getTrack(this.query)
                .then(response => {
                    console.log(response);
                    if(response.data.length==0){
                        this.$message("未查询到相关地图轨迹点信息！");
                        // return;
                    }
                    this.mapPoint=response.data;
                //      for (const item of  response.data) {
                //          item.status=false;
                //      } 
                //    _this.ymdataInfo2=response.data;

                })
                .catch(() => {
                    // _this.ymdataInfo2 =[];
                });
        },

        
        

    },
    created() {
        this.getDA();
        // this.getDWDGX();

        // eventBus.$on(eventCollection.yjfx_fgzsdyjfx, node => {
        //   console.log(node)
        //   this.getyjfxMX(node);
        // });
        this.getSAR();
      

        this.getSjlxList();
        this.getKjlxList();
        this.getZysjList();
        this.getGjlxList();
      
    }
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/styles/basic-color.scss";
.select-tree .icons-wrapper {
    display: block;
}

.select-tree .is-empty i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
}

.select-tree .is-empty i:hover {
    background-color: #0d6aad;
    color: #ffffff;
}
.el-pagination {
    float: right;
    margin-top: 15px;
}
.fgzsdyjfxleft {
    height: 600px;
    overflow-y: auto;
}
.txx {
    height: 350px;
    overflow-y: auto;
}
.xqfxlb {
    height: 200px;
    overflow-y: auto;
}
.lb {
    margin-top: 10px;
    margin-left: 10px;
}
#sjylxtree >>> .el-tree-node__content {
    margin-top: 5px;
    font-size: 16px;
}
/* .el-select--340{
    max-width: 550px;
    min-width: 455px;

  } */
.el-input-number {
    width: 120px;
}
.elcol {
    margin-bottom: 5px;
}
.grid-content {
    background: $color-primary;
    color: #ffffff;
    border-radius: 4px;
    min-height: 36px;
}
.content {
    margin-top: 20px;
    /* height: calc(100% - 20px); */
    /* height: calc(100% - 60px); */
}

.toolbar {
    // background: red;
    right: 20px;
    height: 30px;
    position: absolute;
    width: calc(100% - 200px);
    z-index: 10;
}

.sjlx {
    width: 101px;
    height: 32px;
    line-height: 32px;
    background: #e3e6f8;
}
.sjlx_select {
    background: $color-primary;
}

.timeline {
    margin-left: 80px;
}
.currentjd {
    margin-left: -8px;
    color: $color-primary;
}

.timeparent {
    /* min-height: 300px; */
    display: flex;
}
.timelabel {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    border: 1px solid rgb(21, 214, 214);

    /* background-color: rgb(21, 214, 214); */
}
.timespan {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #eee;
    margin-left: -5px;
    margin-top: 8px;
    margin-bottom: -9px;
    height: 35px; /* timediv- timelabel*/
}
.timediv {
    height: 35px;
    padding-left: 10px;
    cursor: pointer;
    position: relative;
    top: -5px;
}

.eventline {
    margin-left: 20px;
    padding-left: 10px;
    // height: 460px;
    // overflow-y: scroll;
    // overflow-y: auto;
}

.eventparent {
    /* min-height: 300px; */
    display: flex;
}

.eventlabel {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    border: 2px solid rgb(77, 82, 82);
    /* background-color: rgb(21, 214, 214); */
}

.eventlabel_event {
    /* width: 80px; */
}
.eventspan {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #f0f0f0;
    margin-left: -5px;
    margin-top: 8px;
    margin-bottom: -9px;
    height: 72px; /* timediv- timelabel 80-8*/
}

.eventspan_info {
    /* margin-left: -75px; */
    height: 112px; /* timediv- timelabel  120-8*/
}

.eventdiv {
    height: 120px;
    padding-left: 10px;
    width: 90%;
}

.eventdiv_ny {
    height: 80px;
}
.eventdiv_event {
    /* height: 50px; */
    margin-left: -20px;
    background: $color-primary;
    color: white;
    height: 40px;
    width: 80px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
}
.sjpic {
    width: 50px;
    height: 50px;
}
.kjpic {
    width: 16px;
    height: 16px;
}
.eventdivcontentimg {
    float: left;
}
.eventdivcontentinfo {
    float: left;
    margin-left: 20px;
}
.eventdivconten {
    height: 80%;
    background: #f6f7fc;
    width: 100%;
    display: flex;
    align-items: center;
}
.dskmap {
    display: flex;
    height: 100%;
}
.dskmap-left {
    flex-basis: 240px;
}
.dskmap-right {
    flex: 1;
    height: 100%;
}

.rytl {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    display: inline-block;
    background: red;
}
// //a标签去除默认样式
// a {
//     text-decoration: none;
//         color: gray;
// }
// /*正常的未被访问过的链接*/
// a:link {
//     text-decoration: none;
// }
// /*已经访问过的链接*/
// a:visited {
//     text-decoration: none;
// }
// /*鼠标划过(停留)的链接*/
// a:hover {
//     text-decoration: none;
// }
// /* 正在点击的链接*/
// a:active {
//     text-decoration: none;
// }
.content{
    display: flex;
    .con-left{
        flex-basis: 200px;
    }
    .con-right{

        flex: 1;
        overflow-y: auto;
    }
}
.timelb{
    margin-top: 20px;
    // overflow-y: auto;
        height: calc(100% - 125px);
}


#tab_sjkj {
  /deep/ {
    .el-tabs__content{
        height: calc(100% - 41px);
    }
  }
}
#tab_sjkj {
  /deep/ {
    .el-tab-pane{
        // height: calc(100% - 41px);
          height: 100%;
    }
  }
}


#tab_sjkj {
  /deep/ {
    #pane-second{
        // height: calc(100% - 41px);
        display: block !important;// element 的tab 控件对地图有影响去掉此样式
    }
  }
}







//地图左侧时间线开始

$jj_ny_content: 50px;
$jj_content_content: 50px;
//事件线控件区域
.eventlinekjqy {
    // margin-left: 10px;
    // padding-left: 10px;
    // height: 500px;
    // overflow-y: scroll;
    // overflow-y: auto;
    
}
.eventlinechild {
    /* min-height: 300px; */
    display: flex;
    padding: 0px 20px ;
}
.child_point {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    // border: 1px solid #4d5252;
    // background-color: rgb(21, 214, 214); 
    z-index: 2;
    position: relative;
    top: 6px;
    margin-left: -8px;
}
.child_line_ny {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_ny_content;  //年月和内容之间的间距
}
.child_line {
     border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_content_content; //内容和内容之间的间距
}

.child_content_ny{
    height: $jj_ny_content;  //年月的高度
     padding-left: 10px;
}
.child_content {
    height: $jj_content_content; //内容的高度
    margin-left: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
}
.currentryjd {
    // margin-left: -8px;
    color: $color-primary;
    background:#e5f4ff;
}
.currentrypoint {
    border: 2px solid $color-primary;
    background-color: white; 
}

//地图左侧时间线结束



</style>
