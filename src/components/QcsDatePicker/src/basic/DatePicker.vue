<template>
  <div
    :class="['zl-select-date-picker-container', 'date-picker--' + tabPosition]"
    :style="containerStyle"
  >
    <div class="tab-wrapper" :style="wrapperStyle">
      <el-button
        class="el-icon-d-arrow-left pager-arrow"
        :style="arrowStyle"
        round
        :disabled="prevYearDisabled"
        @click="scrollHandler('left')"
      ></el-button>
      <ul

        class="tab-list"
        :style="{ '--column': tabColumn, '--space': `${tabSpace}px` }"
      >
        <li
          class="tab-item"
          :class="['tab-item-' + tabIndex, { 'is-active': activeTab === tab }]"
          :style="tabItemStyle"
          :key="tab"
          v-for="(tab, tabIndex) in pageTabList"
        >
          <el-button
            type="text"
            size="small"
            @click.stop="handleTabClick(tab, defaultDate)"
            :disabled="yearDisabled(tab)"
            >{{ tab }}年</el-button
          >
        </li>
      </ul>
      <el-button
        class="el-icon-d-arrow-right pager-arrow"
        :style="arrowStyle"
        round
        :disabled="nextYearDisabled"
        @click="scrollHandler('right')"
      ></el-button>
    </div>
    <!-- <el-divider :direction="direction"></el-divider> -->
    <div class="date-wrapper">
      <template v-if="openAnnual">
        <div
          class="date-item date-item-whole"
          :key="child.id"
          v-for="child in dateData[0]"
        >
          <el-button
            @click.stop="handleDateClick(child, 'noMove')"
            type="text"
            :class="[activeId === child.id ? 'is-selected' : '']"
            :disabled="dateDisabledMethod(child)"
            >{{ child.label }}</el-button
          >
        </div>
      </template>

      <ul class="date-list">
        <li class="date-item" :key="item.id" v-for="item in formatterDateData">
          <div
            class="item-wrapper"
            :key="child.type + child.value"
            v-for="child in item"
            :style="{ '--space': `${dateSpace}px` }"
          >
            <el-button
              @click.stop="handleDateClick(child, 'noMove')"
              type="text"
              :class="[activeId === child.id ? 'is-selected' : '']"
              :disabled="dateDisabledMethod(child)"
              >{{ child.label }}</el-button
            >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Emitter from "element-ui/src/mixins/emitter";
import { convertToChinaNum, isEmptyObject, getDateInfo } from  "@/utils/dataqx";

