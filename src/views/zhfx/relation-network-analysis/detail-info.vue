<template>
  <el-dialog
    :visible.sync="isVisible"
    :close-on-click-modal="false"
    top="2vh"
    @close="close"
    @open="open"
    title="查看详情"
    width="1140px"
  >
    <el-tabs v-model="optionValue" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="(item, index) in optionList" :key="index" :label="item" :name="item"></el-tab-pane>
    </el-tabs>
    <div v-if="optionValue == '银行卡转账'" class="query_select">
      <el-input
        v-model.number="transferForm.amount"
        clearable
        placeholder="请输入交易金额"
        class="iput-normal-width"
        @change="onKeyUp"
      ></el-input>
      <div class="block">
        <el-date-picker
          v-model="period"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width:230px;margin-left:30px"
          value-format="yyyyMMdd"
          @change="deteChange"
        ></el-date-picker>
      </div>
      <el-time-picker
        is-range
        arrow-control
        v-model="time"
        range-separator="~"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围"
        style="width:230px;margin-left:30px"
        value-format="hh:mm:ss"
        @change="deteChange"
      ></el-time-picker>
      <el-select
        v-model="transferForm.transferType"
        v-if="false"
        clearable
        disabled
        class="iput-normal-width"
        style="margin-left: 30px"
        placeholder="交易类型"
      >
        <el-option
          v-for="item in transferType_options"
          :label="item.label"
          :value="item.value"
          :key="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 10px" icon="el-icon-search " @click="query">搜索</el-button>
    </div>
    <kr-table
      :total="total"
      :rows="table"
      :columns="columns"
      :current="current"
      @on-page-change="onPageChange"
    ></kr-table>
  </el-dialog>
</template>

