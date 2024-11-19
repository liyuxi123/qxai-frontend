<template>
  <div class="sql-editor-page">
    <div class="actions">
      <el-button-group>
        <el-button

          size="small"
          @click="executeSql"
          :loading="loading && activeButton === 'execute'"
          :disabled="loading && activeButton !== 'execute'"
        >执行 SQL</el-button>
        <el-button

          size="small"
          @click="clearSql"
          :loading="loading && activeButton === 'clear'"
          :disabled="loading && activeButton !== 'clear'"
        >清除</el-button>
        <el-button

          size="small"
          @click="resetSql"
          :loading="loading && activeButton === 'reset'"
          :disabled="loading && activeButton !== 'reset'"
        >重置</el-button>
        <el-button

          size="small"
          @click="saveSql"
          :loading="loading && activeButton === 'save'"
          :disabled="loading && activeButton !== 'save'"
        >保存</el-button>
        <el-button

          size="small"
          @click="loadSql"
          :loading="loading && activeButton === 'load'"
          :disabled="loading && activeButton !== 'load'"
        >加载</el-button>
        <el-popover
          title="数据库连接信息"
          width="500"
          trigger="click"
          :content="databaseConnectionInfo">
          <el-button
            slot="reference"

            size="small"
          >数据库连接信息</el-button>
        </el-popover>
        <el-button

          size="small"
          @click="AISql"
          :loading="loading && activeButton === 'AI'"
          :disabled="loading && activeButton !== 'AI'"
        >AI优化</el-button>
      </el-button-group>
    </div>
    <MonacoEditor
      v-model="sqlQuery"
      language="sql"
      theme="vs-dark"
      :options="editorOptions"
    ></MonacoEditor>

    <div class="result">
      <!-- 加载动画 -->
      <div v-if="loading" class="loading-container">
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <p>加载中{{ elapsedTime }}秒</p>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>

      <!-- SQL结果 -->
      <div class="table-wrapper" v-if="!loading && showTable">
        <div class="pagination">
          <span class="demonstration">用时：{{ elapsedTime }}秒</span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="resultData.length"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
        <el-table :data="paginatedData" class="small-table" border :row-class-name="getRowClassName" @row-click="handleRowClick">
          <el-table-column
            v-for="column in tableColumns"
            :key="column"
            :prop="column"
            :label="column"
            width="150">
            <template slot-scope="scope">
              <div class="cell-content">{{ scope.row[column] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- SQL日志 -->
      <div class="logs" v-else-if="!loading && showLogs">
           <span class="demonstration">用时：{{ elapsedTime }}秒</span>
           <pre>{{ logMessage }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor.vue';
import baiduAi128Server from '@/api/baiduAiServer/ApiErnieSpeed128kService';

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      editorOptions: '',
      selectedRow: null,
      sqlQuery: 'SELECT * FROM users;',
      resultData: [],
      tableColumns: [],
      currentPage: 1,
      pageSize: 10,
      showLogs: false,
      loading: false,
      showTable: false,
      databaseConnectionInfo: 'IP 地址:\'192.168.1.1\'\n数据库名:\'test_db\'\n端口:13456',
      savedSql: '',
      elapsedTime: 0,
      timer: null,
      logMessage: '',
      activeButton: '' // 记录当前活跃的按钮
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.resultData.slice(start, end);
    }
  },
  methods: {
    setLoading(buttonName) {
      this.loading = true;
      this.activeButton = buttonName;
      this.elapsedTime = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.elapsedTime += 1;
      }, 1000);
    },
    clearLoading() {
      this.loading = false;
      this.activeButton = '';
      clearInterval(this.timer);
    },


    executeSql() {
      this.setLoading('execute');
      setTimeout(() => {
        try {
          this.mockSqlExecution();
          this.showLogs = false;
          this.showTable = true;
        } catch (error) {
          this.logMessage = `Error: ${error.message}`;
          this.showTable = false;
          this.showLogs = true;
        } finally {
          this.clearLoading();
        }
      }, 1000);
    },
    clearSql() {
      this.setLoading('clear');
      setTimeout(() => {
        this.sqlQuery = '';
        this.clearLoading();
      }, 9000);
    },
    resetSql() {
      this.setLoading('reset');
      setTimeout(() => {
        this.sqlQuery = 'SELECT * FROM users;';
        this.clearLoading();
      }, 9000);
    },
    saveSql() {
      this.setLoading('save');
      setTimeout(() => {
        this.savedSql = this.sqlQuery;
        this.showLoadingAndLogs('SQL query saved.');
        this.clearLoading();
      }, 9000);
    },
    loadSql() {
      this.setLoading('load');
      setTimeout(() => {
        if (this.savedSql) {
          this.sqlQuery = this.savedSql;
          this.showLoadingAndLogs('SQL query loaded.');
        } else {
          this.showLoadingAndLogs('No saved SQL query found.');
        }
        this.clearLoading();
      }, 9000);
    },
  async  AISql() {
       this.setLoading('AI'); //加载动画
       let  canShu=[{"role": "user", "content": this.sqlQuery+' '+'优化一下该sql语句',}];
       try {
         let responseData= await baiduAi128Server.sendRequest(canShu);
         this.showLoadingAndLogs(responseData.result)
        } catch (error) {
          this.showLoadingAndLogs(error);
        } finally {
          this.clearLoading();
        }
    },
    showLoadingAndLogs(message) {
      this.showLogs = true;
      this.logMessage = message;
      this.loading = false; // 这里我们不需要显示加载动画，因为它已经在其他地方显示
      this.showTable = false; // 确保不显示结果表格
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
    handleRowClick(row) {
      this.selectedRow = row;
    },
    getRowClassName({ row }) {
      return row === this.selectedRow ? 'selected-row' : '';
    },
    mockSqlExecution() {
      this.resultData = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
                  { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
        // 添加更多数据
      ];
      this.tableColumns = Object.keys(this.resultData[0]);
    }
  }
};
</script>





