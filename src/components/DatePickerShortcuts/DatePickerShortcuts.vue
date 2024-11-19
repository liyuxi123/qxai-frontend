<template>
  <QcsDatePicker
    ref="datePicker"
    v-model="dateValue"
    :default-value="defaultValue"
    :format="textFormat"
    :value-format="valueFormat"
    class="date-picker-shortcut color-active"
    popper-class="date-picker-shortcut-popper"
    placeholder="请选择"
    size="small"
    :clearable="false"
    :editable="false"
    :picker-options="pickerOptions"
    :type="datePickerType"
    is-custom
    is-single-panel
    :date-limit-options="$attrs['date-limit-options']"
    :key="tabKey"
    :disabled="disabled"
    confirmable
    @close="(val) => (datePickerType = val)"
    @change="handleChange"

  >
    <template #sidebar>
      <div class="el-picker-panel__sidebar">
        <!-- wrapStyle="max-height: 250px;" -->
        <el-scrollbar class="el-picker-panel_scrollbar">
          <ul class="shortcut-panel-sidebar">
            <li
              :class="[
                'panel-item',
                {
                  'is-active':
                    datePickerType === shortcut.trueValue ||
                    datePickerType === shortcut.value,
                },
              ]"
              v-for="(shortcut, key) in shortcutList"
              :key="key"
            >
              <el-button
                class="panel-item-button"
                :disabled="shortcutsDisabled(shortcut.value)"
                @click="handleShortcutClick(shortcut)"
                >{{ shortcut.text }}</el-button
              >
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </template>
  </QcsDatePicker>
</template>

