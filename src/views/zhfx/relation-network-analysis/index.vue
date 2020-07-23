<template>
  <imp-panel>
    <kr-analysis-page slot="body" titleA="关系网分析" titleB="列表详情">
      <kr-graph
        slot="component-chart"
        @nodeClick="nodeClick"
        @filterClick="filterClick"
        :graph="graph"
        :selectOptions="selectOptions"
        @saveAnalysis="openSave"
        @lineClick="lineClick"
        @analysisHistory="analysisHistory"
        @selectChange="intimacyRangeChange"
        :date="time"
        @dateChange="dateChange"
        v-kr-loading="loading"
      >
        <dimension-filtering
          slot="info"
          :condition="filter"
          :visible.sync="filterVisible"
          @submit="filterSubmit"
        />
        <node-details slot="info" :visible.sync="nodeVisible" :nodeInfo="nodeInfo" />
          <el-dialog
              slot="info"
              :modal-append-to-body="false"
              :title="title"
              :visible.sync="dialogVisible"
              :width="title == '保存分析' ? '400px' : '800px'"
          >
              <div v-kr-loading="historyLoading">
                  <kr-table
                      v-if="title == '分析记录'"
                      :total="historyTabe.length"
                      :rows="historyTabe"
                      :columns="historyColumns"
                      :showPagination="false"
                  ></kr-table>
                  <el-form
                      v-if="title == '保存分析'"
                      :model="ruleForm"
                      :rules="rules"
                      ref="ruleForm"
                      label-width="100px"
                      class="demo-ruleForm"
                  >
                      <el-form-item label="名称" prop="title">
                          <el-input v-model="ruleForm.title" style="width: 200px"></el-input>
                      </el-form-item>
                      <el-form-item label="描述" prop="desc" style="margin-top: 20px">
                          <el-input
                              v-model="ruleForm.desc"
                              type="textarea"
                              placeholder="请输入内容"
                              style="width: 200px"
                              maxlength="50"
                              show-word-limit
                          ></el-input>
                      </el-form-item>
                  </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">关闭</el-button>
                  <el-button type="primary" v-if="title == '保存分析'" @click="save">确 定</el-button>
              </div>
          </el-dialog>
      </kr-graph>
      <kr-analysis-page-table slot="component-table" title="列表详情" style="overflow-x: auto;">
        <div style="padding: 20px;">
          <kr-table
            :total="total"
            :rows="table"
            :columns="columns"
            :current="current"
            :indexRow="indexRow"
            @sort-change="sortChange"
            @on-page-change="onPageChange"
          ></kr-table>
        </div>
      </kr-analysis-page-table>
    </kr-analysis-page>
    <kr-choose @startAnalysis="startAnalysis" :checkList="checkList" :all="all" slot="aside"></kr-choose>
    <detail-info slot="body" ref="detailInfo" :row="row" />

  </imp-panel>
