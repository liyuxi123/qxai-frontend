<template>
  <el-input
    class="el-date-editor"
    :class="'el-date-editor--' + type"
    :readonly="!editable || readonly || type === 'dates' || type === 'week'"
    :disabled="pickerDisabled"
    :size="pickerSize"
    :name="name"
    v-bind="firstInputId"
    v-if="!ranged"
    v-clickoutside="handleClose"
    :placeholder="placeholder"
    @focus="handleFocus"
    @keydown.native="handleKeydown"
    :value="displayValue"
    @input="(value) => (userInput = value)"
    @change="handleChange"
    @mouseenter.native="handleMouseEnter"
    @mouseleave.native="showClose = false"
    :validateEvent="false"
    ref="reference"
  >
    <template slot="prefix">
      <slot name="prefix">
        <i
          slot="prefix"
          class="el-input__icon"
          :class="triggerClass"
          @click="handleFocus"
        >
        </i>
      </slot>
    </template>
    <template slot="suffix">
      <slot name="suffix"></slot>
    </template>
    <i
      slot="suffix"
      class="el-input__icon"
      @click="handleClickIcon"
      :class="[showClose ? '' + clearIcon : '']"
      v-if="haveTrigger"
    >
    </i>
  </el-input>
  <div
    class="el-date-editor el-range-editor el-input__inner"
    :class="[
      'el-date-editor--' + type,
      pickerSize ? `el-range-editor--${pickerSize}` : '',
      pickerDisabled ? 'is-disabled' : '',
      pickerVisible ? 'is-active' : '',
    ]"
    @click="handleRangeClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="showClose = false"
    @keydown="handleKeydown"
    ref="reference"
    v-clickoutside="handleClose"
    v-else
  >
    <slot name="range-prefix">
      <i :class="['el-input__icon', 'el-range__icon', triggerClass]"></i>
    </slot>
    <!-- <i :class="['el-input__icon', 'el-range__icon', triggerClass]"></i> -->
    <input
      autocomplete="off"
      :placeholder="startPlaceholder"
      :value="displayValue && displayValue[0]"
      :disabled="pickerDisabled"
      v-bind="firstInputId"
      :readonly="!editable || readonly"
      :name="name && name[0]"
      @input="handleStartInput"
      @change="handleStartChange"
      @focus="handleFocus"
      class="el-range-input"
    />
    <slot name="range-separator">
      <span class="el-range-separator">{{ rangeSeparator }}</span>
    </slot>
    <input
      autocomplete="off"
      :placeholder="endPlaceholder"
      :value="displayValue && displayValue[1]"
      :disabled="pickerDisabled"
      v-bind="secondInputId"
      :readonly="!editable || readonly"
      :name="name && name[1]"
      @input="handleEndInput"
      @change="handleEndChange"
      @focus="handleFocus"
      class="el-range-input"
    />
    <slot name="range-suffix"></slot>
    <i
      slot="suffix"
      @click="handleClickIcon"
      v-if="haveTrigger"
      :class="[showClose ? '' + clearIcon : '']"
      class="el-input__icon el-range__close-icon"
    >
    </i>
  </div>
</template>

