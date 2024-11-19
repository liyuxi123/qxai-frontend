<template>
  <div>
     <div id="remark-content" v-html="editorContent"></div>
        <el-button type="primary" @click="exportPdf">导出 PDF</el-button>
    <el-button type="primary" @click="getContent">查看</el-button>
    <el-button type="primary" @click="submitContent">提交</el-button>
    <!-- 使用 v-model 来双向绑定 editorContent -->
    <QuillEditor ref="quillEditor" v-model="editorContent" />
  </div>
</template>

<script>
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import QuillEditor from '@/components/QuillEditor.vue';

export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      editorContent: '', // 编辑器的初始内容
    };
  },
  methods: {
    // 获取内容
    async getContent() {
      try {
        const response = await axios.get('http://192.168.66.166:6812/qxaillmMaster/api/getContent');
        // 如果返回的数据为空，设置为 ''
        this.editorContent = response.data.data || '';
          // 调用子组件的 setContent 方法来更新编辑器内容
         this.$refs.quillEditor.setContent(this.editorContent);
      } catch (error) {
        this.$message.error('获取内容失败：' + error.message);
        this.editorContent = ''; // 获取失败时显示空白编辑器
      }
    },

    // 提交内容
    async submitContent() {
      const richText = this.editorContent;

      try {
        await axios.post('http://192.168.66.166:6812/qxaillmMaster/api/saveContent', { richText });
        this.$message.success('内容保存成功！');
      } catch (error) {
        this.$message.error('保存失败：' + error.message);
      }
    },



     exportPdf() {
    // 选择包含富文本内容的元素
    const element = document.getElementById('remark-content');

    // 配置 PDF 导出选项
    const options = {
      margin: 10,
      filename: '富文本内容.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 调用 html2pdf 进行导出
      html2pdf().set(options).from(element).save();
  },
  },
  mounted() {
    this.getContent(); // 初始化加载内容
  },
};
</script>

<style scoped>
/* 页面样式 */
</style>
