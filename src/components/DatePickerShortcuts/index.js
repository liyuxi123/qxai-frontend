/* 
  带快捷选项的时间组件
*/
import DatePickerShortcuts from './DatePickerShortcuts';

/* istanbul ignore next */
DatePickerShortcuts.install = function install(Vue) {
  Vue.component("DatePickerShortcuts", DatePickerShortcuts);
};

export default DatePickerShortcuts;