<script>
import Vue from "vue";
import Clickoutside from "element-ui/src/utils/clickoutside";
import {
  formatDate,
  parseDate,
  isDateObject,
  getWeekNumber,
} from "element-ui/src/utils/date-util";
// import Popper from "element-ui/src/utils/vue-popper";
import Popper from "element-ui/lib/utils/vue-popper";
import Emitter from "element-ui/src/mixins/emitter";
import ElInput from "element-ui/packages/input";
import merge from "element-ui/src/utils/merge";

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset,
  },
  methods: Popper.methods,
  data() {
    return merge({ visibleArrow: true }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy,
};

const DEFAULT_FORMATS = {
  date: "yyyy-MM-dd",
  month: "yyyy-MM",
  datetime: "yyyy-MM-dd HH:mm:ss",
  time: "HH:mm:ss",
  week: "yyyywWW",
  timerange: "HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
  year: "yyyy",
  //自定义 季度格式
  quarter: "yyyy-QQ",
  monthRange: "yyyy MM-MM",
  dateRange: "yyyy MM-dd-MM-dd",
  monthDateRange: "yyyy MM-dd-MM-dd",
  weekRange: "yyyy-MM-dd~yyyy-MM-dd",
  lastWeekRange: "yyyy-MM-dd~yyyy-MM-dd",
};
const HAVE_TRIGGER_TYPES = [
  "date",
  "datetime",
  "time",
  "time-select",
  "week",
  "month",
  "year",
  "daterange",
  "monthrange",
  "timerange",
  "datetimerange",
  "dates",
  //自定义 季度类型,
  "quarter",
  "monthRange",
  "dateRange",
  "monthDateRange",
  "weekRange",
  "lastWeekRange",
];
const DATE_FORMATTER = function (value, format) {
  if (format === "timestamp") return value.getTime();
  return formatDate(value, format);
};
const DATE_PARSER = function (text, format) {
  if (format === "timestamp") return new Date(Number(text));
  return parseDate(text, format);
};
const RANGE_FORMATTER = function (value, format) {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0];
    const end = value[1];

    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)];
    }
  }
  return "";
};
const RANGE_PARSER = function (array, format, separator) {
  if (!Array.isArray(array)) {
    array = array.split(separator);
  }
  if (array.length === 2) {
    const range1 = array[0];
    const range2 = array[1];

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)];
  }
  return [];
};

/**在修改日期值的时候流程为：
 * 1.修改日期值,触发emiInput方法，该方法调用了formatToValue方法，
 * formatToValue里引用了formatAsFormatAndType，并且重要的一点是传入的参数是valueFormat而不是format
 * 2.format 将新的值按valueFormat转化，再将转化后的值传入parse里
 * 3.parse 将传入的值转为标准时间格式
 * 4.format 将标准时间按format格式化
 * 在显示默认日期值的时候流程为：
 * 1.parse 将日期值转为标准时间格式
 * 2.format 将标准时间按format格式化
 *  */
// 自定义 季度 format
const QUARTER_FORMATTER = function (value, format) {
  if (format === "timestamp") return value.getTime();
  if (value) {
    let year = value.getFullYear(), month = value.getMonth() + 1
    let quarterText = /QQ/.test(format)
      ? format.replace(/QQ/, "0" + Math.ceil(month / 3))
      : format.replace(/Q/, Math.ceil(month / 3));
    return quarterText.replace("yyyy", year);
  }
  return value;
};
// 自定义 季度 parse
const QUARTER_PARSER = function (text, format) {
  if (format === "timestamp") return new Date(Number(text)); // todo
  if (text) {
    let [year, quarter = new Date().getMonth() + 1] = text.split("-");
    return parseDate(`${year}-${parseInt(quarter * 3)}-1`, "yyyy-MM-DD");
  }
  return text;
};
// 自定义 月度范围 format
const MONTH_RANGE_FORMATTER = function (value, format, isFormatToValue) {
    //TODO: isFormatToValue修改为和RANGE_FORMATTER类似的判断
    // 是否是 formatToValue 方法触发，该方法是在修改日期时，传入的新值按valueFormat格式化，再将格式后的值传入parse
    if(isFormatToValue){
        return RANGE_FORMATTER(value, format)
    }
  if (Array.isArray(value) && value.length === 2) {
    function formatter(doubleReg, reg, list) {
        for(let item of list) {
            format = doubleReg.test(format)
            ? format.replace(doubleReg, "0" + item)
            : format.replace(reg, item);
        }
        return format
    }
    const start = value[0];
    const end = value[1];
    if (start && end) {
      let startYear = start.getFullYear(), startMonth = start.getMonth() + 1,
       endYear = start.getFullYear(), endMonth = end.getMonth() + 1
      return formatter.call(null, /MM/, /M/, [startMonth, endMonth])
          .replace("yyyy", startYear)
          .replace("yyyy", endYear);
    }
  }
  return "";
};
// 自定义 日范围 format
const DATE_RANGE_FORMATTER = function (value, format, isFormatToValue) {
    // 是否是 formatToValue 方法触发，该方法是在修改日期时，传入的新值按valueFormat格式化，再将格式后的值传入parse
    if(isFormatToValue){
        return RANGE_FORMATTER(value, format)
    }
  if (Array.isArray(value) && value.length === 2) {
    function formatter(doubleReg, reg, list) {
        for(let item of list) {
            format = doubleReg.test(format)
            ? format.replace(doubleReg, "0" + item)
            : format.replace(reg, item);
        }
        return format
    }
    const start = value[0];
    const end = value[1];
    if (start && end) {
      let startYear = start.getFullYear(), startMonth = start.getMonth() + 1, startDay = start.getDate(),
       endYear = start.getFullYear(), endMonth = end.getMonth() + 1, endDay = end.getDate()
       formatter.call(null, /MM/, /M/, [startMonth, endMonth])
       formatter.call(null, /dd/, /d/, [startDay, endDay])
       //不同年份的月份范围
       return format
        .replace("yyyy", startYear)
        .replace("yyyy", endYear);
    }
  }
  return "";
};

