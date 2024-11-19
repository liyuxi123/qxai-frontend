/* 
  年份选择时，
*/
import DatePicker from './src/picker/date-picker';

/* istanbul ignore next */
DatePicker.install = function install(Vue) {
  Vue.component("QcsDatePicker", DatePicker);
};

export default DatePicker;
