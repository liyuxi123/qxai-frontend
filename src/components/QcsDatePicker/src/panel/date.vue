<template>
  <transition
    name="el-zoom-in-top"
    @after-enter="handleEnter"
    @after-leave="handleLeave"
  >
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker el-popper"
      :class="[
        {
          'has-sidebar': $slots.sidebar || shortcuts,
          'has-time': showTime,
        },
        popperClass,
      ]"
    >
      <div class="el-picker-panel__body-wrapper">
        <slot name="sidebar" class="el-picker-panel__sidebar"></slot>
        <div class="el-picker-panel__sidebar" v-if="shortcuts">
          <button
            type="button"
            class="el-picker-panel__shortcut"
            v-for="(shortcut, key) in shortcuts"
            :key="key"
            @click="handleShortcutClick(shortcut)"
          >
            {{ shortcut.text }}
          </button>
        </div>
        <div class="el-picker-panel__body">
          <div class="el-date-picker__time-header" v-if="showTime">
            <span class="el-date-picker__editor-wrap">
              <el-input
                :placeholder="t('el.datepicker.selectDate')"
                :value="visibleDate"
                size="small"
                @input="(val) => (userInputDate = val)"
                @change="handleVisibleDateChange"
              />
            </span>
            <span
              class="el-date-picker__editor-wrap"
              v-clickoutside="handleTimePickClose"
            >
              <el-input
                ref="input"
                @focus="timePickerVisible = true"
                :placeholder="t('el.datepicker.selectTime')"
                :value="visibleTime"
                size="small"
                @input="(val) => (userInputTime = val)"
                @change="handleVisibleTimeChange"
              />
              <time-picker
                ref="timepicker"
                :time-arrow-control="arrowControl"
                @pick="handleTimePick"
                :visible="timePickerVisible"
                @mounted="proxyTimePickerDataProperties"
              >
              </time-picker>
            </span>
          </div>
          <div
            class="el-date-picker__header"
            :class="{
              'el-date-picker__header--bordered':
                currentView === 'year' || currentView === 'month',
            }"
            v-show="currentView !== 'time' && currentView !== 'quarter' && currentView !== 'dateRange'"
          >
            <button
              type="button"
              @click="prevYear"
              :aria-label="t(`el.datepicker.prevYear`)"
              class="
                el-picker-panel__icon-btn
                el-date-picker__prev-btn
                el-icon-d-arrow-left
              "
              :disabled="prevYearDisabled"
              :style="yearDisabledStyle('prevYear')"
            ></button>
            <button
              type="button"
              @click="prevMonth"
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.prevMonth`)"
              class="
                el-picker-panel__icon-btn
                el-date-picker__prev-btn
                el-icon-arrow-left
              "
            ></button>
            <span
              @click="showYearPicker"
              role="button"
              class="el-date-picker__header-label"
              >{{ yearLabel }}</span
            >
            <span
              @click="showMonthPicker"
              v-show="currentView === 'date'"
              role="button"
              class="el-date-picker__header-label"
              :class="{ active: currentView === 'month' }"
              >{{ t(`el.datepicker.month${month + 1}`) }}</span
            >
            <button
              type="button"
              @click="nextYear"
              :aria-label="t(`el.datepicker.nextYear`)"
              class="
                el-picker-panel__icon-btn
                el-date-picker__next-btn
                el-icon-d-arrow-right
              "
              :disabled="nextYearDisabled"
              :style="yearDisabledStyle('nextYear')"
            ></button>
            <button
              type="button"
              @click="nextMonth"
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.nextMonth`)"
              class="
                el-picker-panel__icon-btn
                el-date-picker__next-btn
                el-icon-arrow-right
              "
            ></button>
          </div>

          <div class="el-picker-panel__content">
            <date-table
              v-show="currentView === 'date'"
              @pick="handleDatePick"
              :selection-mode="selectionMode"
              :first-day-of-week="firstDayOfWeek"
              :value="value"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :cell-class-name="cellClassName"
              :disabled-date="disabledDate"
            >
            </date-table>
            <year-table
              v-show="currentView === 'year'"
              @pick="handleYearPick"
              :value="value"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate"
            >
            </year-table>
            <month-table
              v-show="currentView === 'month'"
              @pick="handleMonthPick"
              :value="value"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate"
            >
            </month-table>
            <DatePicker
              v-show="currentView == 'quarter'"
              @pick="handleQuarterPick"
              :tab-list="[]"
              date-type="quarter"
              :open-annual="false"
              :open-disabled="false"
              :value="value"
              :disabled-date="disabledDate"
              :date-limit-options="dateLimitOptions"
              :tab-space="15"
              :date-space="10"
            ></DatePicker>
            <month-table
              ref="monthTable"
              selection-mode="range"
              v-show="currentView == 'monthRange'"
              :date="leftDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :date-limit-options="dateLimitOptions"
              @changerange="handleChangeRange"
              @pick="handleRangePick"
            >
            </month-table>

          </div>
        </div>
      </div>

      <div
        class="el-picker-panel__footer"
        v-show="footerVisible && currentView === 'date' || confirmable"
      >
        <el-button
          size="mini"
          type="text"
          class="el-picker-panel__link-btn"
          @click="changeToNow"
          v-show="selectionMode !== 'dates' && !confirmable"
        >
          {{ t("el.datepicker.now") }}
        </el-button>
        <el-button
          size="mini"
          class="el-picker-panel__link-btn"
          @click="$emit('cancel')"
          v-show="confirmable"
        >
          {{ t("el.datepicker.cancel") }}
        </el-button>
        <el-button
          plain
          size="mini"
          class="el-picker-panel__link-btn"
          @click="confirm"
        >
          {{ t("el.datepicker.confirm") }}
        </el-button>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import {
  formatDate,
  parseDate,
  getWeekNumber,
  isDate,
  modifyDate,
  modifyTime,
  modifyWithTimeString,
  clearMilliseconds,
  clearTime,
  prevYear,
  nextYear,
  prevMonth,
  nextMonth,
  changeYearMonthAndClampDate,
  extractDateFormat,
  extractTimeFormat,
  timeWithinRange,
} from "element-ui/src/utils/date-util";
import Clickoutside from "element-ui/src/utils/clickoutside";
import Locale from "element-ui/src/mixins/locale";
import ElInput from "element-ui/packages/input";
import ElButton from "element-ui/packages/button";
import TimePicker from "./time";
import YearTable from "../basic/year-table";
import MonthTable from "../basic/month-table";
import DateTable from "../basic/date-table";
import DatePicker from "../basic/DatePicker";
import MonthRange from "./month-range";


