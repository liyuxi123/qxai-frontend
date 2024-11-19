<template>
  <div>
    <el-button type="info" size="mini" icon="el-icon-download" @click="exportHtml">HTML</el-button>
    <!-- 隐藏的内容，页面上不显示 -->
    <div id="remark-content" style="display: none; top: 0px">
      <div v-for="(data, index) in dialogVisibleRemarkDataList" :key="index">
        <div style="font-weight: bolder; text-align: center; font-size: 20px">
          <span>
            {{ data.indName }}
            <i style="color: red" class="el-icon-warning-outline"></i>
          </span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 15px">
            <i class="el-icon-s-flag"></i>{{ data.indId }}
            <i class="el-icon-user-solid"></i>{{ ' ' + data.author }}
            <i class="el-icon-time"></i>{{ ' ' + data.updateTime }}
          </span>
        </div>
        <div>
          <span style="font-weight: bolder; color: brown; font-size: 16px">
            <i class="el-icon-question"></i>{{ data.remarkType }}
          </span>
        </div>
        <div>
          <span style="font-weight: bolder; font-size: 18px">
            <i class="el-icon-tickets"></i>
          </span>
        </div>
        <div>
          <div v-html="data.remark"></div>
        </div>
        <hr style="margin-top: 20px; margin-bottom: 20px;" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dialogVisibleRemarkDataList: [], // 存储获取的备注数据
    };
  },

  methods: {
    async exportHtml() {
      try {
        // 等待数据获取
        await this.fetchMetricsRemark();

        // 确保数据已加载
        if (this.dialogVisibleRemarkDataList.length === 0) {
          alert('没有可导出的数据。');
          return;
        }

        // 使用 nextTick 确保数据更新完成后再进行 HTML 导出
        this.$nextTick(() => {
          // 先确保所有数据渲染完成
          setTimeout(() => {
            // 获取 #remark-content 元素
            const element = document.getElementById('remark-content');

            // 将该元素显示出来进行导出
            element.style.display = 'block';




            // 获取元素的外部 HTML 内容
            const htmlContent = element.outerHTML;


            // 创建 Blob 对象，并生成一个 HTML 文件
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // 创建链接并下载 HTML 文件
            const link = document.createElement('a');
            link.href = url;
            link.download = 'remark-content.html';
            link.click();

            // 下载完成后，恢复元素的隐藏
            element.style.display = 'none';

            // 释放对象 URL
            URL.revokeObjectURL(url);
          }, 500); // 延迟 500ms 确保 DOM 渲染完毕
        });
      } catch (error) {
        console.error('导出失败:', error);
      }
    },

    async fetchMetricsRemark() {
      console.log("=======================");
      const url = 'http://192.168.66.105:8080/qxaillm/metrics/getMetricsRemarkByIndIdList';
      const params = {
            indIdList:  ['bn240300101']
      };

      try {
        const response = await axios.post(url, params);
        console.log('接口返回数据:', response.data);
        this.dialogVisibleRemarkDataList = response.data.data; // 更新数据列表
      } catch (error) {
        console.error('接口调用失败:', error);
      }
    },
  },
};
</script>
