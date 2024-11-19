// activityMonitor.js

import Cookie from 'js-cookie'; // 确保你已安装 js-cookie 库





// 用户活动超时设置
const INACTIVITY_TIMEOUT = process.env.VUE_APP_INACTIVITY_TIMEOUT*60*1000

console.log("INACTIVITY_TIMEOUT"+INACTIVITY_TIMEOUT)

let inactivityTimer;

// 用户活动事件监听函数
function resetTimer() {
  console.log('User activity detected, resetting timer...');
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    console.log('Inactivity timeout reached, redirecting...');
    // 清除cookie中的token
    Cookie.remove("token");
    // 清除cookie中的menu
    Cookie.remove("menu");
    // 跳转到登录页
    window.location.href = '/login'; // 使用 window.location.href 跳转
  }, INACTIVITY_TIMEOUT);
}

// 监听用户活动事件
function setupActivityListeners() {
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  window.addEventListener('click', resetTimer);
  window.addEventListener('scroll', resetTimer);
}

// 启动活动监听
function startMonitoring() {
  setupActivityListeners();
}

// 导出启动函数
export default startMonitoring;