<script>
import { getDateInfo, isEmptyObject, getWeekDates } from "@/utils/dataqx";
import QcsDatePicker from "@/components/QcsDatePicker";
const week = new Date().getDay();
const shortcutConfig = [
  {
    text: "年度",
    value: "year",
    onClick(picker) {
      picker.$emit("toggle-panel", "year");
    },
  },
  {
    text: "季度",
    value: "quarter",
    onClick(picker) {
      picker.$emit("toggle-panel", "quarter");
    },
  },
  {
    text: "月度",
    value: "month",
    onClick(picker) {
      picker.$emit("toggle-panel", "month");
    },
  },
  {
    text: "年累计",
    value: "monthRange",
    onClick(picker) {
      picker.$emit("toggle-panel", "monthRange");
    },
  },
  {
    text: "年累计(当月)",
    value: "dateRange",
    fixedValue: true,
    onClick(picker) {
      picker.$emit("toggle-panel", "dateRange");
    },
  },
  {
    text: "月累计",
    value: "monthDateRange",
    fixedValue: true,
    onClick(picker) {
      picker.$emit("toggle-panel", "monthDateRange");
    },
  },
  //周累计是 本周和上周的结合，当前日期是周一显示上周，否则显示本周
  {
    text: "周累计",
    value: "weekStage",
    trueValue: week == 1 ? "lastWeekRange" : "weekRange",
    fixedValue: true,
    onClick(picker) {
      picker.$emit("toggle-panel", week == 1 ? "lastWeekRange" : "weekRange");
    },
  },
  {
    text: "本周",
    value: "weekRange",
    fixedValue: true,
    onClick(picker) {
      picker.$emit("toggle-panel", "weekRange");
    },
  },
  {
    text: "上周",
    value: "lastWeekRange",
    fixedValue: true,
    onClick(picker) {
      picker.$emit("toggle-panel", "lastWeekRange");
    },
  },
];
const typeValidator = (value) => {
  return value.filter((item) =>
    shortcutConfig.map((item) => item.value).includes(item)
  );
};
export default {
  components: {
   QcsDatePicker
  },

  model: {
    prop: "dateInfo",
    event: "change",
  },
  props: {
    tabKey: String,
    //日期 默认的日期 格式{year:年,quarter：季,month： 月,timeStage：x月-x月, dateRange: xxx年-xx月-xx日~xxx年-xx月-xx日（可选）}
    dateInfo: {
      type: Object,
      default: () => {},
    },
    //默认日期
    defaultValue: {},
    // 日期列表
    list: {
      type: Array,
      default: () => [], // 格式[{year:年,quarter：季,month： 月,timeStage： 月度阶段性，dateRange: 日范围（可选）}]
    },
    //自定义快捷选项，格式["year","quarter","month","monthRange"]
    shortcuts: {
      type: Array,
      validator: (value) => {
        return typeValidator(value);
      },
      default: () => ["year", "quarter", "month", "monthRange"],
    },
    // 自定义快捷选项文本， 格式：[{text: "年度", value: "year", fixedValue: true & false}]fixedValue表示固定值
    shortcutOptions: {
      type: Array,
      default: () => [],
    },
    //自定义优先级: 优先级高的在前面，格式["year","quarter","month","monthRange"]
    order: {
      type: Array,
      validator: (value) => {
        return typeValidator(value);
      },
      default: () => [
        "month",
        "quarter",
        "monthRange",
        "dateRange",
        "monthDateRange",
        "weekRange",
        "lastWeekRange",
        "year",
      ],
    },
    //日期组件禁用
    disabled: Boolean,
    //日期禁用
    dateDisabled: Boolean,
    //日期禁用方法
    dateDisabledMethod: {},
  },
  data() {
    return {
      dateValue: "", //日期值
      selecting: false, // 是否选择了日期
      datePickerType: "year", //日期组件类型
      dictData: {
        year: "year",
        month: "month",
        quarter: "quarter",
        monthRange: ["monthRange", "timeStage", "stage"],
        dateRange: "dateRange",
        monthDateRange: "monthDateRange",
        weekRange: "weekRange",
        lastWeekRange: "lastWeekRange",
      },
      //日期配置项
      pickerOptions: {
        disabledDate: (time, timeMin, info) => {
          //TODO: timeMin 和 info在初始时是undefined，需要去picker里处理
          const allowedList = [
            "dateRange",
            "monthDateRange",
            "weekRange",
            "lastWeekRange",
          ];
          const pickerType = this.datePickerType;
          if (pickerType === "monthRange") {
            if (typeof time !== "object") return false;
            return time.getTime() > Date.now();
          } else if (allowedList.includes(pickerType)) {
            return false;
          } else {
            return this.disabledFunction(time, timeMin || new Date(), info);
          }
        },
      },
    };
  },
  computed: {
    //校验快捷选项
    shortcutList() {
      const { shortcuts, shortcutOptions } = this;
      return shortcutConfig
        .filter(
          (item) => shortcuts.length == 0 || shortcuts.includes(item.value)
        )
        .map((item) => {
          let config = shortcutOptions.find(
            (conf) => conf.value === item.value
          );
          return {
            ...item,
            text: config?.text || item.text,
            fixedValue: config?.fixedValue || item.fixedValue || false,
          };
        });
    },
    // 日期文本格式
    textFormat() {
      const type = this.datePickerType;
      return type === "year"
        ? "yyyy年"
        : type === "quarter"
        ? "yyyy年第Q季度"
        : type === "month"
        ? "yyyy年M月"
        : type === "monthRange"
        ? "yyyy-M月-M月"
        : type === "dateRange"
        ? "yyyy年M月d日-M月d日"
        : type === "monthDateRange"
        ? "yyyy年M月d日-d日"
        : type === "weekRange" || type === "lastWeekRange"
        ? "yyyy年M月d日-yyyy年M月d日"
        : "yyyy";
    },
    // 日期值格式
    valueFormat() {
      const type = this.datePickerType;
      return type === "year"
        ? "yyyy"
        : type === "quarter"
        ? "yyyy-Q"
        : type === "month" || type === "monthRange"
        ? "yyyy-M"
        : type === "dateRange" ||
          type === "monthDateRange" ||
          type === "weekRange" ||
          "lastWeekRange"
        ? "yyyy-M-d"
        : "yyyy";
    },
    //将日期按类别分组
    dateGroup() {
      let dateMap = new Map();
      for (let key of this.shortcuts) {
        let filterData = this.list.filter((item) => {
          return key === this.sortByPriority(item);
        });
        dateMap.set(key, filterData);
      }
      return dateMap;
    },
    //快捷选项 禁用状态
    shortcutsDisabled() {
      const dateGroup = this.dateGroup;
      return (pickerType) => {
        // if (dateGroup.hasOwnProperty(pickerType)) {
        //   return dateGroup[pickerType].list === 0;
        // } else {
        //   return true;
        // }
        return false;
      };
    },
    //这些类型固定日期的值
    fixedValueTypes() {
      return this.shortcutList
        .filter((item) => item.fixedValue)
        .map((item) => item.trueValue || item.value);
    },
    //最小日期
    minDate() {
      const type = this.datePickerType;
      if (type == "monthRange") {
        const currentDate = new Date();
        currentDate.setMonth(0, 1); // 设置月份和日期分别为当前年、0（一月）和1（一日）
        return currentDate;
      } else if (type == "dateRange") {
        return this.getFirstDayOfYear();
      } else if (type == "monthDateRange") {
        return this.getFirstDayOfMonth();
      } else {
        let value =
          type === "weekRange"
            ? new Date()
            : new Date().getTime() - 7 * 24 * 3600 * 1000;
        return getWeekDates(value).weekStartFull;
      }
    },
    //最大日期
    maxDate() {
      const type = this.datePickerType;
      if (type == "monthRange") {
        const currentDate = new Date();
        currentDate.setMonth(Math.max(currentDate.getMonth() - 1, 0), 1); // 设置月份和日期分别为当前年、（上月）和1（一日）
        return currentDate;
      } else if (type == "lastWeekRange") {
        let value = new Date().getTime() - 7 * 24 * 3600 * 1000;
        return getWeekDates(value).weekEndFull;
      } else {
        if (new Date().getDay() === 1) {
          //周一
          return new Date();
        }
        return this.getYesterday();
      }
    },
    //日期范围 当pickerType为dateRange时，显示当前年的第一天到当前天的日期范围，否则当前年当前月的第一天到当前天
    dateRange() {
      return (
        getDateInfo(this.minDate).date + "~" + getDateInfo(this.maxDate).date
      );
    },
  },
  watch: {
    dateInfo: {
      handler() {
        this.initPickerType();
      },
    },
  },
  mounted() {
    this.initPickerType();
  },
  methods: {
    //初始化
    initPickerType() {
      if (this.selecting) {
        this.selecting = false;
        return;
      }
      this.datePickerType = this.sortByPriority(this.dateInfo);
      this.dateValue = this.getDateValue();
      //采用了方案四
      //   //方案二
      //   if (
      //     this.datePickerType === "monthRange" &&
      //     Array.isArray(this.dateValue)
      //   ) {
      //     const newValue = this.dateValue.reduce((pre, curr) => {
      //       let month = new Date(curr).getMonth() + 1;
      //       return pre ? `${pre}-${month}` : month;
      //     }, "");
      //     if (newValue != this.dateInfo.timeStage) {
      //       //触发change事件重新更新日期数据
      //       setTimeout(() => {
      //         this.handleChange(this.dateValue);
      //       }, 300);
      //     }
      //   }
    },
    //日期类型优先级排序
    sortByPriority(data = {}) {
      const order = this.order;
      const dictArray = Object.entries(this.dictData);
      return (
        Object.entries(data)
          .filter(([k, v]) =>
            dictArray.some(
              ([dictKey, dictValue]) =>
                (Array.isArray(dictValue) && dictValue.includes(k)) ||
                dictValue == k
            )
          )
          .map(([k, v]) => {
            let dictKey = dictArray.find(
              ([dictKey, dictValue]) =>
                (Array.isArray(dictValue) && dictValue.includes(k)) ||
                dictValue == k
            )?.[0];
            return [dictKey || k, v];
          })
          .sort((a, b) => {
            return (
              order.findIndex((item) => item == a[0]) -
              order.findIndex((item) => item == b[0])
            );
          })
          .find(([k, v]) => v > 0 || v)?.[0] || "year"
      );
      //   const type =
      //     Object.entries(data)
      //       .sort((a, b) => {
      //         return (
      //           order.findIndex((item) => item == a[0]) -
      //           order.findIndex((item) => item == b[0])
      //         );
      //       })
      //       .find(([k, v]) => v > 0 || v)?.[0] || "year";
      //   return Object.entries(this.dictData).find(([k, v]) => v == type)?.[0];
    },
    //获取每个类型的默认时间
    getDateValue(isInitial = false) {
      const defaultValue = this.dateInfo;
      const pickerType = this.datePickerType;
      const list = this.dateGroup.get(pickerType) || [];
      const tempData = {
        year: "",
        quarter: 0,
        month: 0,
        monthRange: "",
        dateRange: "",
        monthDateRange: "",
        weekRange: "",
        lastWeekRange: "",
      };
      let dateValue = null;
      if (this.fixedValueTypes.includes(pickerType)) {
        //情况1：固定值。dateRange和monthDateRange, weekRange, lastWeekRange，设置为一个固定值
        dateValue = Object.assign(tempData, { [pickerType]: this.dateRange });
      } else if (pickerType === "monthRange" && isInitial) {
        //情况2: monthRange类型：初始时设置为固定值，非初始时使用默认值
        //TODO: 存在一种情况：默认的monthRange有数据，此时展开monthRange类型的日期面板，看到的回显是1-上月，与monthRange的值不一致
        //解决方案一：在每个使用该组件的模块里，不获取monthRange的默认值。
        //方案二：检查固定值和默认值是否相同，不相同时触发change（需要处理模块同一个接口时间先后导致覆盖的问题）。
        //方案三：初始时且有默认值时，不设置固定值，保持组件面板和模块的日期数据一致
        //方案四：每个使用该组件的模块里，monthRange类型初始化时设置为1-上月
        dateValue = Object.assign(tempData, { [pickerType]: this.dateRange });
      } else if (defaultValue && !isEmptyObject(defaultValue)) {
        //情况3：有默认值.其余类型或monthRange类型非初始时 使用默认值
        let isExist = list.some((item) =>
          Object.entries(defaultValue).every(([k, v]) => !v || item[k] == v)
        );
        isExist ||=
          pickerType === "monthRange" &&
          (defaultValue.timeStage || defaultValue.monthRange);
        //列表不为空，默认值存在于列表中使用默认值，否则设置为列表的第一元素，列表为空设置为默认值
        dateValue = isExist || list.length  === 0 ? defaultValue : list?.[0];
      } else {
        //情况4：无默认值，设置为列表的第一个元素。 TODO:处理list为空时的情况
        dateValue = list?.[0];
      }
      if (dateValue) {
        let {
          year,
          quarter,
          month,
          monthRange,
          timeStage,
          dateRange,
          monthDateRange,
          weekRange,
          lastWeekRange,
        } = dateValue;
        const rangTypes = [
          "dateRange",
          "monthDateRange",
          "weekRange",
          "lastWeekRange",
        ];
        if (pickerType == "month" || pickerType == "quarter") {
          //月和季度
          let other = pickerType == "month" ? month : quarter;
          return other ? `${year}-${other}` : "";
        } else if (pickerType == "monthRange") {
          //月范围
          if (timeStage) {
            return timeStage.split("-").reduce((pre, cur) => {
              pre.push(cur ? `${year}-${cur}` : "");
              return pre;
            }, []);
          } else {
            return monthRange?.split("~") || [];
          }
        } else if (rangTypes.includes(pickerType)) {
          //日范围
          return (
            (dateRange || monthDateRange || weekRange || lastWeekRange)?.split(
              "~"
            ) || []
          ); //TODO:这里应当区分dateRange，monthDateRange，weekRange，lastWeekRange，取对应类型的值
        } else {
          //年
          return `${year}`;
        }
      } else {
        const arrayValueType = [
          "monthRange",
          "dateRange",
          "monthDateRange",
          "weekRange",
          "lastWeekRange",
        ];
        return arrayValueType.includes(pickerType) ? [] : "";
      }
    },
    //快捷选项 切换日期组件的类型
    handleShortcutClick(shortcut) {
      //先修改日期
      this.datePickerType = shortcut.trueValue || shortcut.value;
      this.dateValue = this.getDateValue(true);
      this.$emit("change-panel", this.datePickerType);
      //再触发事件
      shortcut?.onClick(this.$refs.datePicker.picker);
    },
    //日期的禁用
    disabledFunction(time, timeMin, quarterInfo) {
      //不禁用
      if (!this.dateDisabled) return false;
      //禁用
      //组件类型 year quarter month monthRange
      const pickerType = this.datePickerType;
      //自定义禁用方法
      if (typeof this.dateDisabledMethod == "function") {
        return this.dateDisabledMethod(time, timeMin, pickerType);
      }

      let year = "",
        month = 0,
        quarter = 0;
      if (pickerType === "quarter" && typeof quarterInfo === "object") {
        // timeType=year时time=xxxx， timeType=quarter时time=xxxx-x
        year = quarterInfo?.year;
        quarter = quarterInfo?.quarter;
      } else {
        // time 是Date
        let dateObj = getDateInfo(time);
        year = dateObj.year;
        month = dateObj.month;
      }
      let result = this.dateGroup.get(pickerType)?.some((item) => {
        if (pickerType == "year") {
          return item.year == year;
        } else if (pickerType == "quarter") {
          return quarterInfo?.type == "year"
            ? item.year == year
            : item.year == year && item.quarter == quarter;
        } else {
          return item.year == year && item.month == month;
        }
      });
      return !result;
      //TODO:阶段性暂时做不了禁用
    },
    //选择 日期
    handleChange(date) {

      /**返回俩个参数：
       * dateValue的格式：年:xxxx，季度：xxxx-x,月度：xxxx-x,月范围：[xxxx-x,xxxx-x],日范围：[xxxx-x-x,xxxx-x-x]
       */
      let dateObj = {
        year: "",
        lastYear: "",
        quarter: 0,
        month: 0,
        monthRange: "",
        timeStage: "",
        dateRange: "",
        monthDateRange: "",
        weekRange: "",
        lastWeekRange: "",
      };
      const dateType = this.datePickerType;
      if (Array.isArray(date)) {
        [dateObj.lastYear = "", dateObj.year = ""] = date.map(
          (item) => item?.split("-")?.[0]
        );
        //数组值类型
        if (dateType === "monthRange") {
          //月范围（局限：同年） TODO：未来将移除timeStage字段，将此功能移交到外部设置，timeStage的获取的日期数据存储在monthRange
          dateObj.timeStage = date
            .map((item) => item?.split("-")?.[1])
            .join("-");
        }
        dateObj[dateType] = date.join("~");
      } else {
        //一般值类型
        let key = dateType === "year" ? "lastYear" : dateType;
        // dateObj.year = date.split('-')?.[0] || ''
        // dateObj[key] = date.split('-')?.[1] || ''
        [dateObj.year = "", dateObj[key] = ""] = date?.split("-");
      }
      this.selecting = true;
      this.$emit("change", dateObj, date, dateType);
    },

    /**日期相关的方法 */
    // 获取当前年的第一天的Date日期对象
    getFirstDayOfYear() {
      // 创建一个新的Date对象，设置为当年的第一天（即1月1日）
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear(), 0, 1); // 设置年份、月份和日期分别为当前年、0（一月）和1（一日）

      return currentDate;
    },
    // 获取当前月的第一天的Date日期对象
    getFirstDayOfMonth() {
      // 创建一个新的Date对象，初始化为当前时间
      const currentDate = new Date();

      // 设置日期为当前月份的第一天（即1号）
      currentDate.setDate(1);

      return currentDate;
    },
    // 获取昨天的Date日期对象
    getYesterday() {
      // 创建一个新的Date对象，初始化为当前时间
      const currentDate = new Date();

      // 减去一天的时间（JavaScript中的Date对象会自动处理时区和闰秒）
      currentDate.setDate(currentDate.getDate() - 1);

      return currentDate;
    },
  },
  destroyed() {
    clearTimeout();
  },
};
</script>
 el-picker-panel el-date-picker el-popper has-sidebar date-picker-shortcut-popper


<style lang="scss">
.el-picker-panel.date-picker-shortcut-popper {
  .el-picker-panel_scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .shortcut-panel-sidebar {
    list-style: none;

    .panel-item {
      // text-align: center;
      padding-left: 5px;

      &.is-active .panel-item-button:not(.is-disabled) {
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1989fa;

      }
      &:hover {
        background-color: #f5f7fa;
      }
    }

    // .panel-item + .panel-item {
    //   margin-top: 10px;
    // }

    .panel-item-button {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      padding: 4px 10px;
      border-color: transparent;
      background-color: transparent;

      &.is-disabled {
        background-color: #f5f7fa;
        color: #c0c4cc;
      }
    }
  }
}
</style>