<script>
import {
  colleague,
  live,
  train,
  bus,
  fly,
  transfer,
  family,
  invest
} from "../../../api/zhfx/relation-network";
export default {
  name: "details-info",
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      isVisible: false,
      transferForm: {
        startPeriod: null,
        endPeriod: null,
        transferType: null,
        amount: "",
        startTime: null,
        endTime: null
      },
      period: "",
      time: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      optionValue: "",
      optionList: [],
      transferType_options: [
        {
          value: "1",
          label: "转账"
        },
        {
          value: "2",
          label: "过户"
        },
        {
          value: "3",
          label: "洗钱"
        },
        {
          value: "4",
          label: "提现"
        }
      ],
      total: 0,
      pageNum: 0,
      pageSize: 10,
      columns: [],
      table: [],
      current: 1
    };
  },
  computed: {},
  methods: {
    query() {
      this.transferForm.amount = this.transferForm.amount || null;
      transfer({
        ...this.transferForm,
        dabh: this.$route.query.dabh,
        sourceIdCard: this.row.sourceIdCard,
        targetIdCard: this.row.targetIdCard,
        sourceNodeId: this.row.sourceNodeId,
        targetNodeId: this.row.targetNodeId,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        let { rows, total } = res.data;
        this.table = this.filterData(rows);
        this.total = total;
      });
    },
    open() {
      this.optionList = this.row.dimensionList;
      this.optionValue = this.optionList[0];
      this.getDimensionInfo(this.optionList[0]);
    },
    close() {
      this.clearTable();
    },
    deteChange() {
      if (this.time) {
        this.transferForm.startTime = this.time[0];
        this.transferForm.endTime = this.time[1];
      } else {
        this.transferForm.startTime = null;
        this.transferForm.endTime = null;
      }
      if (this.period) {
        this.transferForm.startPeriod = this.period[0];
        this.transferForm.endPeriod = this.period[1];
      } else {
        this.transferForm.startPeriod = null;
        this.transferForm.endPeriod = null;
      }
    },
    clearTable() {
      this.table = [];
      this.columns = [];
      this.pageNum = 0;
      this.pageSize = 10;
    },
    handleClick(tab) {
      this.currentTab = tab.name;
      this.clearTable();
      this.getDimensionInfo(tab.name);
    },
    onPageChange(pageNum, pageSize) {
      this.current = pageNum;
      this.pageNum = pageNum - 1;
      this.pageSize = pageSize;
      this.getDimensionInfo(this.optionValue);
    },
    onKeyUp() {
      this.transferForm.amount = this.transferForm.amount.replace(
        /[^\d.]/g,
        ""
      );
    },
    filterData(data) {
      data.map(row => {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            row[key] = row[key] != null && row[key] != "null" ? row[key] : "";
          }
        }
        return row;
      });
      return data;
    },
    getDimensionInfo(key) {
      switch (key) {
        case "同事":
          this.columns = [
            {
              title: "姓名",
              key: "xm"
            },
            { title: "证件号码", key: "zjhm" },
            { title: "统一社会信用代码", key: "tyshxydm" },
            { title: "职务", key: "zw" }
          ];
          colleague({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;

        case "同住":
          this.columns = [
            {
              title: "姓名",
              key: "xm"
            },
            { title: "性别", key: "xb" },
            { title: "证件号码", key: "sfzmhm" },
            { title: "入住时间", key: "rzsj" },
            { title: "退房时间", key: "tfsj" },
            { title: "旅店名称", key: "ldmc" },
            { title: "旅店详细地址", key: "ldxxdz" },
            { title: "住宿时长", key: "duration" }
          ];
          live({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;

        case "同行-火车":
          this.columns = [
            {
              title: "车号",
              key: "ch"
            },
            { title: "发车日期", key: "fcrq" },
            { title: "对方车厢号", key: "dfcxh" },
            { title: "对方到站", key: "dfdz" },
            { title: "对方发站", key: "dffz" },
            { title: "对方证件号码", key: "dfsabh" },
            { title: "对方姓名", key: "dfxm" },
            { title: "对方座位号", key: "dfzwh" }
          ];
          train({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        case "银行卡转账":
          this.columns = [
            {
              title: "名称",
              key: "mc"
            },
            { title: "交易余额", key: "ye" },
            { title: "证件号码", key: "zjhm" },
            { title: "交易网点名称", key: "jywdmc" },
            { title: "交易时间", key: "jysj" },
            { title: "交易日期", key: "jyrq" },
            { title: "交易类型", key: "jylx" },
            { title: "交易流水号", key: "jylsh" },
            { title: "交易发生地", key: "jyfsd" },
            { title: "交易对手余额", key: "jydsye" },
            { title: "对方证件号", key: "jydfzjhm" },
            { title: "交易对方名称", key: "jydfxm" },
            { title: "对方卡号", key: "jydfkh" },
            { title: "交易金额", key: "je" }
          ];
          transfer({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        case "同行-大巴":
          this.columns = [
            {
              title: "班车车型",
              key: "bccx"
            },
            { title: "班次号", key: "bch" },
            { title: "班次类型", key: "bclx" },
            { title: "乘车人姓名", key: "ccrxm" },
            { title: "车牌号", key: "cph" },
            { title: "对方乘车人姓名", key: "dfccrxm" },
            { title: "对方目的地名称", key: "dfmddmc" },
            { title: "目的地名称", key: "mddmc" },
            { title: "始发车站名称", key: "sfczmc" },
            { title: "证件号码", key: "zjhm" },
            { title: "座位号", key: "zwh" },
            { title: "发车日期", key: "fcrq" }
          ];
          bus({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        case "同户":
          this.columns = [
            {
              title: "姓名",
              key: "xm"
            },
            { title: "性别", key: "xb" },
            { title: "所属省市县", key: "ssssxq" },
            { title: "与户主关系", key: "yhzgx" },
            { title: "身份证号", key: "zjhm" },
            { title: "住址详址", key: "zzxz" },
            { title: "对方姓名", key: "dfxm" },
            { title: "对方性别", key: "dfxb" },
            { title: "对方籍贯省市县", key: "dfjgssxq" },
            { title: "对方与户主关系", key: "dfyhzgx" },
            { title: "对方身份证号", key: "dfzjhm" },
            { title: "对方住址详址", key: "dfzzxz" },
            { title: "籍贯国家", key: "jggjdq" }
          ];
          family({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        case "同行-飞机":
          this.columns = [
            { title: "旅客姓名", key: "lkxm" },
            { title: "旅客座位信息", key: "lkzwxx" },
            { title: "性别", key: "xb" },
            { title: "证件号码", key: "zjhm" },
            { title: "离港时间", key: "lgsj" },
            { title: "离港日期", key: "lgrq" },
            { title: "航班号", key: "hbh" },
            { title: "对方旅客姓名", key: "dflkxm" }
          ];
          fly({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        case "投资":
          this.columns = [
            {
              title: "股东姓名",
              key: "gdxm"
            },
            { title: "企业名称", key: "qymc" },
            { title: "认缴出资日期", key: "rjczrq" },
            { title: "认缴出资金额（万元）", key: "rjczjewy" },
            { title: "认缴出资时间", key: "rjczsj" },
            { title: "统一社会信用代码", key: "tyshxydm" },
            { title: "证件号码", key: "zjhm" },
            { title: "证照号码", key: "zzhm" }
          ];
          invest({
            dabh: this.$route.query.dabh,
            sourceIdCard: this.row.sourceIdCard,
            targetIdCard: this.row.targetIdCard,
            sourceNodeId: this.row.sourceNodeId,
            targetNodeId: this.row.targetNodeId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }).then(res => {
            let { rows, total } = res.data;
            this.table = this.filterData(rows);
            this.total = total;
          });
          return;
        default:
          return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.query_select {
  display: flex;
}
</style>