const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) return "";
      return "" + value;
    },
    parser(text) {
      if (text === undefined || text === "") return null;
      return text;
    },
  },
  week: {
    formatter(value, format) {
      let week = getWeekNumber(value);
      let month = value.getMonth();
      const trueDate = new Date(value);
      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0);
        trueDate.setDate(
          trueDate.getDate() + 3 - ((trueDate.getDay() + 6) % 7)
        );
      }
      let date = formatDate(trueDate, format);

      date = /WW/.test(date)
        ? date.replace(/WW/, week < 10 ? "0" + week : week)
        : date.replace(/W/, week);
      return date;
    },
    parser(text, format) {
      // parse as if a normal date
      return TYPE_VALUE_RESOLVER_MAP.date.parser(text, format);
    },
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  monthrange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER,
  },
  number: {
    formatter(value) {
      if (!value) return "";
      return "" + value;
    },
    parser(text) {
      let result = Number(text);

      if (!isNaN(text)) {
        return result;
      } else {
        return null;
      }
    },
  },
  dates: {
    formatter(value, format) {
      return value.map((date) => DATE_FORMATTER(date, format));
    },
    parser(value, format) {
      return (typeof value === "string" ? value.split(", ") : value).map(
        (date) => (date instanceof Date ? date : DATE_PARSER(date, format))
      );
    },
  },
  //自定义
  //季度
  quarter: {
    formatter: QUARTER_FORMATTER,
    parser: QUARTER_PARSER,
  },
  //月范围
  monthRange: {
    formatter: MONTH_RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  //月-日~月-日范围
  dateRange: {
    formatter: DATE_RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  //某月日`日范围
  monthDateRange: {
    formatter: DATE_RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  //月-日~月-日范围
  weekRange: {
    formatter: DATE_RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
  //月-日~月-日范围
  lastWeekRange: {
    formatter: DATE_RANGE_FORMATTER,
    parser: RANGE_PARSER,
  },
};
const PLACEMENT_MAP = {
  left: "bottom-start",
  center: "bottom",
  right: "bottom-end",
};

/**
 * 理解：初始化时，先parseAsFormatAndType再formatAsFormatAndType，
 * 可以简单理解parseAsFormatAndType为按valueFormat解析值，formatAsFormatAndType将值按format格式化
 * 修改值时，先formatAsFormatAndType再 parseAsFormatAndType最后formatAsFormatAndType，
 * 第一步是按valueFormat转化，第二步是解析值，第三步是按format格式化
 */
const parseAsFormatAndType = (
  value,
  customFormat,
  type,
  rangeSeparator = "-"
) => {
  if (!value) return null;
  const parser = (
    TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP["default"]
  ).parser;
  const format = customFormat || DEFAULT_FORMATS[type];
//   console.log("parseAsFormatAndType: ", value, type, format);
  return parser(value, format, rangeSeparator);
};
// 增加 isFormatToValue参数 判断是否是formatToValue方法修改日期值触发
const formatAsFormatAndType = (
  value,
  customFormat,
  type,
  rangeSeparator,
  isFormatToValue
) => {
  if (!value) return null;
  const formatter = (
    TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP["default"]
  ).formatter;
  const format = customFormat || DEFAULT_FORMATS[type];
//   console.log("formatAsFormatAndType: ", value, type, format);
  return formatter(value, format, isFormatToValue);
};

/*
 * Considers:
 *   1. Date object
 *   2. date string
 *   3. array of 1 or 2
 *   4.类型判断： 因为自定义的季度格式为: xxxx-x,月度为：xxxx-x，格式一样，存在值相同的情况，所以需要再加上类型判断
 */
const valueEquals = function (a, b, aType, bType) {
  // considers Date object and string
  const dateEquals = function (a, b) {
    const aIsDate = a instanceof Date;
    const bIsDate = b instanceof Date;
    if (aIsDate && bIsDate) {
    //   return a.getTime() === b.getTime();
      return a.getTime() === b.getTime() && aType == bType
    }
    if (!aIsDate && !bIsDate) {
    //   return a === b;
      return a === b && aType == bType
    }
    return false;
  };

  const aIsArray = a instanceof Array;
  const bIsArray = b instanceof Array;
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => dateEquals(item, b[index]));
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b);
  }
  return false;
};

