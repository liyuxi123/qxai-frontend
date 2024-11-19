<template>
  <div>
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
        <div style="max-height: 73vh; overflow-y: auto;">
          <div v-html="data.remark"></div>
        </div>
        <hr style="margin-top: 20px; margin-bottom: 20px;" />
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';
import axios from 'axios';

export default {
  data() {
    return {
      dialogVisibleRemarkDataList: [], // 存储获取的备注数据
    };
  },
  methods: {
    exportPdf() {
      // 获取隐藏的元素
      const element = document.getElementById('remark-content');
      // 克隆元素并移除隐藏样式
      const cloneElement = element.cloneNode(true);
      cloneElement.style.display = 'block';

      // 查找并移除样式限制
      const scrollableDiv = cloneElement.querySelector('div[style="max-height: 73vh; overflow-y: auto;"]');
      if (scrollableDiv) {
        scrollableDiv.style.maxHeight = '';
        scrollableDiv.style.overflowY = '';
      }

      // 创建新的容器来存放克隆的内容
      const pdfContainer = document.createElement('div');
      pdfContainer.appendChild(cloneElement);

      // 确保所有图片加载完成后生成 PDF
      const images = cloneElement.querySelectorAll('img');
      const promises = Array.from(images).map(img => new Promise(resolve => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
        }
      }));

      Promise.all(promises).then(() => {
        const options = {
          margin: 10,
          filename: 'remark-content.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 3 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        };

        html2pdf().set(options).from(pdfContainer).save();
      });
    },

    fetchMetricsRemark(indIdList) {
      const url = 'http://192.168.66.105:8080/qxaillm/metrics/getMetricsRemarkByIndIdList';
      const params = {
        indIdList: indIdList,  // 使用父组件传递过来的 indIdList
      };

      axios.post(url, params)
        .then(response => {
          console.log('接口返回数据:', response.data);
          this.dialogVisibleRemarkDataList = response.data.data; // 更新数据列表
          this.exportPdf();
        })
        .catch(error => {
          console.error('接口调用失败:', error);
        });
    }
  },

  mounted() {
    if (this.indIdList.length > 0) {
      this.fetchMetricsRemark(this.indIdList); // 如果有 indIdList，则在组件挂载时获取数据
    }
  },
};
</script>
