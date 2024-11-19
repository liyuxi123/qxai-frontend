// user.js
import Cookie from "js-cookie";
export default {
  state: {
    user: null, // 保存用户信息
  },
  mutations: {
    setUser(state, user) {

      state.user = user; // 更新用户状态
        Cookie.set("user", user); // 存储用户数据到 Cookie
    },

    loadUser(state) {
      const user = Cookie.get("user"); // 从 Cookie 中获取用户数据
      if (user) {
        state.user = user; // 如果有用户数据，设置到 Vuex 状态中
      }
    }


  },
};