<style scoped>
.sql-editor-page {
  padding: 0;
    margin: 0;  /* 移除所有外边距 */
  top: 0; /* 保证页面最上面不留空 */
  position: relative;
}

.result {

      border: none; /* 确保没有边框 */
  margin: 0; /* 确保没有外边距 */
  padding: 0; /* 确保没有内边距 */
}

.pagination {
  display: flex;
  margin-top: 0px;
}

.el-pagination {
    font-weight: bolder;
  margin-top: 0px;
  font-size: 15px;
  margin-left: 10px; /* 分页组件与文字之间的间距 */
}

.demonstration {
  color: red;
  font-size: 13px;
  margin-top: 7px;
  margin-right: 30px; /* 文字和分页组件之间的间距 */
}

.table-wrapper {
  position: relative;
  width: auto;
  height: 400px; /* 固定表格容器高度 */
  overflow: auto; /* 启用滚动条 */

}

.table-container {
  position: relative;
  width: 100%;
}

.small-table {
  width: 100%; /* 表格宽度 100% */
  border-collapse: collapse; /* 表格边框合并 */
}

.small-table .el-table__header-wrapper {
  position: sticky; /* For modern browsers */
  top: 0; /* 固定在顶部 */
  z-index: 10; /* 确保表头在内容上方 */
  background-color: #333; /* 表头背景色 */
}



::v-deep .el-table th {
  background-color: #333 !important; /* 表头背景为深灰色 */
  color: #fff !important; /* 表头文字为白色 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5) !important; /* 阴影效果 */
  text-align: center !important; /* 表头文字居中 */
  font-weight: bold !important; /* 增加文字粗细 */
}

::v-deep .el-table td {
  padding: 3px 6px; /* 调整单元格的填充 */
  height: 10px; /* 固定单元格高度 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 内容超出时显示省略号 */
  white-space: nowrap; /* 不允许文本换行 */
  border: 1px solid black !important; /* 单元格边框为深灰色 */
  background-color: white !important; /* 单元格背景为黑色 */
  color: black !important; /* 单元格文字为白色 */
}

.small-table .el-table__row td {
  border-bottom: 1px solid #444 !important; /* 行与行之间的分割线 */
}
/* 设置选中行的背景色 */
::v-deep .el-table .selected-row td{
  background-color: black !important; /* 选中行的背景色 */
}

/* 设置选中行的字体颜色 */
::v-deep .el-table .selected-row td {
  color: white !important; /* 选中行的字体颜色 */
}

/* 设置选中行的边框颜色 */
::v-deep .el-table .selected-row td{
  border: 1px solid white !important; /* 单元格边框为深灰色 */
}



.cell-content {
  height: 100%; /* 让内容充满单元格 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 强制不换行 */
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* 根据需求调整 */
}

.dots {
  display: flex;
  gap: 50px; /* 点与点之间的间距 */
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #333;
  animation: dot-blink 1.5s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.dot:nth-child(4) {
  animation-delay: 0.6s;
}

.dot:nth-child(5) {
  animation-delay: 0.8s;
}

@keyframes dot-blink {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.logs {
  height: 400px; /* 固定高度，根据需要调整 */
  overflow-y: auto; /* 超出时启用垂直滚动条 */
  border: 1px solid #ccc; /* 可选: 添加边框 */
  padding: 10px; /* 可选: 内边距 */
  background-color: #f9f9f9; /* 可选: 背景色 */
}

</style>