</template>
<script type="text/babel">
import detailInfo from "./detail-info";
import dimensionFiltering from "./dimension-filtering";
import nodeDetails from "./node-details";
import {
  network,
  getSAObjectByDABH,
  queryHistory,
  saveAnalysis
} from "../../../api/zhfx/relation-network";
import {
  delAnalysis,
  saveAnalysisList,
  getAnalysisList
} from "@/api/zhfx/dimension-relation-analysis.js";
import { cloneDeep } from "loadsh";
export default {
  components: {
    detailInfo,
    dimensionFiltering,
    nodeDetails
  },
  data() {
    const $shelf = this;
    return {
      filter: {},
      checkList: [],
      filterVisible: true,
      dialogVisible: false,
      historyLoading: false,
      loading: false,
      title: "",
      time: [],
      ruleForm: {
        title: "",
        desc: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        desc: [
          { required: true, message: "请输入描述", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到50 个字符",
            trigger: "blur"
          }
        ]
      },
      historyColumns: [
        {
          title: "名称",
          key: "title"
        },
        {
          title: "描述",
          key: "desc"
        },
        {
          title: "保存时间",
          key: "createTime",
          formatter(row) {
            return $shelf.$dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss");
          }
        },
        {
          title: "操作",
          component: {
            render(h, row) {
              return (
                <div>
                  <el-button type="text" onClick={() => $shelf.handleDel(row)}>
                    删除
                  </el-button>
                  <el-button type="text" onClick={() => $shelf.handleEdit(row)}>
                    编辑
                  </el-button>
                </div>
              );
            }
          }
        }
      ],
      results: { nodeInfos: [], relationVOS: [] },
      nodeVisible: false,
      row: {},
      tableData: [],
      nodeInfo: {},
      condition: {
        airplaneCount: null, //飞机同行次数
        busCount: null, //大巴同行次数
        callAmount: null, //通话时长
        callCount: null, //通话次数
        dabh: this.$route.query.dabh, //案件编号
        dimensionality: null, //维度
        startTime: null, //开始时间
        endTime: null, //结束时间
        idCards: [],
        keyword: "",
        liveCount: null, //同住次数
        intimacyRange: null, //关系层级
        trainCount: null, //火车同
        transferAmount: null, //交易金额
        transferCount: null //交易次数
      },
      selectOptions: {
        options: [
          { label: "全部", value: "" },
          { label: "0-20", value: "0-20" },
          { label: "20-40", value: "20-40" },
          { label: "40-60", value: "40-60" },
          { label: "60-80", value: "60-80" },
          { label: "80-100", value: "80-100" }
        ],
        title: "亲密度选择",
        value: ""
      },
      all: [],
      indexRow: false,
      total: 85,
      current: 1,
      size: 10,
      historyTabe: [],
      columns: [
        {
          title: "亲密度",
          width: 100,
          sortable: true,
          key: "intimacy"
        },
        {
          title: "对象",
          key: "object"
        },
        {
          title: "维度分析",
          key: "dimension"
        },
        {
          title: "操作",
          width: 100,
          component: {
            render(h, row) {
              return (
                <el-button type="text" onClick={() => $shelf.lookDetails(row)}>
                  查看详情
                </el-button>
              );
            }
          }
        }
      ]
    };
  },
  computed: {
    table() {
      let { nodeInfos = [], relationVOS = [] } = this.results;
      this.tableData = [];
      let nodeMap = {};
      this.total = relationVOS.length;
      nodeInfos.map(node => {
        nodeMap[node.idCard] = { ...node };
      });
      relationVOS.map(link => {
        nodeMap[link.source].name;
        let dimension = "";
        let dimensionList = [];
        link.relationTypeVOS.forEach(el => {
          dimension += el.relationType + " 分数:" + (el.score || 0) + " ";
          dimensionList.push(el.relationType);
        });
        this.tableData.push({
          intimacy: link.intimacy,
          object: `${nodeMap[link.source].realName} 与 ${
            nodeMap[link.target].realName
          }`,
          dimension,
          sourceIdCard: link.source,
          targetIdCard: link.target,
          dimensionList,
          sourceNodeId: nodeMap[link.source].nodeId,
          targetNodeId: nodeMap[link.target].nodeId
        });
        return;
      });
      this.tableData = this.tableData.slice(
        (this.current - 1) * this.size,
        this.current * this.size
      );
      return this.tableData.sort((a, b) => a.intimacy - b.intimacy);
    },
    graph() {
      let obj = cloneDeep(this.results);
      let { nodeInfos = [], relationVOS = [] } = obj;
      nodeInfos.map(node => {
        node.id = node.idCard;
        node.nodeName = `${node.realName}${node.sex ? `(${node.sex})` : ""}`;
      });
      relationVOS.map(link => {
        link.relation = link.relationTypeVOS;
      });
      return { nodes: nodeInfos, links: relationVOS };
    }
  },
  methods: {
    handleEdit(row) {
      this.dialogVisible = false;
      this.condition = JSON.parse(row.queryCriteria);
      this.filter = { ...this.condition };
      if (this.condition.startTime) {
        this.time = [this.condition.startTime, this.condition.endTime];
      }
      if (this.condition.intimacyRange) {
        this.selectOptions = {
          options: [...this.selectOptions.options],
          title: "亲密度选择",
          value: this.condition.intimacyRange + ""
        };
      }
      this.checkList = this.condition.idCards.map(value => value.idCard);
      this.getNetWork();
    },
    sortChange({ prop, order }) {
      if (order == "ascending") {
        this.tableData = this.tableData.sort((a, b) => a.length - b.length);
      } else if (order == "descending") {
        this.tableData = this.tableData.sort((a, b) => b.length - a.length);
      }
    },
    lineClick(data) {
      if (data.relation) {
        let dimensionList = data.relation.map(value => value.relationType);
        this.row = {
          sourceIdCard: data.source.nodeId,
          targetIdCard: data.target.nodeId,
          sourceNodeId: data.source.nodeId,
          targetNodeId: data.target.nodeId,
          dimensionList
        };
        this.$refs.detailInfo.isVisible = true;
      }
    },
    handleDel(row) {
      this.historyLoading = true;
      delAnalysis({
        relativeId: row.relativeId
      }).then(data => {
        if (data.code == 0) {
          this.$message.success("删除成功");
          this.analysisHistory();
        }
      });
    },
    lookDetails(row) {
      this.$refs.detailInfo.isVisible = true;
      this.row = row;
    },
    onPageChange(current, size) {
      this.current = current;
      this.size = size;
    },
    filterSubmit(params) {
      let dimensionality = [];
      this.initCondition();
      params.map(value => {
        dimensionality.push(value.id);
        value.conditions.map(item => {
          this.condition[item.key] = item.value;
        });
      });
      this.condition.dimensionality = dimensionality.join(",");
      this.condition.dimensionality = this.condition.dimensionality
        ? this.condition.dimensionality
        : null;
      this.getNetWork();
    },
    intimacyRangeChange(range) {
      this.condition.intimacyRange = range;
      this.getNetWork();
    },
    initCondition() {
      this.condition.airplaneCount = null;
      this.condition.busCount = null;
      this.condition.callAmount = null;
      this.condition.callCount = null;
      this.condition.dimensionality = null;
      this.condition.liveCount = null;
      this.condition.trainCount = null;
      this.condition.transferAmount = null;
      this.condition.transferCount = null;
    },
    // 分析记录
    analysisHistory() {
      this.dialogVisible = true;
      this.historyLoading = true;
      this.title = "分析记录";
      getAnalysisList({
        caseId: this.$route.query.dabh,
        querySaveType: 1
      }).then(data => {
        this.historyLoading = false;
        if (data.code == 0) {
          this.historyTabe = data.data;
        }
      });
    },
    openSave() {
      this.dialogVisible = true;
      this.title = "保存分析";
    },
    dateChange(value) {
      this.condition.startTime = value && value[0] ? value[0] : null;
      this.condition.endTime = value && value[1] ? value[1] : null;
      this.getNetWork();
    },
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          saveAnalysisList({
            caseId: this.$route.query.dabh,
            content: " ",
            queryCriteria: JSON.stringify(this.condition),
            querySaveType: 1,
            title: this.ruleForm.title,
            desc: this.ruleForm.desc
          })
            .then(data => {
              this.dialogVisible = false;
              if (data.code == 0) {
                this.$message.success("保存成功");
              }
            })
            .catch(() => {
              this.dialogVisible = false;
            });
        } else {
          return false;
        }
      });
    },
    // 开始分析
    startAnalysis(persons) {
      if (persons.length == 1) {
        this.$message.warning("请选择多个分析对象");
        return;
      }
      this.condition.idCards = [];
      persons.forEach(el => {
        this.condition.idCards.push({
          idCard: el.zjhm ? el.zjhm : el.tyshxydm
        });
      });
      this.getNetWork();
    },

    nodeClick(info) {
      this.filterVisible = false;
      this.nodeVisible = true;
      this.nodeInfo = info;
    },
    filterClick() {
      this.filterVisible = true;
      this.nodeVisible = false;
    },
    getNetWork() {
      this.loading = true;
      network(this.condition)
        .then(res => {
          this.loading = false;
          if (res.data) {
            this.results = res.data;
          } else {
            this.results = { nodeInfos: [], relationVOS: [] };
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getNetWork();
    getSAObjectByDABH(this.$route.query).then(res => {
      this.all = res.data;
    });
  }
};
</script>

<style lang="scss" scoped></style>