export default {
  mixins: [Locale, MonthRange],

  directives: { Clickoutside },

  watch: {
    showTime(val) {
      /* istanbul ignore if */
      if (!val) return;
      this.$nextTick((_) => {
        const inputElm = this.$refs.input.$el;
        if (inputElm) {
          this.pickerWidth = inputElm.getBoundingClientRect().width + 10;
        }
      });
    },
    // 这里新增了monthRange 因此需要更一下value
    value(val) {
      if (this.selectionMode === "dates" && this.value) return;
      const newValue =
        this.selectionMode === "monthRange"
          ? Array.isArray(val) &&
            val[0] &&
            val[1] &&
            new Date(val[0]).getFullYear() == new Date(val[1]).getFullYear() //阶段性只做同年度的
            ? val[0]
            : ""
          : val;
      if (isDate(newValue)) {
        this.date = new Date(newValue);
      } else {
        this.date = this.getDefaultValue();
      }
    },

    // value(val) {
    //   if (this.selectionMode === "dates" && this.value) return;
    //   if (isDate(val)) {
    //     this.date = new Date(val);
    //   } else {
    //     this.date = this.getDefaultValue();
    //   }
    // },

    // defaultValue(val) {
    //   if (!isDate(this.value)) {
    //     this.date = val ? new Date(val) : new Date();
    //   }
    // },

    timePickerVisible(val) {
      if (val) this.$nextTick(() => this.$refs.timepicker.adjustSpinners());
    },

    selectionMode(newVal) {
      if (newVal === "month") {
        /* istanbul ignore next */
        if (this.currentView !== "year" || this.currentView !== "month") {
          this.currentView = "month";
        }
      } else if (newVal === "dates") {
        this.currentView = "date";
      }
    },
  },

  methods: {
    proxyTimePickerDataProperties() {
      const format = (timeFormat) => {
        this.$refs.timepicker.format = timeFormat;
      };
      const value = (value) => {
        this.$refs.timepicker.value = value;
      };
      const date = (date) => {
        this.$refs.timepicker.date = date;
      };
      const selectableRange = (selectableRange) => {
        this.$refs.timepicker.selectableRange = selectableRange;
      };

      this.$watch("value", value);
      this.$watch("date", date);
      this.$watch("selectableRange", selectableRange);

      format(this.timeFormat);
      value(this.value);
      date(this.date);
      selectableRange(this.selectableRange);
    },

    handleClear() {
      this.date = this.getDefaultValue();
      this.$emit("pick", null);
    },

    emit(value, ...args) {
      if (!value) {
        this.$emit("pick", value, ...args);
      } else if (Array.isArray(value)) {
        const dates = value.map((date) =>
          this.showTime ? clearMilliseconds(date) : clearTime(date)
        );
        this.$emit("pick", dates, ...args);
      } else {
        this.$emit(
          "pick",
          this.showTime ? clearMilliseconds(value) : clearTime(value),
          ...args
        );
      }
      this.userInputDate = null;
      this.userInputTime = null;
    },

    // resetDate() {
    //   this.date = new Date(this.date);
    // },

    showMonthPicker() {
      this.currentView = "month";
    },

    showYearPicker() {
      //自定义的阶段性monthRange不需要切换年这个功能
      const hiddenYearViews = ["monthRange"]
      if (hiddenYearViews.includes(this.currentView)) {
        return;
      }
      this.currentView = "year";
    },

    // XXX: 没用到
    // handleLabelClick() {
    //   if (this.currentView === 'date') {
    //     this.showMonthPicker();
    //   } else if (this.currentView === 'month') {
    //     this.showYearPicker();
    //   }
    // },

    prevMonth() {
      this.date = prevMonth(this.date);
    },

    nextMonth() {
      this.date = nextMonth(this.date);
    },

    prevYear() {
      if (this.currentView === "year") {
        this.date = prevYear(this.date, 10);
      } else {
        this.date = prevYear(this.date);
      }
      //增加 monthRange的年度切换
      if (this.currentView === "monthRange") {
        this.leftPrevYear();
      }
    },

    nextYear() {
      if (this.currentView === "year") {
        this.date = nextYear(this.date, 10);
      } else {
        this.date = nextYear(this.date);
      }
      //增加 monthRange的年度切换
      if (this.currentView === "monthRange") {
        this.rightNextYear();
      }
    },

    handleShortcutClick(shortcut) {
      if (shortcut.onClick) {
        shortcut.onClick(this);
      }
    },

    handleTimePick(value, visible, first) {
      if (isDate(value)) {
        const newDate = this.value
          ? modifyTime(
              this.value,
              value.getHours(),
              value.getMinutes(),
              value.getSeconds()
            )
          : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
        this.date = newDate;
        this.emit(this.date, true);
      } else {
        this.emit(value, true);
      }
      if (!first) {
        this.timePickerVisible = visible;
      }
    },

    handleTimePickClose() {
      this.timePickerVisible = false;
    },

    handleMonthPick(month) {
      if (this.selectionMode === "month") {
        this.date = modifyDate(this.date, this.year, month, 1);
        this.emit(this.date, this.confirmable);
      } else {
        this.date = changeYearMonthAndClampDate(this.date, this.year, month);
        // TODO: should emit intermediate value ??
        // this.emit(this.date);
        this.currentView = "date";
      }
    },

    handleDatePick(value) {
      if (this.selectionMode === "day") {
        let newDate = this.value
          ? modifyDate(
              this.value,
              value.getFullYear(),
              value.getMonth(),
              value.getDate()
            )
          : modifyWithTimeString(value, this.defaultTime);
        // change default time while out of selectableRange
        if (!this.checkDateWithinRange(newDate)) {
          newDate = modifyDate(
            this.selectableRange[0][0],
            value.getFullYear(),
            value.getMonth(),
            value.getDate()
          );
        }
        this.date = newDate;
        this.emit(this.date, this.showTime);
      } else if (this.selectionMode === "week") {
        this.emit(value.date);
      } else if (this.selectionMode === "dates") {
        this.emit(value, true); // set false to keep panel open
      }
    },

    handleYearPick(year) {
      if (this.selectionMode === "year") {
        this.emit(modifyDate(this.date, year, 0, 1), this.confirmable);
      } else {
        this.date = changeYearMonthAndClampDate(this.date, year, this.month);
        // TODO: should emit intermediate value ??
        // this.emit(this.date, true);
        this.currentView = "month";
      }
    },

    //自定义 季度
    handleQuarterPick(date) {
      if (this.selectionMode === "quarter") {
        this.date = date;
        this.emit(this.date, this.confirmable);
      }
    },

    changeToNow() {
      // NOTE: not a permanent solution
      //       consider disable "now" button in the future
      if (
        (!this.disabledDate || !this.disabledDate(new Date())) &&
        this.checkDateWithinRange(new Date())
      ) {
        this.date = new Date();
        this.emit(this.date);
      }
    },

    confirm() {
      if (this.selectionMode === "dates") {
        this.emit(this.value);
      } else {
        // value were emitted in handle{Date,Time}Pick, nothing to update here
        // deal with the scenario where: user opens the picker, then confirm without doing anything
        const value = this.value
          ? this.value
          : modifyWithTimeString(this.getDefaultValue(), this.defaultTime);
        this.date = new Date(value); // refresh date
        this.emit(value, false, true);
      }
    },

    resetView() {
      // 自定义
      if (this.isCustom) {
        if (this.selectionMode === "month") {
          this.currentView = "month";
        } else if (this.selectionMode === "year") {
          this.currentView = "year";
        } else if (this.selectionMode === "quarter") {
          this.currentView = "quarter";
        } else if (this.selectionMode === "dateRange" || this.selectionMode === "monthDateRange" || this.selectionMode === "weekRange" || this.selectionMode === "lastWeekRange"){
          this.currentView = "dateRange";
        } else {
          this.currentView = "monthRange";
        }
        return;
      }
      if (this.selectionMode === "month" || this.selectionMode === 'months') {
        this.currentView = "month";
      } else if (this.selectionMode === 'year' || this.selectionMode === 'years') {
          this.currentView = 'year';
      } else {
        this.currentView = "date";
      }
    },

    handleEnter() {
      document.body.addEventListener("keydown", this.handleKeydown);
    },

    handleLeave() {
      this.$emit("dodestroy");
      document.body.removeEventListener("keydown", this.handleKeydown);
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;
      const list = [38, 40, 37, 39];
      if (this.visible && !this.timePickerVisible) {
        if (list.indexOf(keyCode) !== -1) {
          this.handleKeyControl(keyCode);
          event.stopPropagation();
          event.preventDefault();
        }
        if (
          keyCode === 13 &&
          this.userInputDate === null &&
          this.userInputTime === null
        ) {
          // Enter
          this.emit(this.date, false);
        }
      }
    },

    handleKeyControl(keyCode) {
      const mapping = {
        year: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setFullYear(date.getFullYear() + step),
        },
        month: {
          38: -4,
          40: 4,
          37: -1,
          39: 1,
          offset: (date, step) => date.setMonth(date.getMonth() + step),
        },
        week: {
          38: -1,
          40: 1,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step * 7),
        },
        day: {
          38: -7,
          40: 7,
          37: -1,
          39: 1,
          offset: (date, step) => date.setDate(date.getDate() + step),
        },
      };
      const mode = this.selectionMode;
      const year = 3.1536e10;
      const now = this.date.getTime();
      const newDate = new Date(this.date.getTime());
      while (Math.abs(now - newDate.getTime()) <= year) {
        const map = mapping[mode];
        map.offset(newDate, map[keyCode]);
        if (
          typeof this.disabledDate === "function" &&
          this.disabledDate(newDate)
        ) {
          continue;
        }
        this.date = newDate;
        this.$emit("pick", newDate, true);
        break;
      }
    },

    handleVisibleTimeChange(value) {
      const time = parseDate(value, this.timeFormat);
      if (time && this.checkDateWithinRange(time)) {
        this.date = modifyDate(time, this.year, this.month, this.monthDate);
        this.userInputTime = null;
        this.$refs.timepicker.value = this.date;
        this.timePickerVisible = false;
        this.emit(this.date, true);
      }
    },

    handleVisibleDateChange(value) {
      const date = parseDate(value, this.dateFormat);
      if (date) {
        if (
          typeof this.disabledDate === "function" &&
          this.disabledDate(date)
        ) {
          return;
        }
        this.date = modifyTime(
          date,
          this.date.getHours(),
          this.date.getMinutes(),
          this.date.getSeconds()
        );
        this.userInputDate = null;
        this.resetView();
        this.emit(this.date, true);
      }
    },

    isValidValue(value) {
      // 因为混入了month-range组件，因此这里需要增加 monthRange的值校验方法
      const arrayValueViews = ["monthRange","dateRange"]
      if (arrayValueViews.includes(this.currentView)) {
        return (
          Array.isArray(value) &&
          value &&
          value[0] &&
          value[1] &&
          isDate(value[0]) &&
          isDate(value[1]) &&
          value[0].getTime() <= value[1].getTime() &&
          (typeof this.disabledDate === "function"
            ? !this.disabledDate(value[0]) && !this.disabledDate(value[1])
            : true)
        );
      }
      return (
        value &&
        !isNaN(value) &&
        (typeof this.disabledDate === "function"
          ? !this.disabledDate(value)
          : true) &&
        this.checkDateWithinRange(value)
      );
    },

    getDefaultValue() {
      // if default-value is set, return it
      // otherwise, return now (the moment this method gets called)
    //   return this.defaultValue ? new Date(this.defaultValue) : new Date();
      return new Date();
    },

    checkDateWithinRange(date) {
      return this.selectableRange.length > 0
        ? timeWithinRange(date, this.selectableRange, this.format || "HH:mm:ss")
        : true;
    },


    //custom prevYear nextYear按钮禁用样式
    yearDisabledStyle(operation) {
        const disabledStyle = {
          cursor: "not-allowed",
          color: "#C0C4CC",
        };
        if(operation == "prevYear"){
            return this.prevYearDisabled ? disabledStyle : {}
        }else {
            return this.nextYearDisabled ? disabledStyle : {}
        }
    },
    //custom
    handleMonthClick(month) {
        this.$refs.monthTable.handleMonthClick(month)
    }
  },

  components: {
    TimePicker,
    YearTable,
    MonthTable,
    DateTable,
    ElInput,
    ElButton,
    DatePicker,

  },

  data() {
    return {
      popperClass: "",
      date: new Date(),
      value: "",
      defaultValue: null, // use getDefaultValue() for time computation
      defaultTime: null,
      showTime: false,
      selectionMode: "day",
      shortcuts: "",
      visible: false,
      currentView: "date",
      disabledDate: "",
      cellClassName: "",
      selectableRange: [],
      firstDayOfWeek: 7,
      showWeekNumber: false,
      timePickerVisible: false,
      format: "",
      arrowControl: false,
      userInputDate: null,
      userInputTime: null,
      dateLimitOptions: {},// 日期限制的配置
      confirmable: false, //展示确认按钮
    };
  },

  computed: {
    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    week() {
      return getWeekNumber(this.date);
    },

    monthDate() {
      return this.date.getDate();
    },

    footerVisible() {
      return this.showTime || this.selectionMode === "dates";
    },

    visibleTime() {
      if (this.userInputTime !== null) {
        return this.userInputTime;
      } else {
        return formatDate(this.value || this.defaultValue, this.timeFormat);
      }
    },

    visibleDate() {
      if (this.userInputDate !== null) {
        return this.userInputDate;
      } else {
        return formatDate(this.value || this.defaultValue, this.dateFormat);
      }
    },

    yearLabel() {
      const yearTranslation = this.t("el.datepicker.year");
      if (this.currentView === "year") {
        // const startYear = Math.floor(this.year / 10) * 10;
        const endYear = this.year;
        if (yearTranslation) {
          return (
            endYear -
            9 +
            " " +
            yearTranslation +
            " - " +
            endYear +
            " " +
            yearTranslation
          );
        }
        return endYear - 9 + " - " + endYear;
      }
      return this.year + " " + yearTranslation;
    },

    timeFormat() {
      if (this.format) {
        return extractTimeFormat(this.format);
      } else {
        return "HH:mm:ss";
      }
    },

    dateFormat() {
      if (this.format) {
        return extractDateFormat(this.format);
      } else {
        return "yyyy-MM-dd";
      }
    },

    //custom,prev禁用
    prevYearDisabled() {
        const {currentView, minDate, maxDate} = this
        let { min } = this.dateLimitOptions || {}
        let currentYear = new Date(this.date).getFullYear()
        min = min ? new Date(min).getFullYear() : null
        //currentView == year时需要注意year-table组件的展示的最后一年是多少，year-table组件当前最后一年是endYear-9，即this.date-9值
        if(currentView == "year") {
            currentYear -= 9
        }
        // 阶段性 monthRange 需要在选中一个日期时即：minDate，禁用年度切换按钮
        return min && currentYear <= min || currentView === 'monthRange' && minDate && !maxDate
    },
    //custom,next禁用
    nextYearDisabled() {
        const {currentView, minDate, maxDate} = this
        let { max } = this.dateLimitOptions || {}
        let currentYear = new Date(this.date).getFullYear()
        max = max ? new Date(max).getFullYear() : null
        //currentView == year时需要注意year-table组件的展示的最后一年是多少，year-table组件当前最后一年是endYear，即this.date值
        // 阶段性 monthRange 需要在选中一个日期时即：minDate，禁用年度切换按钮
        return max && currentYear >= max || currentView === 'monthRange' && minDate && !maxDate
    },
  },
};
</script>
