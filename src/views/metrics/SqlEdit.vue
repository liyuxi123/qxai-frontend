<template>
  <div>
    <el-button-group>
      <el-popover
          placement="top"
          width="300"
          trigger="click">
        <div v-for="(pair, index) in replacePairs" :key="index" class="replace-bar">
          <el-input style="width: 100px"
                    v-model="pair.search"
                    size="small"
          />
          <div>
            <div>
              <el-button
                  icon="el-icon-right"
                  circle
                  @click="replaceContent(pair.search, pair.replace)"
                  size="mini"
              />
            </div>
            <div>
              <el-button
                    circle
                  icon="el-icon-back"
                  @click="replaceContent(pair.replace, pair.search)"
                  size="mini"
              />
            </div>
          </div>
          <el-input style="width: 200px"
                    v-model="pair.replace"
                    size="small"
          />
        </div>
        <el-button slot="reference" size="small">参数替换</el-button>
      </el-popover>

      <el-button
          type="success"
          size="small"
          @click="executeSql"
          :loading="loading && activeButton === 'execute'"
          :disabled="loading && activeButton !== 'execute'"
      >执行 SQL
      </el-button>


      <el-button
          size="small"
          @click="reSetSql"
          :loading="loading && activeButton === 'reset'"
          :disabled="loading && activeButton !== 'reset'"
      >重置
      </el-button>

      <el-button
          size="small"
          @click="AISql"
          :loading="loading && activeButton === 'AI'"
          :disabled="loading && activeButton !== 'AI'"
      >AI帮助
      </el-button>
      <el-button
          size="small"
          @click="formatQuery"
      >格式化SQL
      </el-button>
  <el-tooltip :content="sqlType === 'sqlTotal' ? '保存计算总值的SQL' : '保存计算明细的SQL'" placement="top">
      <el-button
          size="small"
          @click="saveSql"
          :loading="loading && activeButton === 'save'"
          :disabled="loading && activeButton !== 'save'"
      >保存
      </el-button>
  </el-tooltip>
         <el-button
          size="small"
          @click="openAPI"
      >更新
      </el-button>
     <el-button
          size="small"
          @click="openDsInfo"
      >数据库信息
      </el-button>

    </el-button-group>
    <MonacoEditor style="height: 500px "
                  v-model="sqlQuery"
                  language="sql"
                  theme="vs-dark"
                  :options="{wordWrap: 'on'}"
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
    <div class="table-container" v-if="!loading && showTable">
      <div class="pagination-container">
        <span style="font-size:13px;color: goldenrod ">用时{{ elapsedTime }}秒</span>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <el-table v-if="!loading && showTable" :data="resultData"
                height="280"
                border
      >
        <el-table-column
            v-for="column in tableColumns"
            :key="column"
            :prop="column"
            :label="column"
            width="200">
          <template slot-scope="scope">
            <div class="cell-content">{{ scope.row[column] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--      其他按钮显示结果-->
    <div class="other-result" v-else-if="!loading && showLogs">
      <span style="font-size:13px;color: goldenrod ">用时{{ elapsedTime }}秒</span>
      <pre>{{ logMessage }}</pre>
    </div>


  </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor.vue';
import baiduAi128Server from '@/api/baiduAiServer/ApiErnieSpeed128kService';
import {EventBus} from "@/utils/eventBus/event-bus";
import {updateMetric, getMetricByIndId,runSql} from "@/api/metricsServer/metricsAPI"
import {mapState} from 'vuex'
import {MessageBox} from "element-ui";
import {formatSQL} from '@/utils/sqlFormatter'; // 引入 SQL 格式化函数


export default {
  props: {
    tabData: {
      type: Object,
      default: () => ({})
    },
    sql: {
      type: String,
      default: ''
    },
    sqlType: String,
  },
  components: {
    MonacoEditor
  },
  data() {
    return {
      editorOptions: {
        wordWrap: 'on' // 自动换行
      },
      selectedRow: null,
      sqlQuery: this.sql,
      resultData: [],
      tableColumns: [],
      currentPage: 1,
      pageSize: 10,
      total:0,
      showLogs: false,
      loading: false,
      showTable: false,
      databaseConnectionInfo: '',
      elapsedTime: 0,
      timer: null,
      logMessage: '',
      activeButton: '', // 记录当前活跃的按钮
      metricsRuleForm: JSON.parse(JSON.stringify(this.tabData)), // 使用深拷贝 metricsRuleForm 就可以独立于 tabData 修改，而不会造成相互影响
      // metricsRuleForm:this.tabData
      replacePairs: [
        {search: '{D1}', replace: '\'2024-01-01 00:00:00\''},
        {search: '{D2}', replace: '\'2024-01-31 23:59:59\''}
      ],
    };
  },

  computed: {
    // paginatedData() {
    //   const start = (this.currentPage - 1) * this.pageSize;
    //   const end = start + this.pageSize;
    //   return this.resultData.slice(start, end);
    // },
    ...mapState({
      user: state => state.user.user
    })
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
      // 检查 this.sqlQuery 是否为空或仅包含空白字符
      if (!this.sqlQuery || this.sqlQuery.trim() === '') {
        this.showLoadingAndLogs("sql不能为空")
        return; // 若为空或仅含空白字符，直接返回，不执行后续代码
      }
      this.setLoading('execute');
      this.SqlExecution(this.sqlQuery,this.currentPage,this.pageSize);
    },
       async SqlExecution(sqlQuery,currentPage,pageSize) {
        try {
          let response=await runSql(sqlQuery,currentPage,pageSize);
          if (response.data.code===200){
            this.showLogs = false;
            this.showTable = true;
           this.resultData = response.data.data.list  ;
         //  console.log('resultData',this.resultData)
           this.total=response.data.data.total;
           this.currentPage=response.data.data.currentPage;
           this.pageSize=response.data.data.pageSize;
           this.tableColumns = Object.keys(this.resultData[0]);
          }
          else {
             this.showLoadingAndLogs('接口/metrics/runSql错误:'+response.data.message)
          }
        } catch (error) {
            this.showLoadingAndLogs('接口/metrics/runSql错误:'+error)
        } finally {
          this.clearLoading();
        }
    },


    async saveSql() {

      if (this.metricsRuleForm.author !== this.user) {
        alert("只有用户" + this.metricsRuleForm.author + "才能更改!!!");
        return;
      }

      if (!this.metricsRuleForm.indId || this.metricsRuleForm.indId.trim() === "") {
        alert("编号 不能为空！");
        return;
      }
      // 检查 metricsName 是否为空字符串
      if (!this.metricsRuleForm.indName || this.metricsRuleForm.indName.trim() === "") {

        alert("名称 不能为空！");
        return;
      }
      // 检查 metricsType 是否为空数组或空字符串
      if (!this.metricsRuleForm.modelName || !Array.isArray(this.metricsRuleForm.modelName) || this.metricsRuleForm.modelName.length === 0) {
        alert("类型 不能为空！");
        return;
      }


        //       //新增参数校验是否存在
        if (!this.sqlQuery.includes('{D1}') || !this.sqlQuery.includes('{D2}')) {
        await MessageBox.confirm(`缺少时间参数<span style="color: red;">{D1}、{D2}</span>，是否继续？`, '参数缺失', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              type: 'error',
              dangerouslyUseHTMLString: true  // 启用 HTML 解析
            });
        }

      // 根据 sqlType 更新 metricsRuleForm
      if (this.sqlType === 'sqlTotal') {
        if (!this.sqlQuery || this.sqlQuery.trim() === "") {
          alert("sql 不能为空！");
          return;
        }
        delete this.metricsRuleForm.sqlDetail;
        this.metricsRuleForm.sqlTotal = this.sqlQuery; // 更新 sqlTotal
      } else if (this.sqlType === 'sqlDetail') {
        if (!this.sqlQuery || this.sqlQuery.trim() === "") {
          alert("sql 不能为空！");
          return;
        }
        delete this.metricsRuleForm.sqlTotal;
        this.metricsRuleForm.sqlDetail = this.sqlQuery; // 更新 sqlDetail
      }


      try {
        this.setLoading('save');

      //  console.log('当前表单:', this.metricsRuleForm, 'SQL类型:', this.sqlType);
        // 判断是否为新增，sid 为空则为新增
        if (this.metricsRuleForm.sid == null) {
      //    console.log("这是新增的数据", this.metricsRuleForm);
          const response = await getMetricByIndId(this.metricsRuleForm.indId);
     //     console.log(response.data.code)
          // 如果 indId 已经存在，弹窗提示
          if (response.data.code === 200) {
            await MessageBox.confirm(`已经存在编号<span style="color: red;">${this.metricsRuleForm.indId}</span>，是否覆盖原数据？`, '编号重复', {
              confirmButtonText: '覆盖',
              cancelButtonText: '取消',
              type: 'warning',
               dangerouslyUseHTMLString: true  // 启用 HTML 解析
            });
            // 用户确认后执行保存逻辑
            await this.addOrUpdate(this.metricsRuleForm, this.sqlType);
           // console.log("refresh-data")
            this.$emit('refresh-data'); // 触发父组件的 refresh-data方法 刷新数据

          } else {
            // 如果 indId 已经不存在，直接新增数据
            await this.addOrUpdate(this.metricsRuleForm, this.sqlType);
            this.$emit('refresh-data'); // 触发父组件的 refresh-data方法 刷新数据
          }
        }
        //不是新增，是编辑数据
        else {
          // 编辑已有数据的情况
      //    console.log("这是编辑操作");

          await this.addOrUpdate(this.metricsRuleForm, this.sqlType);
          // 有利有弊， 优点是触发父组件的 refresh-data方法刷新数据  缺点原来主界面的展开状态会被还原   如果想保持原界面状态 则去掉这行代码
       //  this.$emit('refresh-data');
        }
      } catch (error) {
        // 捕获 MessageBox 取消操作或者其他错误
        this.clearLoading();
        if (error !== 'cancel') {
          console.error("保存过程中出错:", error);
        }
      } finally {
        // 清除 loading 状态
        this.clearLoading();
      }
    },
    async addOrUpdate(addOrUpdateData, sqlType) {


      try {
        const res = await updateMetric(addOrUpdateData, sqlType); // 调用 updateMetric 方法
        const response = res.data;
        console.log('response==addOrUpdate==200===', response)
        if (response.code === 200) {
          console.log('response==addOrUpdate==200===', response)
          this.showLoadingAndLogs(response.data.msg);
          this.clearLoading();
          this.metricsRuleForm = response.data.data;
          this.updateData(response.data.data);
        } else {
          this.showLoadingAndLogs(response.message);
          this.clearLoading();
        }
      } catch (error) {
        console.log(error.message)
        this.$message.error('请求失败: ' + error.message);
      } finally {
        this.clearLoading();
      }
    },
    reSetSql() {
      console.log("==================")
      this.setLoading('reset');
      this.sqlQuery = this.sql;
      this.showLoadingAndLogs('SQL query reset.');
      this.clearLoading();
    },
    loadSql() {
      this.setLoading('load');
      this.showLoadingAndLogs('SQL query loaded.');
      this.showLoadingAndLogs('No saved SQL query found.');
      this.clearLoading();
    },
    async AISql() {
      this.setLoading('AI'); //加载动画
      let canShu = [{"role": "user", "content": this.sqlQuery,}];
      try {
        let responseData = await baiduAi128Server.sendRequest(canShu);
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
     this.setLoading('execute');
      this.executeSql();
    },
    handleCurrentChange(newPage) {
        this.setLoading('execute');
      this.currentPage = newPage;
         this.executeSql();
    },
    handleRowClick(row) {
      this.selectedRow = row;
    },
    getRowClassName({row}) {
      return row === this.selectedRow ? 'selected-row' : '';
    },


    updateData(updateData = {}) {
      this.$emit('update-data', updateData); // 触发父组件的 update-data 方法
    },

    // 替换指定的搜索文本为替换文本
    replaceContent(searchText, replaceText) {
      if (searchText) {
        // 处理换行符
        const escapedSearchText = searchText.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); // 转义特殊字符
        const regExp = new RegExp(escapedSearchText.replace(/\n/g, '\\n'), 'g'); // 创建正则表达式

        // 使用全局替换
        this.sqlQuery = this.sqlQuery.replace(regExp, replaceText);
      }
    },

    formatQuery() {
      this.sqlQuery = formatSQL(this.sqlQuery); // 调用格式化函数
    },
   fetchDatabaseInfo(){
      this.databaseConnectionInfo='IP 地';
   },
      testDS(){
    console.log("test数据库")
  },
       openAPI(){
      // window.open(process.env.VUE_APP_HOPPSCOTCH_API_URL, '_blank');

  const width = window.innerWidth * 0.7;  // 设置宽度为浏览器宽度的 70%
  const height = window.innerHeight * 0.7; // 设置高度为浏览器高度的 70%
  const left = (window.innerWidth - width) / 2; // 居中窗口
  const top = (window.innerHeight - height) / 2; // 居中窗口

  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  window.open(process.env.VUE_APP_HOPPSCOTCH_API_URL, '_blank', features);



    }
,

        openDsInfo(){

     const width = 800;  // 设置窗口宽度
  const height = 600; // 设置窗口高度
  const left = (window.innerWidth - width) / 2; // 居中窗口
  const top = (window.innerHeight - height) / 2; // 居中窗口

  const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

  window.open("/api/druid/datasource.html", '_blank', features);

        },

  },

  created() {
    EventBus.$on('updateMetricsRuleForm', (newRuleForm) => {
      this.metricsRuleForm = newRuleForm; // 接收来自MetricsForm组件的数据
    });
  },
  beforeDestroy() {
    EventBus.$off('updateMetricsRuleForm'); // 组件销毁时移除监听
  },





  watch: {

    //监控sql变化
    sqlQuery: {
      deep: true, // 深度监听
      handler(newValue) {
        if (this.sqlType === 'sqlTotal') {
          this.$emit('update-tab-title', 'sqlTotal', newValue);  // 触发事件并传递
        } else if (this.sqlType === 'sqlDetail') {
          this.$emit('update-tab-title', 'sqlDetail', newValue);  // 触发事件并传递
        }
      },
    }
  },


};
</script>

<style scoped>

.table-container {
  width: 100%;
  overflow-x: auto; /* 启用横向滚动条 */
}

.el-table .cell-content {
  padding: 0px; /* 调整内边距 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏超出部分 */
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
  height: 280px; /* 固定高度，根据需要调整 */
  overflow-y: auto; /* 超出时启用垂直滚动条 */

  padding: 10px; /* 可选: 内边距 */
  background-color: white; /* 可选: 背景色 */
  word-wrap: break-word; /* 自动换行 */
  word-break: break-all; /* 如果单词过长，也能强制换行 */
  white-space: normal; /* 允许换行 */
}

.replace-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

</style>
