<template>
  <div v-if="visible">
    <!-- 加载动画组件 -->
    <LoadingSpinner :visible="visible"/>
  </div>
  <div v-else>
    <div style="display: flex; margin-bottom: 0px; justify-content: space-between;">
      <el-button-group>
        <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-download" @click=exportExcel>
          EXCEL
        </el-button>
        <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-s-promotion" @click="openAPI">
          API
        </el-button>
        <el-button style="color: black ; font-weight: bolder" size="mini" icon="el-icon-plus" @click="handleAdd">新增
        </el-button>

      </el-button-group>


      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <el-table
        :data="tableList"
        style="width: 100%"
        height="800"
        border
        :row-class-name="tableRowClassName"
    >
      <el-table-column type="expand">
        <template v-slot="props">
          <div class="expand-content">
            <el-button-group style="float: right;">
              <el-button size="small" @click="edit(props.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteItem(props.row)">删除</el-button>
            </el-button-group>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item v-for="(value, key) in props.row"
                            :key="key"
                            :label="key"
                            label-width="120px">
                <span>{{ value }}</span>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>

      <el-table-column
          key="indId"
          prop="indId"
          label="指标编号"
          width="150"
          min-width="120"
          show-overflow-tooltip
          :formatter="formatModelName"
      >

        <template v-slot="scope">
          <div>
            <span>{{ scope.row.indId }}</span>
            <el-badge
                v-if="isRecentUpdate(scope.row.updateTime)"
                is-dot
            />
          </div>
        </template>

      </el-table-column>


      <el-table-column
          v-for="(column, index) in columns"
          v-if="column.prop !== 'indId'"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          show-overflow-tooltip
          :formatter="formatModelName"
      >
      </el-table-column>


    </el-table>

  </div>
</template>

<script>

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {EventBus} from "@/utils/eventBus/event-bus";
import {mapState} from 'vuex'
import {deleteMetric, searchMetrics} from "@/api/metricsServer/metricsAPI"
import {Message, MessageBox} from "element-ui";
import * as XLSX from 'xlsx';


