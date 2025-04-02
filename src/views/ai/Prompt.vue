<template>
  <div class="model-table-container">
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab">
      <el-tab-pane label="模型列表" name="modelTable">
        <!-- 右上角数字时钟 -->
        <div class="clock">{{ currentTime }}</div>

        <!-- 搜索框和筛选 -->
        <div class="search-bar">
          <el-input v-model="searchQuery" placeholder="输入参数名称搜索" clearable class="search-input" />
          <el-select v-model="paramModule" placeholder="选择参数模块" clearable class="select-category">
            <el-option v-for="item in paramModules" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 参数表格 -->
        <el-table :data="paginatedRows" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="paramName" label="参数名称">
            <template slot-scope="scope">
              <el-tag type="success" @click="addTab(scope.row)">
                {{ scope.row.paramName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="paramKey" label="参数键名" />
          <el-table-column prop="paramValue" label="参数值" />
          <el-table-column prop="paramModule" label="参数模块" />
          <el-table-column prop="paramType" label="参数类型" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="addTime" label="添加时间" />
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
          layout="total, prev, pager, next, jumper"
        />
      </el-tab-pane>

      <!-- 其他标签 -->
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
        <PromptEditor :model="tab.model" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PromptEditor from "./PromptEditor.vue";
import { getPromptdata } from "@/api/AIServer/AiAPI";

export default {
  components: { PromptEditor },
  data() {
    return {
      currentTime: '',
      searchQuery: '',
      paramModule: '',
      paramModules: [], // 这里改成动态获取
      rows: [],
      currentPage: 1,
      pageSize: 3,
      total: 0,
      activeTab: "modelTable",
      tabs: []
    };
  },
  computed: {
    filteredRows() {
      return this.rows.filter(row =>
        (!this.searchQuery || row.paramName.includes(this.searchQuery)) &&
        (!this.paramModule || row.paramModule === this.paramModule)
      );
    },
    paginatedRows() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredRows.slice(start, end);
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1;
      this.fetchPromptData();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchPromptData();
    },
    addTab(row) {
      const tabName = `tab-${row.id}`;
      if (!this.tabs.find(tab => tab.name === tabName)) {
        this.tabs.push({ name: tabName, label: row.paramName, model: row });
      }
      this.activeTab = tabName;
    },
    removeTab(targetName) {
      this.tabs = this.tabs.filter(tab => tab.name !== targetName);
      if (this.activeTab === targetName) {
        this.activeTab = this.tabs.length ? this.tabs[0].name : "modelTable";
      }
    },
    updateTime() {
      this.currentTime = new Date().toLocaleString();
    },
    fetchPromptData() {
      getPromptdata()
          .then(response => {
            const data = response.data.data;
            this.rows = data.rows;
            this.total = data.count;

            // 生成唯一的 paramModule 列表
            this.paramModules = [...new Set(data.rows.map(item => item.paramModule))];
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.fetchPromptData();
  }
};
</script>

<style scoped>
.model-table-container {
  padding: 20px;
  background-color: white;
}

.clock {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  margin-right: 10px;
  width: 30%;
}

.select-category {
  margin-right: 10px;
  width: 150px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