export default {
  mixins: [Emitter],
  componentName: "DatePicker",
  props: {
    tabList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    selectLabel: {
      type: String,
      default: "",
    },
    //位置
    tabPosition: {
      type: String,
      default: "left",
    },
    //列数
    tabColumn: {
      type: Number,
      default: 2,
    },
    //跨度
    tabStep: {
      type: Number,
      default: 6,
    },
    //tab 间距
    tabSpace: {
      type: Number,
      default: 0,
    },
    //date 间距
    dateSpace: {
      type: Number,
      default: 0,
    },
    //日期类型
    dateType: {
      type: String,
      default: "month",
    },
    //是否展示全年
    openAnnual: {
      type: Boolean,
      default: true,
    },
    //默认的时间
    value: {},
    //是否开启 默认禁用状态
    openDisabled: {
      type: Boolean,
      default: true,
    },
    //自定义 禁用方法
    disabledDate: {},
    //日期限制选项
    dateLimitOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  //   inject: ["select"],
  data() {
    return {
      activeTab: new Date().getFullYear(),
      activeId: null,
      defaultYear: new Date().getFullYear(),
      dateData: [
        [{ id: "1-1", label: "全年", type: "year", value: "" }],
        [
          { id: "2-1", label: "第一季度", type: "quarter", value: 1 },
          { id: "2-2", label: "第二季度", type: "quarter", value: 2 },
          { id: "2-3", label: "第三季度", type: "quarter", value: 3 },
          { id: "2-4", label: "第四季度", type: "quarter", value: 4 },
        ],
        [
          { id: "3-1", label: "1月", type: "month", value: 1 },
          { id: "3-4", label: "4月", type: "month", value: 4 },
          { id: "3-7", label: "7月", type: "month", value: 7 },
          { id: "3-10", label: "10月", type: "month", value: 10 },
        ],
        [
          { id: "3-2", label: "2月", type: "month", value: 2 },
          { id: "3-5", label: "5月", type: "month", value: 5 },
          { id: "3-8", label: "8月", type: "month", value: 8 },
          { id: "3-11", label: "11月", type: "month", value: 11 },
        ],
        [
          { id: "3-3", label: "3月", type: "month", value: 3 },
          { id: "3-6", label: "6月", type: "month", value: 6 },
          { id: "3-9", label: "9月", type: "month", value: 9 },
          { id: "3-12", label: "12月", type: "month", value: 12 },
        ],
      ],
    };
  },
  computed: {
    //方向
    direction() {
      const position = this.tabPosition;
      if (position === "top" || position === "bottom") {
        return "horizontal";
      } else {
        return "vertical";
      }
    },
    containerStyle() {
      const position = this.tabPosition;
      const minWidth = this.$parent.minWidth;
      let direction = "row";
      if (position === "left") {
        direction = " row";
      } else if (position === "right") {
        direction = "row-reverse ";
      } else if (position === "top") {
        direction = "column ";
      } else {
        direction = "column-reverse";
      }
      return `flex-direction: ${direction};min-width: ${minWidth}`;
    },
    wrapperStyle() {
      const direction = this.direction;
      const position = this.tabPosition;
      const dire =
        position === "top"
          ? "bottom"
          : position === "bottom"
          ? "top"
          : position === "left"
          ? "right"
          : "left";
      return {
        "flex-direction": direction === "horizontal" ? "row" : "column",
        [`border-${dire}`]: "1px solid rgba(0, 0, 0, 0.06)",
      };
    },
    //上翻按钮禁用
    prevYearDisabled() {
      let firstDate = this.pageTabList?.[0];
      let { min } = this.dateLimitOptions || {};
      min = min ? new Date(min).getFullYear() : null;
      return min && firstDate <= min;
    },
    //下翻按钮禁用
    nextYearDisabled() {
      let lastDate = this.pageTabList?.[this.pageTabList.length - 1];
      let { max } = this.dateLimitOptions || {};
      max = max ? new Date(max).getFullYear() : null;
      return max && lastDate >= max;
    },
    //箭头样式
    arrowStyle() {
      const direction = this.direction;
      if (direction === "vertical") {
        return "transform:rotateZ(90deg);";
      }
      return "";
    },
    tabStyle() {
      const tabColumn = this.tabColumn;
      return `width: ${tabColumn * 80 + 10}px;`;
    },
    tabItemStyle() {
      const direction = this.direction;
      let minWidth = this.$parent?.minWidth?.replace("px", "") || 0; //TODO: 计算属性里不要使用vNode
      minWidth = Math.abs(minWidth - 60) / this.tabStep;
      return {
        minWidth: direction === "horizontal" ? `${minWidth}px` : null,
        display: direction === "horizontal" ? "inline-block" : null,
      };
    },
    pageTabList() {
      const tab = this.defaultYear;
      return Array(this.tabStep)
        .fill(1)
        .map((item, index) => {
          return tab - (this.tabStep - 1) + index;
        });
    },
    //将默认的时间转为时间对象 {year,quarter,month}
    defaultDate() {
      if (this.value && !Array.isArray(this.value)) {
        let { year, quarter } = getDateInfo(this.value);
        return {
          year,
          quarter,
          month: 0,
        };
      } else {
        return {};
      }
    },
    formatterDateData() {
      const dateData = this.dateData;
      const dateType = this.dateType;
      if (dateType === "quarter") {
        return dateData.slice(1, 2);
      }
      return dateData.slice(1);
    },
  },
  watch: {
    defaultDate() {
      this.defaultSetting();
    },
  },
  mounted() {
    this.defaultSetting();
  },
  methods: {
    //默认设置
    defaultSetting() {
      this.defaultYear = isEmptyObject(this.defaultDate)
        ? new Date().getFullYear()
        : this.defaultDate.year;
      const { tabList, selectLabel } = this;
      //   if (tabList.length === 0) {
      //     return;
      //   }
      function getFirstDate(result) {
        if (!item.children) return;
        // 按照 年 季度 月度排序
        item.children.sort((a, b) => {
          if (a.quarter === b.quarter) {
            return a.month - b.month;
          } else {
            return a.quarter - b.quarter;
          }
        });
        return item.children.length > 0 ? item.children[0] : null;
      }
      let defaultDate = this.defaultDate;
      if (isEmptyObject(this.defaultDate) && tabList.length > 0) {
        let current =
          tabList.find((item) => item.year == new Date().getFullYear()) ||
          tabList[0]; // 当前年的数据或数组的第一个数据
        defaultDate = getFirstDate(current) || {};
      }
      //   let formatterValue = this.formatter(defaultDate);
      this.handleTabClick(defaultDate.year, defaultDate);
    },
    getInitDate(item) {
      if (item.quarter > 0) {
        return `2-${item.quarter}`;
      } else if (item.month > 0) {
        return `3-${item.month}`;
      } else {
        return "1-1";
      }
    },
    // //格式化
    // formatter(item) {
    //   if (item.month > 0 || item.type === "month") {
    //     return {
    //       value: `${item.year},0,${item.month}`,
    //       label: `${item.year}年第${convertToChinaNum(item.month)}月度`,
    //     };
    //   } else if (item.quarter > 0 || item.type === "quarter") {
    //     return {
    //       value: `${item.year},${item.quarter},0`,
    //       label: `${item.year}年第${convertToChinaNum(item.quarter)}季度`,
    //     };
    //   } else if (item.year > 0 || item.type === "year") {
    //     return {
    //       value: `${item.year},0,0`,
    //       label: `${item.year}年度`,
    //     };
    //   } else {
    //     return {
    //       value: "",
    //       label: "",
    //     };
    //   }
    // },
    //初始化默认禁用
    // initDisabled(list = []) {
    //     this.dateData.forEach((parent) =>
    //         parent.forEach((child) => (child.disabled = true))
    //     );
    //     list.map((item) => {
    //         if (item.quarter === 0 && item.month === 0) {
    //             this.dateData[0][0].disabled = false;
    //         } else if (item.quarter === 0) {
    //             let sortIndex =
    //                 item.month % 3 === 1
    //                     ? 2
    //                     : item.month % 3 === 2
    //                         ? 3
    //                         : item.month % 3 === 0
    //                             ? 4
    //                             : 0;
    //             this.dateData[sortIndex].find((d) => {
    //                 if (d.value == item.month) {
    //                     d.disabled = false;
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //         } else if (item.month === 0) {
    //             this.dateData[1].find((d) => {
    //                 if (d.value == item.quarter) {
    //                     d.disabled = false;
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //         }
    //     });
    // },
    yearDisabled(item) {
      return this.dateDisabledMethod({ value: item, type: "year" });
    },
    //禁用
    dateDisabledMethod(item) {
      const disabledDate = this.disabledDate;
      //TODO：存在日期补0和不补0的时间戳不一样的情况
      if (typeof disabledDate === "function") {
        const year =
          item.type == "year" ? item.value || this.activeTab : this.activeTab;
        let time = new Date(),
          timeMin = new Date(),
          quarter = 0;
        if (item.type == "year") {
          time = new Date(`${year}-12-31 23:59:59`);
          timeMin = new Date(`${year}-1-1 00:00:00`);
          quarter = 12;
        } else {
          let month = item.type == "quarter" ? item.value * 3 : item.value;
          let day = new Date(year, month, 0).getDate();
          let monthMin =
            item.type == "quarter" ? 3 * item.value - 2 : item.value;
          time = new Date(`${year}-${month}-${day} 23:59:59`);
          timeMin = new Date(`${year}-${monthMin}-1 00:00:00`);
          quarter = item.value;
        }
        return year
          ? disabledDate(time, timeMin, { year, quarter, type: item.type })
          : true;
        // return year ? disabledDate(`${year}-${item.value}`, item.type) : true;
      }
      return false;
    },
    //tab 点击
    handleTabClick(year, defaultDate) {
      let item = this.tabList.find((item) => item.year == year);
      this.activeTab = year;
      // this.openDisabled && this.initDisabled(item ? item.children : []);
      if (this.activeTab === defaultDate.year) {
        this.activeId = this.getInitDate(defaultDate);
      } else {
        this.activeId = null;
      }
      //   //自定义禁用方法
      //   if (typeof this.disabledMethod === "function") {
      //     this.dateData.map((parent, index) => {
      //       parent.map((item) => {
      //         item.disabled = this.disabledMethod(
      //           `${this.activeTab}-${item.value}`,
      //           item.type
      //         );
      //       });
      //     });
      //   }
    },
    //点击日期
    handleDateClick(item) {
      const { activeTab, selectLabel, dateType } = this;
      this.activeId = item.id;
      //   let formatterValue = this.formatter({
      //     ...item,
      //     year: activeTab,
      //     quarter: item.type === "quarter" ? item.value : 0,
      //     month: item.type === "month" ? item.value : 0,
      //   });
      this.$emit(
        "pick",
        new Date(
          `${activeTab}-${
            item.type === "quarter" ? item.value * 3 : item.value
          }-1`
        )
      );
      //   this.dispatch("ZlSelect", "handleDateClick", [
      //     {
      //       ...this,
      //       value: formatterValue.value,
      //       //   item: {
      //       //     year: activeTab,
      //       //     quarter: item.type === "quarter" ? item.value : 0,
      //       //     month: item.type === "month" ? item.value : 0
      //       //   },
      //       currentLabel: `${formatterValue.label}${selectLabel}`,
      //     },
      //     true,
      //   ]);
    },
    //年份切换
    scrollHandler(direction) {
      if (direction === "left") {
        this.defaultYear -= this.tabColumn;
      } else {
        this.defaultYear += this.tabColumn;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.zl-select-date-picker-container {
  display: flex;
  justify-content: flex-start;
  overflow: hidden;

  /** tab */
  .tab-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    padding: 10px;

    :deep(.el-button.pager-arrow) {
      padding: 8px;
      border: transparent;
    }
  }

  .tab-list {

    // display: flex;
    // flex-wrap: wrap;
    display: grid;
    grid-template-columns: repeat(var(--column, 2), 1fr);
    gap: var(--space, 0) 0;
    transition: all 1s ease-out;
    overflow: hidden;
    .tab-item {
      width: 80px;
      //   height: 32px;
      //   line-height: 32px;
      text-align: center;

      &.is-active {
        background: #f7f7f7;

        .el-button {
          color: #409eff;
        }
      }

      //   &:hover {
      //     color: #409eff;
      //   }
    }
  }

  /** date */
  .date-wrapper {
    flex: 1;
   padding: 0;
     text-align: left;
  }
  .date-list {
    display: flex;
    flex-direction: row;
    padding: 0;
     text-align: left;

    // flex: 1;
    // padding: 10px 15px;
  }

  .date-item {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    &:not(.date-item-whole) {
      align-items: center;
    }

    &.data-item-whole {
      align-items: flex-start;
      text-align: center;
    }

    // &:not(:first-child) .item-wrapper {
    //   text-align: center;
    // }
    .item-wrapper {
      min-width: 60px;
      text-align: center;
    }
    .item-wrapper + .item-wrapper {
      margin-top: var(--space, 0);
    }
  }

  /**common */
  .tab-list,
  .date-list {
    list-style: none;
  }

  .tab-item .el-button,
  .date-item .el-button {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);

    &:hover {
      color: #409eff;
    }

    &.is-selected {
      color: #409eff;
      font-weight: 600;
    }

    &.is-disabled,
    &.is-disabled:hover {
      color: #c0c4cc;
    }
  }
}
</style>
