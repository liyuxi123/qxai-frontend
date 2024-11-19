<template>



    <div>
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

     <MonacoEditor style="height: 350px"
      v-model="sqlQuery"
      language="sql"
      theme="vs-dark"
      :options="editorOptions"
    ></MonacoEditor>

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
<!--      sql查询结果-->
      <div  class="table-container"  v-if="!loading && showTable">
      <div class="pagination-container">
      <span  style="font-size:13px;color: goldenrod ">用时{{ elapsedTime }}秒</span>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="resultData.length"
      layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      </div>
        <el-table  v-if="!loading && showTable" :data="paginatedData"
                   height="400"
                   border
                   >
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

 <!--      其他按钮显示结果-->
           <div class="other-result" v-else-if="!loading && showLogs">
           <span  style="font-size:13px;color: goldenrod ">用时{{ elapsedTime }}秒</span>
           <pre>{{ logMessage }}</pre>
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
      }, 3000);
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
        { id: 1, name: 'John Doe', email: 'john@examplexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexampleexamplee.com' },
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

.table-container {
  width: 100%;
  overflow-x: auto; /* 启用横向滚动条 */
}

.el-table  .cell-content {
   padding: 0px; /* 调整内边距 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden;    /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 使用省略号表示溢出部分 */
}

::v-deep .el-table .el-table__row {
  height: 24px !important; /* 强制设置行高 */
  line-height: 24px; /* 设置行内文本的行高 */
}

::v-deep .el-table .el-table__cell {
  padding: 0px !important; /* 调整单元格内边距 */
}

.pagination-container {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 调整间距 */
}

.pagination-container span {
  margin-right: 10px; /* 调整与分页组件的间距 */
}



.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* 根据需求调整 */
}

.dots {
  display: flex;
  gap: 45px; /* 点与点之间的间距 */
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #333;
  animation: dot-blink 1.0s infinite;
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

.other-result {
  height: 400px; /* 固定高度，根据需要调整 */
  overflow-y: auto; /* 超出时启用垂直滚动条 */

  padding: 10px; /* 可选: 内边距 */
  background-color: white; /* 可选: 背景色 */
}

</style>
