<!-- https://blog.csdn.net/weixin_44786530/article/details/131084103 -->
<template>
  <div
      class="container b-container"
      id="b-container">
    <form class="form">
      <div style="display: flex;  align-items: center; ">
        <img src="@/assets/qxyl_logo.png" alt="水面" class="water-image"/>
        <h2 class="form_title title">全息数据平台</h2>
      </div>
      <input
          v-model="form.userid"
          class="form__input"
          type="text"
          placeholder="用户"
      />
      <input
          v-model="form.password"
          class="form__input"
          type="password"
          placeholder="密码"
      />

      <el-button
          @click="submit"
          class="form__button button submit"
          style="color: black;"
      >登录
      </el-button>
    </form>

  </div>
</template>

<script>
import Mock from "mockjs";
import Cookie from "js-cookie";
import {getMenu} from "../api/loginServer/loginAPI";

export default {
  data() {
    return {
      form: {
        userid: "",
        password: "",
      },
    };
  },
  methods: {
    submit() {
      // 校验用户名和密码不能为空
      if (this.form.userid.trim() === '') {
        alert('用户不能为空！');
        return; // 退出函数，不执行后续逻辑
      }
      if (this.form.password === '') {
        alert('密码不能为空！');
        return; // 退出函数，不执行后续逻辑
      }
      // 校验通过，执行 getMenu
      getMenu(this.form).then(({data}) => {
        if (data.code === 200) {
          Cookie.set("token", data.data.token);
          this.$store.commit("setUser", data.data.username);
          this.$store.commit("setMenu", data.data.menu);
          this.$store.commit("addMenu", this.$router);
          this.$router.push("/home");
        } else {
          this.$message.error(data.data.message);
        }
      });
    },
  }
};
</script>
<style scoped>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

*, *::after, *::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  width: 100%;
  min-height: 100vh; /* 使用视口高度 */

  padding: 25px;
  background-color: #ecf0f3;
  transition: 1.25s;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: -20vh; /* 距离顶部40%的高度 */

}

.form__input {
  width: 350px;
  height: 40px;
  margin: 4px 0;
  padding-left: 16px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  font-family: "Montserrat", sans-serif;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

/* 设置自动填充背景色 */
.form__input:-webkit-autofill {
  background-color: #f9f9f9 !important; /* 修改为需要的背景色 */
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9; /* 保持原来的阴影 */
  -webkit-text-fill-color: #333; /* 设置文本颜色 */
  transition: background-color 5000s ease-in-out 0s; /* 避免闪烁 */
}

.form__input:focus {
  box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
}

.title {
  font-size: 25px;
  font-weight: 700;
  line-height: 3;
}

.water-image {
  width: 35px; /* 图片宽度 */
  height: 40px; /* 高度自适应 */
  margin-right: 5px; /* 图片和文字之间的间距 */
}

.button {
  width: 350px;
  height: 40px;
  margin: 4px 0;
  padding-left: 16px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  font-family: "Montserrat", sans-serif;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
  box-shadow: 4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff; /* 去掉 inset，使用外阴影 */
}

.button:hover {
  color: black;
  box-shadow: none; /* 去掉阴影 */
}


.button:active {
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff; /* 凹陷效果 */

}

.b-container {
  z-index: 0;
}

@keyframes is-gx {
  0%, 10%, 100% {
    width: 400px;
  }
  30%, 50% {
    width: 500px;
  }
}

</style>