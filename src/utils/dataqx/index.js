
import Vue from 'vue';


/**
 * 获取日期所在周的日期
 * @param {Date} Date 日期
 * @returns {String} 返回对应日期所在的一周的日期
 */
export const getWeekDates = (dateStr) => {
    if (!!dateStr && typeof dateStr === 'string' && dateStr.indexOf('T') !== -1) {
        dateStr = dateStr.replace('T', ' ');
    }
    let date = !!dateStr ? new Date(dateStr) : new Date()
    let week = date.getDay();
    let weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]
    let weekdayShorts = ['周一', '周二', '周三', '周四', '周五', '周六', '周日',]
    let weekDates = [], weekDatesFull = []
    for (let i = 0; i < 7; i++) {
        let ts = new Date(date.getTime() + 1000 * 60 * 60 * 24 * (i - (week + 6) % 7))
        let d = ts.toLocaleDateString().replace(/\//g, '-')
        weekDates.push(d);
        weekDatesFull.push(getDateInfo(d).date)
    }
    let weekIndex = week > 0 ? week - 1 : 6;
    return {
        weekDates,
        weekDatesFull,
        week,
        weekStart: weekDates?.[0],
        weekEnd: weekDates?.[6],
        weekStartFull: weekDatesFull?.[0],
        weekEndFull: weekDatesFull?.[6],
        weekday: weekdays[weekIndex],
        weekdayShort: weekdayShorts[weekIndex],
        weekdays,
        weekdayShorts,
    }
}


/**
 * 判断是否为空对象空数组
 * @param {Object} obj 对象
 * @returns {Boolean} 返回结果true或false
 */
export function isEmptyObject(obj) {
    for (let key in obj) {
        return false
    }
    return true
}

/** 获取日期信息
 * input (''/null/undefined/Date对象/时间戳/'yyyy-MM-dd'/...,注: 只要是new Date()支持的参数格式即可)
 * @param {Date|String} dateStr
 * @param {String} separator 日期分隔符(默认：'-')
 * @returns {Object} 返回日期信息
 */
export function getDateInfo(dateStr, separator = '-') {
    if (!!dateStr && typeof dateStr === 'string' && dateStr.indexOf('T') !== -1) {
        dateStr = dateStr.replace('T', ' ');
    }
    const date = !!dateStr ? new Date(dateStr) : new Date(),
        year = date.getFullYear(),
        lastMonth = date.getMonth() || 12,
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        week = date.getDay(),
        yearFull = formatNumber(year),
        monthFull = formatNumber(month),
        lastMonthFull = formatNumber(lastMonth),
        dayFull = formatNumber(day),
        hourFull = formatNumber(hour),
        minuteFull = formatNumber(minute),
        secondFull = formatNumber(second),
        dateInfoDate = yearFull + separator + monthFull + separator + dayFull,
        dateInfoDatePure = year + separator + month + separator + day,
        timeStamp = + date,
        weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekdayShorts = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        quarter = Math.floor((month + 2) / 3),
        quarterChinese = convertToChinaNum(quarter);
    const dateInfo = {
        date: dateInfoDate,
        dateShort: year + separator + month + separator + day,
        dateShortFull: year + separator + monthFull + separator + dayFull,
        dateMonthDay: monthFull + separator + dayFull,
        dateMonth: yearFull + separator + monthFull,
        dateStr: yearFull + monthFull + dayFull,
        year,
        month,
        monthFull,
        day,
        dayFull,
        hour,
        hourFull,
        minute,
        minuteFull,
        second,
        secondFull,
        time: dateInfoDatePure + ' ' + hour + ':' + minute + ':' + second,
        timeFull: dateInfoDate + ' ' + hourFull + ':' + minuteFull + ':' + secondFull,
        timeShortFull: dateInfoDate + ' ' + hourFull + ':' + minuteFull,
        times: dateInfoDatePure + ' ' + hourFull + ':' + minuteFull,
        ts: timeStamp,
        week,
        weekday: weekdays[week],
        weekdayShort: weekdayShorts[week],
        chineseCharacter: `${year}年${monthFull}月${dayFull}日`,
        noSecond: `${dateInfoDate} ${hourFull}:${minuteFull}`,
        quarter,
        quarterChinese,
        quarterChineseFull: `第${quarterChinese}季度`,
        noDay: hour + ':' + minute + ':' + second,
        noDayFull: hourFull + ':' + minuteFull + ':' + secondFull,
        lastMonth: (year - Number(month === 1)) + '年' + lastMonth + '月',
        lastMonthFull,
    };
    // 若 dateStr 参数为空，则清空值
    if (!dateStr) {
        Object.keys(dateInfo).forEach(function (key) {
            dateInfo[key] = '';
        });
    }
    return dateInfo
}


/**
 * 将小于10的数值前添加0 如：01
 * @param {String,Number} number 数值
 * @returns
 */
export function formatNumber(number) {
    return number <= 9 ? ('0' + number) : number
}


/**
 * 1.将阿拉伯数字转换为中文数字
 * @param {Number,String} num 数字
 * @returns {String} 返回对应的中文数字
 */
export function convertToChinaNum(num) {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值
    if (!num || isNaN(num)) {
        return "零";
    }
    var english = num.toString().split("")
    var result = "";
    for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i;//倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
    }
    //将【零千、零百】换成【零】 【十零】换成【十】
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    //合并中间多个零为一个零
    result = result.replace(/零+/g, '零');
    //将【零亿】换成【亿】【零万】换成【万】
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    //将【亿万】换成【亿】
    result = result.replace(/亿万/g, '亿');
    //移除末尾的零
    result = result.replace(/零+$/, '')
    //将【零一十】换成【零十】
    //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
    //将【一十】换成【十】
    result = result.replace(/^一十/g, '十');
    return result;
}