const isString = function (val) {
  return typeof val === "string" || val instanceof String;
};

const validator = function (val) {
  // either: String, Array of String, null / undefined
  return (
    val === null ||
    val === undefined ||
    isString(val) ||
    (Array.isArray(val) && val.length === 2 && val.every(isString))
  );
};

export default {
  mixins: [Emitter, NewPopper],

  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },

  props: {
    size: String,
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: "el-icon-circle-close",
    },
    name: {
      default: "",
      validator,
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    id: {
      default: "",
      validator,
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: "left",
    },
    value: {},
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
      default: "-",
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    isSinglePanel: {
      type: Boolean,
      default: false,
    },
    disableArrow: {
      type: Boolean,
      default: false,
    },

    validateEvent: {
      type: Boolean,
      default: true,
    },
    // 自定义
    isCustom: {
      type: Boolean,
      default: false,
    },
    //限制范围选项
    dateLimitOptions:{
        type: Object,
        default: () => {}
    },
    //展示确认按钮
    confirmable: {
      type: Boolean,
      default: false,
    }
  },

  components: { ElInput },

  directives: { Clickoutside },

  data() {
    return {
      pickerVisible: false,
      showClose: false,
      userInput: null,
      valueOnOpen: null, // value when picker opens, used to determine whether to emit change
      unwatchPickerOptions: null,

      typeOnOpen: null, // type when picker opens, used to determine whether to emit change
      valueFormatOnOpen: null,
      formatOnOpen: null,
      clickConfirm: false, //点击确认按钮
    };
  },

  watch: {
    pickerVisible(val) {
      if (this.readonly || this.pickerDisabled) return;
      if (val) {
        this.showPicker();
        this.valueOnOpen = Array.isArray(this.value)
          ? [...this.value]
          : this.value;
        // 增加一个类型,用于比较新值和旧值
        this.typeOnOpen = this.type;
        this.valueFormatOnOpen = this.valueFormat;
        this.formatOnOpen = this.format;
        this.clickConfirm = false
      } else {
        this.hidePicker();
        // setTimeout(this.emitChange, 200, this.value);
        //有确认按钮的时候，点击空白，不触发一次emitChange事件
        if(!this.confirmable || this.clickConfirm) {
            this.emitChange(this.value)

        }
        // this.emitChange(this.value)
        this.userInput = null;
        if (this.validateEvent) {
          this.dispatch("ElFormItem", "el.form.blur");
        }
        this.$emit("blur", this);
        this.blur();
      }
    },
    parsedValue: {
      immediate: true,
      handler(val) {
        if (this.picker) {
          this.picker.value = val;
        }
      },
    },
    defaultValue(val) {
      // NOTE: should eventually move to jsx style picker + panel ?
      if (this.picker) {
        this.picker.defaultValue = val;
      }
    },
    value(val, oldVal) {
      if (
        !valueEquals(val, oldVal, this.type, this.typeOnOpen) &&
        !this.pickerVisible &&
        this.validateEvent
      ) {
        this.dispatch("ElFormItem", "el.form.change", val);
      }
    },
  },

  computed: {
    ranged() {
      return this.type?.indexOf("range") > -1;
    },

    reference() {
      const reference = this.$refs.reference;
      return reference.$el || reference;
    },

    refInput() {
      if (this.reference) {
        return [].slice.call(this.reference.querySelectorAll("input"));
      }
      return [];
    },

    valueIsEmpty() {
      const val = this.value;
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length; i < len; i++) {
          if (val[i]) {
            return false;
          }
        }
      } else {
        if (val) {
          return false;
        }
      }
      return true;
    },

    triggerClass() {
      return (
        this.prefixIcon ||
        (this.type.indexOf("time") !== -1 ? "el-icon-time" : "el-icon-date")
      );
    },

    selectionMode() {
      if (this.type === "week") {
        return "week";
      } else if (this.type === "month") {
        return "month";
      } else if (this.type === "year") {
        return "year";
      } else if (this.type === "dates") {
        return "dates";
      }
      //修改
      else if (this.type === "quarter") {
        return "quarter";
      } else if (this.type === "monthRange") {
        return "monthRange";
      } else if(this.type === "dateRange") {
        return "dateRange";
      } else if(this.type === "monthDateRange") {
        return "monthDateRange";
      } else if(this.type === "weekRange") {
        return "weekRange";
      } else if(this.type === "lastWeekRange") {
        return "lastWeekRange";
      }

      return "day";
    },

    haveTrigger() {
      if (typeof this.showTrigger !== "undefined") {
        return this.showTrigger;
      }
      return HAVE_TRIGGER_TYPES.indexOf(this.type) !== -1;
    },

    displayValue() {
      const formattedValue = formatAsFormatAndType(
        this.parsedValue,
        this.format,
        this.type,
        this.rangeSeparator
      );
      if (Array.isArray(this.userInput)) {
        return [
          this.userInput[0] || (formattedValue && formattedValue[0]) || "",
          this.userInput[1] || (formattedValue && formattedValue[1]) || "",
        ];
      } else if (this.userInput !== null) {
        return this.userInput;
      } else if (formattedValue) {
        return this.type === "dates"
          ? formattedValue.join(", ")
          : formattedValue;
      } else {
        return "";
      }
    },

    parsedValue() {
      if (!this.value) return this.value; // component value is not set
      if (this.type === "time-select") return this.value; // time-select does not require parsing, this might change in next major version
      const valueIsDateObject =
        isDateObject(this.value) ||
        (Array.isArray(this.value) && this.value.every(isDateObject));
      if (valueIsDateObject) {
        return this.value;
      }
      if (this.valueFormat) {
        return (
          parseAsFormatAndType(
            this.value,
            this.valueFormat,
            this.type,
            this.rangeSeparator
          ) || this.value
        );
      }

      // NOTE: deal with common but incorrect usage, should remove in next major version
      // user might provide string / timestamp without value-format, coerce them into date (or array of date)
      return Array.isArray(this.value)
        ? this.value.map((val) => new Date(val))
        : new Date(this.value);
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    pickerSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },

    pickerDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },

    firstInputId() {
      const obj = {};
      let id;
      if (this.ranged) {
        id = this.id && this.id[0];
      } else {
        id = this.id;
      }
      if (id) obj.id = id;
      return obj;
    },

    secondInputId() {
      const obj = {};
      let id;
      if (this.ranged) {
        id = this.id && this.id[1];
      }
      if (id) obj.id = id;
      return obj;
    },
  },

  created() {
    // vue-popper
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false,
    };
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left;

    this.$on("fieldReset", this.handleFieldReset);
  },

  methods: {
    focus() {
      if (!this.ranged) {
        this.$refs.reference.focus();
      } else {
        this.handleFocus();
      }
    },

    blur() {
      this.refInput.forEach((input) => input.blur());
    },

    // {parse, formatTo} Value deals maps component value with internal Date
    parseValue(value) {
      const isParsed =
        isDateObject(value) ||
        (Array.isArray(value) && value.every(isDateObject));
      if (this.valueFormat && !isParsed) {
        return (
          parseAsFormatAndType(
            value,
            this.valueFormat,
            this.type,
            this.rangeSeparator
          ) || value
        );
      } else {
        return value;
      }
    },

    formatToValue(date, ...args) {
      const isFormattable =
        isDateObject(date) || (Array.isArray(date) && date.every(isDateObject));
      if (this.valueFormat && isFormattable) {
        if(args && args.length > 0){
            //新加了args，用于将valueFormat等替换成args里的旧值
            return formatAsFormatAndType(date, ...args);
        }else {
            return formatAsFormatAndType(
                date,
                this.valueFormat,
                this.type,
                this.rangeSeparator,
                true
            );
        }
        // return formatAsFormatAndType(
        //   date,
        //   this.valueFormat,
        //   this.type,
        //   this.rangeSeparator,
        //   true
        // );
      } else {
        return date;
      }
    },

    // {parse, formatTo} String deals with user input
    parseString(value) {
      const type = Array.isArray(value)
        ? this.type
        : this.type.replace("range", "");
      return parseAsFormatAndType(value, this.format, type);
    },

    formatToString(value) {
      const type = Array.isArray(value)
        ? this.type
        : this.type.replace("range", "");
      return formatAsFormatAndType(value, this.format, type);
    },

    handleMouseEnter() {
      if (this.readonly || this.pickerDisabled) return;
      if (!this.valueIsEmpty && this.clearable) {
        this.showClose = true;
      }
    },

    handleChange() {
      if (this.userInput) {
        const value = this.parseString(this.displayValue);
        if (value) {
          this.picker.value = value;
          if (this.isValidValue(value)) {
            this.emitInput(value);
            this.userInput = null;
          }
        }
      }
      if (this.userInput === "") {
        this.emitInput(null);
        this.emitChange(null);
        this.userInput = null;
      }
    },

    handleStartInput(event) {
      if (this.userInput) {
        this.userInput = [event.target.value, this.userInput[1]];
      } else {
        this.userInput = [event.target.value, null];
      }
    },

    handleEndInput(event) {
      if (this.userInput) {
        this.userInput = [this.userInput[0], event.target.value];
      } else {
        this.userInput = [null, event.target.value];
      }
    },

    handleStartChange(event) {
      const value = this.parseString(this.userInput && this.userInput[0]);
      if (value) {
        this.userInput = [this.formatToString(value), this.displayValue[1]];
        const newValue = [value, this.picker.value && this.picker.value[1]];
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },

    handleEndChange(event) {
      const value = this.parseString(this.userInput && this.userInput[1]);
      if (value) {
        this.userInput = [this.displayValue[0], this.formatToString(value)];
        const newValue = [this.picker.value && this.picker.value[0], value];
        this.picker.value = newValue;
        if (this.isValidValue(newValue)) {
          this.emitInput(newValue);
          this.userInput = null;
        }
      }
    },

    handleClickIcon(event) {
      if (this.readonly || this.pickerDisabled) return;
      if (this.showClose) {
        this.valueOnOpen = this.value;
        event.stopPropagation();
        this.emitInput(null);
        this.emitChange(null);
        this.showClose = false;
        if (this.picker && typeof this.picker.handleClear === "function") {
          this.picker.handleClear();
        }
      } else {
        this.pickerVisible = !this.pickerVisible;
      }
    },

    handleClose() {
      if (!this.pickerVisible) return;
      this.pickerVisible = false;

      if (this.type === "dates") {
        // restore to former value
        const oldValue =
            parseAsFormatAndType(
                this.valueOnOpen,
                this.valueFormat,
                this.type,
                this.rangeSeparator
            ) || this.valueOnOpen;
        this.emitInput(oldValue, true);
      }else if(this.confirmable){
        // restore to former value
        //handleClose时，此时的valueFormat,format,type都是当前的值，需要触发事件close去修改type和valueFormat,format
        //触发事件后，此时获取oldValue，触发方法emitInput，以及emitInput中的formatToValue，这些方法里的valueFormat,format,type还是当前的值，需要把他们替换成typeOnOpen等旧值
        //emitInput执行完后，value变化，触发parsedValue，displayValue等方法,此时的valueFormat,format,type以及变成了旧值，无需替换操作
        this.$emit("close", this.typeOnOpen)
        this.togglePanel(this.typeOnOpen);
        const oldValue =
            parseAsFormatAndType(
                this.valueOnOpen,
                this.valueFormatOnOpen,
                this.typeOnOpen,
                this.rangeSeparator
            ) || this.valueOnOpen;
        this.emitInput(oldValue, this.valueFormatOnOpen, this.typeOnOpen, this.rangeSeparator, true);
      }
    },

    handleFieldReset(initialValue) {
      this.userInput = initialValue === "" ? null : initialValue;
    },

    handleFocus() {
      const type = this.type;

      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit("focus", this);
    },

    handleKeydown(event) {
      const keyCode = event.keyCode;

      // ESC
      if (keyCode === 27) {
        this.pickerVisible = false;
        event.stopPropagation();
        return;
      }

      // Tab
      if (keyCode === 9) {
        if (!this.ranged) {
          this.handleChange();
          this.pickerVisible = this.picker.visible = false;
          this.blur();
          event.stopPropagation();
        } else {
          // user may change focus between two input
          setTimeout(() => {
            if (this.refInput.indexOf(document.activeElement) === -1) {
              this.pickerVisible = false;
              this.blur();
              event.stopPropagation();
            }
          }, 0);
        }
        return;
      }

      // Enter
      if (keyCode === 13) {
        if (
          this.userInput === "" ||
          this.isValidValue(this.parseString(this.displayValue))
        ) {
          this.handleChange();
          this.pickerVisible = this.picker.visible = false;
          this.blur();
        }
        event.stopPropagation();
        return;
      }

      // if user is typing, do not let picker handle key input
      if (this.userInput) {
        event.stopPropagation();
        return;
      }

      // delegate other keys to panel
      if (this.picker && this.picker.handleKeydown) {
        this.picker.handleKeydown(event);
      }
    },

    handleRangeClick() {
      const type = this.type;

      if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
        this.pickerVisible = true;
      }
      this.$emit("focus", this);
    },

    hidePicker() {
      if (this.picker) {
        this.picker.resetView && this.picker.resetView();
        this.pickerVisible = this.picker.visible = false;
        this.destroyPopper();
      }
    },

    showPicker() {
      if (this.$isServer) return;
      if (!this.picker) {
        this.mountPicker();
      }
      this.pickerVisible = this.picker.visible = true;

      this.updatePopper();

      this.picker.value = this.parsedValue;
      this.picker.resetView && this.picker.resetView();

      this.$nextTick(() => {
        this.picker.adjustSpinners && this.picker.adjustSpinners();
      });
    },

    mountPicker() {
      this.picker = new Vue(this.panel).$mount();
      this.picker.defaultValue = this.defaultValue;
      this.picker.defaultTime = this.defaultTime;
      this.picker.popperClass = this.popperClass;
      this.popperElm = this.picker.$el;
      this.picker.width = this.reference.getBoundingClientRect().width;
      this.picker.showTime =
        this.type === "datetime" || this.type === "datetimerange"
      this.picker.selectionMode = this.selectionMode;
      this.picker.unlinkPanels = this.unlinkPanels;
      //custom 新增的prop
      this.picker.confirmable = this.confirmable;
      this.picker.isSinglePanel = this.isSinglePanel;
      this.picker.disableArrow = this.disableArrow;
      this.picker.isCustom = this.isCustom;
      this.picker.dateLimitOptions = this.dateLimitOptions;
      this.typeOnOpen = this.type;

      this.picker.arrowControl =
        this.arrowControl || this.timeArrowControl || false;
      this.$watch("format", (format) => {
        this.picker.format = format;
      });

      const updateOptions = () => {
        const options = this.pickerOptions;

        if (options && options.selectableRange) {
          let ranges = options.selectableRange;
          const parser = TYPE_VALUE_RESOLVER_MAP.datetimerange.parser;
          const format = DEFAULT_FORMATS.timerange;

          ranges = Array.isArray(ranges) ? ranges : [ranges];
          this.picker.selectableRange = ranges.map((range) =>
            parser(range, format, this.rangeSeparator)
          );
        }

        for (const option in options) {
          if (
            options.hasOwnProperty(option) &&
            // 忽略 time-picker 的该配置项
            option !== "selectableRange"
          ) {
            // console.log("option", option);
            this.picker[option] = options[option];
          }
        }

        // main format must prevail over undocumented pickerOptions.format
        if (this.format) {
          this.picker.format = this.format;
        }
      };
      updateOptions();
      this.unwatchPickerOptions = this.$watch(
        "pickerOptions",
        () => updateOptions(),
        { deep: true }
      );
      this.$el.appendChild(this.picker.$el);
      this.picker.resetView && this.picker.resetView();

      this.picker.$on("dodestroy", this.doDestroy);
      this.picker.$on("pick", (date = "", visible = false, clickConfirm = false) => {
        this.userInput = null;
        this.pickerVisible = this.picker.visible = visible;
        this.clickConfirm = clickConfirm
        this.emitInput(date);
        //TODO:对于monthRange,dateRange，weekRange来说，点击确认后，会有意外的问题，因此这几种类型在点击确认后，修改picker.value 的值，以解决这个意外问题
        if(Array.isArray(date) && this.confirmable && this.clickConfirm){
            this.picker.value = date
        }
        this.picker.resetView && this.picker.resetView();
      });
      this.picker.$on("select-range", (start, end, pos) => {
        if (this.refInput.length === 0) return;
        if (!pos || pos === "min") {
          this.refInput[0].setSelectionRange(start, end);
          this.refInput[0].focus();
        } else if (pos === "max") {
          this.refInput[1].setSelectionRange(start, end);
          this.refInput[1].focus();
        }
      });

      /** 自定义 */
      // 插槽 快捷选项插槽
      if (this.$slots.sidebar) {
        this.picker.$slots.sidebar = this.sidebar = this.$slots.sidebar;
      }
      //快捷选项自定义事件
      this.picker.$on("toggle-panel", (dateType = "", visible = true) => {
        this.togglePanel(dateType);
      });
      //取消
      this.picker.$on("cancel", () => {
        this.handleClose()
      });
    },

    unmountPicker() {
      if (this.picker) {
        this.picker.$destroy();
        this.picker.$off();
        if (typeof this.unwatchPickerOptions === "function") {
          this.unwatchPickerOptions();
        }
        this.picker.$el.parentNode.removeChild(this.picker.$el);
      }
    },
    /** 自定义 */
    //快捷选项自定义事件
    togglePanel(dateType) {
      this.picker.selectionMode = dateType;
      // 插槽 快捷选项插槽每次点击的时候重新赋值sidebar，以保持实时更新
      if (this.$slots.sidebar) {
        this.picker.$slots.sidebar = this.$slots.sidebar;
      }
      // this.pickerVisible = this.picker.visible = visible;
      //   this.emitInput(this.value);
      this.picker.resetView && this.picker.resetView();
      this.$emit("toggle-panel", dateType);
    },
    //切换快捷选项后，点击空白，触发一次选择
    emitChange(val) {
      // determine user real change only
      if (!valueEquals(val, this.valueOnOpen, this.type, this.typeOnOpen)) {
        this.$emit("change", val);
        this.valueOnOpen = val;
        if (this.validateEvent) {
          this.dispatch("ElFormItem", "el.form.change", val);
        }
      }
    },

    emitInput(val, ...args) {
      const formatted = this.formatToValue(val, ...args);
      if (!valueEquals(this.value, formatted, this.type, this.typeOnOpen)) {
        this.$emit("input", formatted);
      }
    },

    isValidValue(value) {
      if (!this.picker) {
        this.mountPicker();
      }
      if (this.picker.isValidValue) {
        return value && this.picker.isValidValue(value);
      } else {
        return true;
      }
    },
  },
};
</script>
