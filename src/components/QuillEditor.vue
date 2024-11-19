<template>
  <div>
    <div ref="editor" class="quill-editor" spellcheck="false"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      this.editor = new Quill(this.$refs.editor, {
        theme: 'snow',
        modules: {
          toolbar: [
                  [{ 'color': ['#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#000000'] }],
               [{ 'background': ['#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff'] }],
                [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义字体大小选项
            ['bold', 'italic', 'underline'],
            [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
            ['clean'], // 清除格式按钮
          ],
        },
      });

      if (this.value) {
        this.editor.clipboard.dangerouslyPasteHTML(this.value);
      }

      this.editor.on('text-change', () => {
        const content = this.editor.root.innerHTML;
        this.$emit('input', content);
      });

      // 监听粘贴事件
  // 使用 addMatcher 来拦截粘贴的内容，检查是否为 URL 图片
      this.editor.clipboard.addMatcher('img', (node, delta) => {
        const imageUrl = node.getAttribute('src');
        if (imageUrl && !imageUrl.startsWith('data:')) {
          // 如果是 URL 图片，弹出确认框
            this.confirmImageInsertion()
             return { ops: [] };  // 返回空的 ops 数组，表示没有插入任何内容
        }
        return delta; // 非 URL 图片正常处理
      });
    },

    // 弹窗确认用户操作
    confirmImageInsertion() {
      return new Promise((resolve) => {
        const message = '本系统禁止粘贴外部URL图片！！！' +
            '\n为了保证你的图片数据有效存储（断网也能使用）' +
            '\n请下载图片到本地或使用截图方式进行粘贴';

        const userConfirmed = window.confirm(message);
        resolve(userConfirmed); // 返回用户确认结果
      });


    },



    setContent(content) {
      if (this.editor) {
        this.editor.clipboard.dangerouslyPasteHTML(content);
      }
    },
  },
};
</script>

<style scoped>
.quill-editor {
  font-size: 17px;
  height: 65vh;
}
</style>
