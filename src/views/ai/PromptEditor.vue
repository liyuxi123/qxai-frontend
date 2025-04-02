<template>
  <div class="prompt-editor">
    <h3>{{"参数名称:"+  model.paramName}}</h3>
    <el-input v-model="prompt" type="textarea" placeholder="输入 Prompt..." :rows="12" />

    <el-button
      :disabled="isSaveDisabled"
      @click="save"
      :class="{ 'enabled-button': !isSaveDisabled, 'disabled-button': isSaveDisabled }"
    >
      保存
    </el-button>



  </div>
</template>

<script>

import { updateSystemConfig } from "@/api/AIServer/AiAPI";
export default {
  props: {
    model: Object
  },
  data() {
    return {
      prompt: this.model.paramValue // 设置默认值为 model.name
    };
  },
  computed: {
    // 计算属性，判断文本框值是否发生变化
    isSaveDisabled() {
      return this.prompt === this.model.paramValue;
    }
  },
  methods: {
    save() {
        console.log('保存的内容:', this.model.id, this.model.paramKey,this.prompt);

  updateSystemConfig({
    sysId: this.model.id,
   // modelId: this.model.id,
    paramKey: this.model.paramKey,
    paramValue: this.prompt
  })
  .then(response => {
    console.log("更新成功", response);
    this.$message.success("参数更新成功");
  })
  .catch(error => {
    console.error("更新失败", error);
    this.$message.error("参数更新失败");
  });








    }
  }
};
</script>

<style scoped>
.prompt-editor {
  padding: 20px;
}

/* 禁用状态（灰色） */
.disabled-button {
  background-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed !important;
  border: none !important;
}

/* 启用状态（黑色） */
.enabled-button {
  background-color: black !important;
  color: white !important;
  cursor: pointer !important;
  border: none !important;
}
</style>