export default {
  components: {
    LoadingSpinner
  },
  props: {
    metricsData: {
      type: Object,
      required: true, // 如果 Data 是必需的，可以加上 required
      default: () => {
      } // 如果没有传递 Data，默认值为一个空数组
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      columns: [
        {prop: 'indId', label: '指标编号', width: '120', minWidth: '120'},
        {prop: 'indName', label: '指标名称', width: '720', minWidth: '120'},
        {prop: 'modelName', label: '模块', width: '150', minWidth: '120'},
        {prop: 'sqlTotal', label: 'sql', width: '300', minWidth: '300'},
        {prop: 'sqlDetail', label: '明细sql', width: '300', minWidth: '120'},
        {prop: 'updateTime', label: '更新时间', width: '150', minWidth: '120'},
        {prop: 'author', label: '作者'}
      ],
      tableList: [],
      pageSize: 1,
      currentPage: 20,
      total: 0,

    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      //     console.log('Row color:', row);
      // if (rowIndex === 1) {
      //   return 'warning-row';
      // } else if (rowIndex === 3) {
      //   return 'success-row';
      // }
      // return '';
    },
    edit(row) {
      this.addTab(row); // 触发父组件的 addTab 方法
    },
    handleAdd() {
      const newRow = {};
      this.columns.forEach(column => {
        if (column.prop === 'indId') {
          newRow[column.prop] = '新增未命名'; // indId 设置为 '新增未命名'
        } else if (column.prop === 'modelName') {
          newRow[column.prop] = []; // modelName 设置为一个空数组
        } else if (column.prop === 'sqlTotal') {
          newRow[column.prop] = '//示例： select xxx  as  新增未命名 from 你的逻辑'; // sqlTotal 设置示例sql
        } else if (column.prop === 'author') {
          newRow[column.prop] = this.user; //
        } else {
          newRow[column.prop] = ''; // 其他字段设置为空字符串
        }
      });
      // 触发 addTab，传入新构造的 row 对象
      this.addTab(newRow);
    },
    deleteItem(row) {
      MessageBox.confirm('确定删除' + row.indId + '记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除后调用删除方法
        deleteMetric(row.sid).then(() => {
          Message({
            type: 'success',
            message: '删除成功!'
          });
          console.log('删除:', row);
          // 执行其他删除操作，如刷新表格数据等
          //调用父组件搜索刷新数据
          this.$emit('refresh-data'); // 触发父组件的 add-tab 方法
        }).catch(() => {
          Message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {
      });
    },
    addTab(tabData = null) {
      this.$emit('add-tab', tabData); // 触发父组件的 add-tab 方法
    },

    formatModelName(row, column, cellValue) {
      if (Array.isArray(cellValue)) {
        return cellValue.join(' ,'); // 用空格连接数组元素
      }
      return cellValue;
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      EventBus.$emit('search-box-query', 1, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      EventBus.$emit('search-box-query', currentPage, this.pageSize);
    },
    isRecentUpdate(updateTime) {
      const currentTime = new Date();
      const updateDate = new Date(updateTime);
      const timeDiff = (currentTime - updateDate) / (1000 * 60); // 转换为分钟
      return timeDiff <= 2; // 十分钟内
    },

    openAPI() {
      window.open(process.env.VUE_APP_HOPPSCOTCH_API_URL, '_blank');
    },

    async exportExcel() {
      try {
        this.$message.info("正在获取所有数据，请稍候...");
        // 1. 请求后端获取总条数total
        let responseTotal = await searchMetrics('', 1, 1);
        if (responseTotal.data.code === 200) {
          const ExeclTotal = responseTotal.data.data.total
          // 根据总条数total 再次请求接口获取全部
          const response = await searchMetrics('', 1, ExeclTotal);
          const allData = response.data.data.list;
          if (!allData || !allData.length) {
            this.$message.warning("没有数据可以导出");
            return;
          }
          // 2. 格式化数据，准备导出
          const data = allData.map(item => {
            return {
              '指标编号': item.indId,
              '指标名称': item.indName,
              '模块': Array.isArray(item.modelName) ? item.modelName.join(', ') : item.modelName,
              'SQL': item.sqlTotal,
              '明细 SQL': item.sqlDetail,
              '更新时间': item.updateTime,
              '作者': item.author
            };
          });
          // 3. 使用 xlsx 库导出 Excel
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, '全部指标列表');

          const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
          const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
          // 4. 创建下载链接并触发下载
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = '全部指标列表.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.$message.success("数据已成功导出为 Excel 文件");

        } else {
          this.$message.error("获取数据接口失败，无法导出");
        }

      } catch (error) {
        this.$message.error("获取数据失败，无法导出");
        console.error(error);
      }
    },

    // // 模拟请求后端获取全部数据的方法
    // async fetchAllData() {
    //   // 假设后端接口为 /api/metrics/all，可以根据需求替换
    //   return await this.$axios.get('/api/metrics/all');
    // },

  },
  watch: {
    metricsData: {
      immediate: true, // 立即监听并执行
      handler(newVal) {
        if (newVal) {
          this.tableList = newVal.list || [];
          this.pageSize = newVal.pageSize || 20;
          this.currentPage = newVal.currentPage || 1;
          this.total = newVal.total || 0;
        }
      }
    }
  },

  computed: {

    ...mapState({
      user: state => state.user.user
    })
  },


}
</script>

<style scoped>

.expand-content {
  background-color: #f5f5f5; /* 你可以根据需要调整颜色 */
  border-radius: 4px; /* 可选：添加圆角 */
}

.demo-table-expand {
  font-size: 0px;
}

.demo-table-expand >>> .el-form-item .el-form-item__label {
  font-weight: bold; /* 加粗标签文本 */
  width: 80px; /* 标签宽度 */

}

.demo-table-expand .el-form-item {
  margin-left: 10px;
  margin-bottom: 0;
  margin-top: 0;
  width: 100%;
}

>>> .warning-row {
  background-color: black;
}

>>> .success-row {
  background-color: red;
}

.new {
  margin-top: -10px;
  margin-right: 40px;
}


</style>

