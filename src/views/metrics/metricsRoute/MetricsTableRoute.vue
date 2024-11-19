<template>
  <div v-if="visible">
    <!-- 加载动画组件 -->
    <LoadingSpinner :visible="visible"/>
  </div>
  <div v-else>
    <el-table
        :data="tableList"
        style="width: 100%"
        height="700"
        border
        :row-class-name="tableRowClassName"

    >
      <el-table-column type="expand">
        <template v-slot="props">
          <div>
            <el-button-group style="float: right;">
                  <el-button size="small" @click="edit(props.row)">更新</el-button>
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
          v-for="(column, index) in columns"
          v-if="column.prop !== 'indId'  "
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          show-overflow-tooltip
          :formatter="formatModelName"
      >
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


        <template #header>
          <el-button icon="el-icon-plus" type="info" @click="handleAdd">指标编号</el-button>
        </template>
      </el-table-column>


    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>

import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {EventBus} from "@/utils/eventBus/event-bus";
import {mapState} from 'vuex'
import {deleteMetric} from "@/api/metricsServer/metricsAPI"
import {Message, MessageBox} from "element-ui";

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
        {prop: 'thirdtarget', label: '项目', width: '120', minWidth: '120'},
        {prop: 'appIndId5', label: '核查结果', width: '120', minWidth: '120'},
        {prop: 'appIndId5', label: 'DM层数据结果', width: '120', minWidth: '120'},




        {prop: 'indId', label: '指标编号', width: '120', minWidth: '120'},
        // {prop: 'indName', label: '指标名称', width: '120', minWidth: '120'},
        // {prop: 'modelName', label: '模块', width: '120', minWidth: '120'},
        // {prop: 'sqlTotal', label: 'sql', width: '300', minWidth: '300'},
        // {prop: 'sqlDetail', label: '明细sql', width: '120', minWidth: '120'},
        {prop: 'updateTime', label: '更新时间', width: '120', minWidth: '120'},
        {prop: 'author', label: '作者', width: '120', minWidth: '120'}
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
      return timeDiff <= 30; // 三十分钟内
    },

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
</style>

