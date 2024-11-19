<template>
  <el-form
    ref="form"
    label-width="70px"
    :inline="true"
    class="login-container"
    :model="form"
    :rules="rules"
  >
    <h3 class="login_title">全息数据</h3>
    <el-form-item label="" prop="userid">
      <el-input
        v-model="form.userid"
        placeholder="账号"
        @keyup.enter="submit"
      ></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        type="password"
        v-model="form.password"
        placeholder="密码"
        @keyup.enter="submit"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="submit"
        class="login-button"
        type="text"
      >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Cookie from "js-cookie";
import { getMenu } from "../api/loginServer/loginAPI";

export default {
  data() {
    return {
      form: {
        userid: "",
        password: "",
      },
      rules: {
        userid: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          getMenu(this.form).then(({ data }) => {
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
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 350px;
  border: 1px solid #eaeaea;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 25px #eaeaea;
  display: flex;
  flex-direction: column;
  align-items: center;

  .login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458;
  }
  .el-input {
    width: 250px;
  }
  .login-button {
    margin-top: 20px;
    color: #505458;
  }

::v-deep(.el-input__inner) {
  background-color: white; /* 默认背景为黑色 */
}

::v-deep(.el-input__inner:focus),
::v-deep(.el-input__inner:not(:placeholder-shown)) {
  background-color: white; /* 有内容或获得焦点时的背景色 */
}



}
</style>
