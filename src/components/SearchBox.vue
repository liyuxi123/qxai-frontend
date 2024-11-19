<template>
  <div class="search-wrapper">
    <div
      class="search-container"
      @mouseleave="hideDropdown"
    >
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        @focus="showDropdown = true"
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



      <div v-if="showDropdown" class="dropdown">
        <div class="dropdown-item" v-for="item in history" :key="item" @click="selectHistory(item)">
          <i class="el-icon-search" style="color: dimgrey ;font-weight: bolder"></i> {{ item }} <!-- 历史记录图标 -->
        </div>
        <div class="dropdown-item" v-for="item in hotSearches" :key="item" @click="selectHotSearch(item)">
          <i class="el-icon-search" style="color: red ;font-weight: bolder"></i> {{ item }} <!-- 热搜图标 -->
        </div>
      </div>
    </div>
       <!-- 增加的开关按钮 -->

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
      searchQuery: '',
      showDropdown: false,
      history: ['DW层数据库文档','最近修改的指标是哪些？', '最慢的指标是哪些？', '复杂的指标？'],
      hotSearches: ['手术类指标', '王磊', '三甲指标','今天天气怎么样','上证指数'],
      isSwitchOn: false, // 开关状态
    };
  },
  methods: {
    onInput() {
      this.$emit('input', this.searchQuery);
    },
    onSearch() {
      this.$emit('search', this.searchQuery);
      this.showDropdown = false; // 隐藏下拉菜单
    },
    selectHistory(item) {
      this.searchQuery = item;
      this.onSearch();
    },
    selectHotSearch(item) {
      this.searchQuery = item;
      this.onSearch();
    },
    hideDropdown() {
      this.showDropdown = false; // 隐藏下拉菜单
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

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  padding: 2px; /* 调整内边距 */
  cursor: pointer;
  display: flex; /* 使用 Flexbox 对齐图标和文本 */
  align-items: center; /* 垂直居中对齐 */
  font-size: 14px; /* 设置较小的字体大小 */
}

.dropdown-item i {
  margin-right: 8px; /* 图标和文本之间的间距 */
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.switch-button {
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
}
</style>
