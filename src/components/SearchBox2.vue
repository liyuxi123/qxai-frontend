<!-- src/components/SearchBox.vue -->
<template>
  <div class="search-wrapper">
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        @input="onInput"
        class="search-input"
      />
      <button
        @click="onSearch"
        :disabled="loading"
        class="search-button"
      >
        <div v-if="loading" class="loader"></div>
        <span v-else class="el-icon-search"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索...'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    onInput() {
      this.$emit('input', this.searchQuery);
    },
    onSearch() {
      this.$emit('search', this.searchQuery);
    }
  }
};
</script>

<style scoped>
.search-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input {
  width: calc(100% - 48px);
  padding: 12px 20px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.search-input:focus {
  background-color: #ffffff;
  border-color: black;
}

.search-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: #dadada;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  width: 36px;
  height: 36px;
}

.search-button:hover {
  background-color: black;
}

.search-button:disabled {
  background-color: #c6c6c6;
  cursor: not-allowed;
}

.loader {
  border: 2px solid #fff;
  border-top: 2px solid black;
  border-radius: 100%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

.icon {
  font-size: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
