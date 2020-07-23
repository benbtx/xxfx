<template>
  <div slot="info" v-if="visible" class="nodeDetail">
    <div class="detail_top">
      <div class="detail_top_text">节点详情</div>
      <i class="el-icon-close" @click="close"></i>
    </div>
    <kr-section-title title="基本信息"></kr-section-title>
    <div class="basicInfoContainer">
      <div class="basicInfo">
        <div class="basicInfo_left">
          <img :src="nodedetail.avatar" width="80" height="80" />
        </div>
        <dir class="basicInfo_right">
          <div v-if="nodeInfo.nodeType == '00'" class="basicInfo_right_first">
            <i class="el-icon-user-solid"></i>
            <span class="basicInfo_name">{{ nodeInfo.realName }}</span>
            <div
              :class="
                                nodeInfo.sex == '男'
                                    ? 'basicInfo_sex_man'
                                    : 'basicInfo_sex_woman'
                            "
            >{{ nodeInfo.sex }}</div>
            <div class="basicInfo_age">{{ nodeInfo.age }}</div>
          </div>
          <div v-if="nodeInfo.nodeType == '00'" style="white-space:nowrap;margin-top: 10px">
            <span class="basicInfo_name">
              <kr-icon icon="icon-Id" class="id-card"></kr-icon>
              {{ nodeInfo.idCard }}
            </span>
          </div>
          <div v-else class="basicInfo_right_first">相关单位名称</div>
          <div v-if="nodeInfo.nodeType == '01'" class="basicInfo_right_second">
            <i class="el-icon-postcard"></i>
            <span class="basicInfo_id">{{ nodeInfo.idCard }}</span>
          </div>
          <div class="basicInfo_right_second" v-if="nodeInfo.nodeType == '01'">
            <span class="register_id">注册号:123123123123</span>
          </div>
          <el-button class="detail_button" size="mini">档案详情</el-button>
        </dir>
      </div>

      <div v-if="nodeInfo.nodeType == '00'" class="basicInfo_address">
        <p>
          <span>所在单位：</span>
          {{ nodeInfo.organization }}
        </p>
        <p>
          <span>担任职务：</span>
          {{ nodeInfo.position }}
        </p>
      </div>
      <div v-else class="basicInfo_address">
        <p>
          <span>法人：</span>
          {{ nodeInfo.address }}
        </p>
        <p>
          <span>身份证号：</span>
          {{ nodeInfo.idCard }}
        </p>
      </div>
    </div>
    <kr-section-title title="标签"></kr-section-title>
    <!-- <div class="labelList">
      <el-button
        v-for="(item, index) in nodedetail.labelList"
        :key="index"
        :type="item.color"
        :class="index ? '' : 'options_button'"
      >{{ item.name }}</el-button>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "node-details",
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    nodeInfo: {
      type: Object
    }
  },
  data() {
    return {
      nodedetail: {
        type: 2,
        avatar:
          "http://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/267f9e2f07082838685c484ab999a9014c08f11f.jpg",
        name: "王五",
        sex: "男",
        age: 23,
        idCard: "528288373734747",
        address: "四川科瑞公司",
        position: "前端开发",
        labelList: [
          { name: "青春派别", color: "success" },
          { name: "宅男至上", color: "primary" },
          { name: "二次元", color: "danger" },
          { name: "异世界", color: "primary" },
          { name: "科技纪元", color: "primary" }
        ]
      }
    };
  },
  methods: {
    close() {
      this.$emit("update:visible", !this.visible);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.id-card {
  color: $color-primary;
}
.detail_button {
  margin-top: 10px;
}
.nodeDetail {
  width: 250px;
  height: 710px;
  font-size: 15px;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(10, 16, 20, 0.44);
  .detail_top {
    display: flex;
    height: 40px;
    width: 250px;
    font-size: 14px;
    justify-content: space-between;
    background-color: rgba(7, 33, 72, 1);
    padding: 10px 15px;
    margin-bottom: 15px;
    color: #fff;
    .el-icon-close {
      font-size: 12px;
      padding-top: 5px;
      cursor: pointer;
    }
  }
  .basicInfoContainer {
    font-size: 12px;
    padding: 20px 15px 0;
    border-bottom: 1px solid rgba(7, 33, 72, 0.1);
    margin-bottom: 15px;
    .basicInfo {
      display: flex;
      .basicInfo_right {
        width: 132px;
        margin-left: 10px;
        .basicInfo_right_first {
          height: 20px;
          display: flex;
          font-size: 14px;
          align-items: center;
          .el-icon-user-solid {
            color: $color-primary;
            font-size: 18px;
          }
          .basicInfo_name,
          .basicInfo_sex_man,
          .basicInfo_sex_woman,
          .basicInfo_age {
            margin-left: 8px;
          }
          .basicInfo_sex_man {
            background-color: $color-primary;
          }
          .basicInfo_sex_woman {
            background-color: #f76260;
          }
          .basicInfo_age {
            background-color: #3ccacf;
          }
          .basicInfo_sex_woman,
          .basicInfo_sex_man,
          .basicInfo_age {
            width: 16px;
            text-align: center;
            color: #fff;
            border-radius: 2px;
            font-size: 12px;
          }
        }
        .basicInfo_right_second {
          display: flex;
          align-items: flex-end;
          margin: 10px 0;
          .el-icon-postcard {
            color: $color-primary;
            font-size: 16px;
          }
          .basicInfo_id {
            font-size: 12px;
            margin-left: 5px;
          }
          .register_id {
            font-size: 12px;
          }
        }

        .el-button {
          color: $color-primary;
          border-color: #8ac8ff;
          padding: 5px 10px;
          font-size: 14px;
        }
      }
    }
    .basicInfo_address {
      margin: 15px 0;
      p {
        padding: 5px 0;
        font-size: 12px;
        span {
          color: #a3a7b7;
        }
      }
    }
  }
  .labelList {
    padding: 15px 15px 0;
    .options_button {
      margin-left: 10px;
    }
    .el-button {
      margin-top: 10px;
      padding: 10px 15px;
    }
  }
}
</style>
