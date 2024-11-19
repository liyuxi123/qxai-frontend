<template>
  <div ref="container" class="monaco-editor-container"></div>
</template>

<script>
import * as monaco from 'monaco-editor';

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'sql'
    },
    theme: {
      type: String,
      default: 'vs-dark'
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    value(val) {
      if (this.editor && val !== this.editor.getValue()) {
        this.editor.setValue(val);
      }
    }
  },
  mounted() {
    this.editor = monaco.editor.create(this.$refs.container, {
      value: this.value,
      language: this.language,
      theme: this.theme,
      ...this.options
    });

    this.editor.onDidChangeModelContent(() => {
      const newValue = this.editor.getValue();
      if (newValue !== this.$emit('input', newValue)) {
        this.$emit('input', newValue);
      }
    });
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }
};
</script>

<style scoped>
.monaco-editor-container {
  height: 500px; /* Adjust height as needed */
}
</style>
