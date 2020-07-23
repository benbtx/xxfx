<template>
  <div :class="$style.title">
    <div :class="$style.inner">
      <div :class="$style.sign" :style="{ height: `${size}px` }"></div>
      <div :class="$style.text" :style="txtStyle">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "kr-section-title",

  props: {
    title: {
      type: String
    },

    color: {
      type: String
    },

    bold: {
      type: Boolean,
      default: false
    },

    size: {
      type: Number,
      default: 14
    },

    textStyle: {
      type: Object
    }
  },

  computed: {
    txtStyle() {
      if (this["textStyle"] && Object.keys(this["textStyle"]).length) {
        // 有自定义标体样式直接返回
        return this.textStyle;
      } else {
        let obj = {};
        // 颜色
        if (this.color) {
          obj.color = this.color;
        }
        // 粗细
        if (this.bold) {
          obj.fontWeight = "bold";
        } else {
          obj.fontWeight = "normal";
        }
        // 字大小
        if (this.size) {
          obj.fontSize = `${this.size}px`;
        }

        return obj;
      }
    }
  }
};
</script>

<style lang="scss" module>
// .title {
//   $height: 18px;

//   font-weight: bold;
//   font-size: $height;
//   user-select: none;

//   &::before {
//     content: "";
//     display: inline-block;
//     vertical-align: -2px;
//     margin-right: 10px;
//     width: 4px;
//     height: $height;
//     background: #1890ff;
//   }
// }

.title {
  display: block;
  .inner {
    display: flex;
    align-items: center;

    .sign {
      width: 3px;
      background: #1490ff;
    }

    .text {
      margin-left: 10px;
      color: #333;
    }
  }
}
</style>
