<template>
  <div>
    <el-tabs v-model="activeTabName" type="card" @tab-remove="removeTab">
      <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="tab.name"

          :name="tab.name"
          :closable="tab.name !== 'fixedTab'"
          lazy
      >
        <template #label>

          <el-badge v-if="tab.hasChanged" is-dot/>
          <span>{{ tab.hasChanged ? `${tab.title} SQL有改动` : tab.title }}</span>

        </template>
        <!-- 当 tab.name === 'fixedTab' 时，渲染 MetricsTable 和 SearchBox 组件 -->
        <div v-if="tab.name === 'fixedTab'">


          <SearchBox
              style="margin: 0; padding: 0;"
              placeholder="search..."
              :loading="SearchBoxloading"
              @search="handleSearchBoxSearch"
              @input="handleSearchBoxInput"
          />
          <MetricsTable
              :metricsData="sqlTableData"
              :visible="loadingSpinner"
              @add-tab="addTab"
              @refresh-data="handleSearchBoxSearch"/>
        </div>

        <!-- 当 tab.name !== 'fixedTab' 时，渲染两个 Sql 组件并各占50%宽度，中间用白线隔开 -->


        <div v-else>
          <div>
            <MetricsForm :dataForm="tab.tabData"></MetricsForm>
          </div>
          <div class="split-container">
            <div class="split-item">
              <SqlEdit :tabData="tab.tabData"
                       :sql="tab.tabData.sqlTotal"
                       sqlType="sqlTotal"
                       @update-data="( updateData) => updateSqlData('sqlTotal', updateData)"
                       @update-tab-title="updateTabTitle"
                       @refresh-data="handleSearchBoxSearch"
              />
            </div>
            <div class="split-item">
              <SqlEdit :tabData="tab.tabData"
                       :sql="tab.tabData.sqlDetail"
                       sqlType="sqlDetail"
                       @update-data="( updateData) => updateSqlData('sqlDetail', updateData)"
                       @update-tab-title="updateTabTitle"
                       @refresh-data="handleSearchBoxSearch"
              />
            </div>
          </div>
        </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MonacoEditor from '@/components/MonacoEditor.vue';
import SearchBox from '@/components/SearchBox.vue';
import MetricsTable from '@/views/metrics/MetricsTable.vue';
import SqlEdit from '@/views/metrics/SqlEdit.vue';
import MetricsForm from "@/views/metrics/Metricsform.vue";

import {searchMetrics} from '@/api/metricsServer/metricsAPI'
import {EventBus} from "@/utils/eventBus/event-bus";
import {mapState} from 'vuex'


export default {
  name:'MetricsManger',
  components: {
    MetricsForm,
    SearchBox,
    MetricsTable,
    SqlEdit,
    MonacoEditor
  },
  data() {
    return {
      sqlQuery: 'aadfadf',
      SearchBoxloading: false,
      tabs: [
        {
          hasChanged: false, // 新增属性，表示是否有变化
          title: '指标列表',
          name: 'fixedTab',
          isActive: true // 默认选中的标签
        }
      ],
      activeTabName: 'fixedTab', // 默认选中标签的名称
      tabIndex: 1,// 用于生成新标签的索引
      sqlTableData: {},
      loadingSpinner: false,
      searchQuery: '',
      updateFlag: false,
    };
  },
  methods: {
    async handleSearchBoxSearch(query, currentPage = 1, pageSize = 20) {
      console.log('this.searchQuery',query)
      //  this.searchQuery=query;
      this.SearchBoxloading = true; // 触发搜索框加载动画
      this.loadingSpinner = true //触发MreticsTable的加载动画
      try {
        const response = await searchMetrics(query, currentPage, pageSize);
        if (response.data.code === 200) {
          this.SearchBoxloading = false; // close搜索框加载动画
          this.loadingSpinner = false //   close MreticsTable的加载动画
          // 更新组件状态
          this.sqlTableData = response.data.data; // 根据实际 API 响应格式处理数据

        } else {
          // 处理请求失败的情况
          this.$message.error(`/metrics/searchMetricsList错误: ${response.data.message || '获取数据失败'}`);
          this.SearchBoxloading = false; // close搜索框加载动画
          this.loadingSpinner = false //   close MreticsTable的加载动画
        }
      } catch (error) {
        this.$message.error(`/metrics/searchMetricsList错误: ${error || '获取数据失败'}`);
      } finally {
        this.SearchBoxloading = false; // close搜索框加载动画
        this.loadingSpinner = false //   close MreticsTable的加载动画
      }

    },
    handleSearchBoxInput(query) {
      this.searchQuery = query;

    },

    addTab(tabData = null) {
      // 检查标签页是否已经存在，基于 `tabData.indId` 来判断
      const existingTab = this.tabs.find(tab => tab.tabData && tab.tabData.indId === tabData.indId && tab.title === tabData.indId);
      if (existingTab) {
        // 如果标签页已经存在，切换到该标签页
        this.activeTabName = existingTab.name;
      } else {
        // 如果标签页不存在，创建新标签页
        const newTabName = `tab${++this.tabIndex}`;
        this.tabs.push({
          title: tabData.indId,
          hasChanged: false,
          name: newTabName,
          content: `这是新标签 ${this.tabIndex} 的内容`,
          isActive: false, // 新标签默认不选中
          tabData: tabData, // 传递的行数据
        });
        this.activeTabName = newTabName; // 切换到新添加的标签页
        this.updateTabEffects(); // 更新标签页效果
      }

    },
    updateTabEffects() {
      // 更新每个标签页的 isActive 属性
      this.tabs.forEach(tab => tab.isActive = tab.name === this.activeTabName);


    },
    removeTab(name) {
      // 找到要删除标签的索引
      const index = this.tabs.findIndex(tab => tab.name === name);
      if (index === -1) return; // 标签未找到

      // 删除标签
      this.tabs.splice(index, 1);

      // 如果删除的是当前激活的标签，则激活前一个标签
      if (this.activeTabName === name) {
        if (this.tabs.length > 0) {
          // 激活前一个标签
          let newIndex = index === 0 ? 0 : index - 1;
          this.activeTabName = this.tabs[newIndex].name;
        } else {
          // 如果没有标签了，重置激活标签
          this.activeTabName = '';
        }
        this.updateTabEffects(); // 更新标签页效果

      }

    },
    updateSqlData(componentType, updateData) {
      const tab = this.tabs.find(tab => tab.name === this.activeTabName);
      if (tab) {
        tab.title = updateData.indId; //修改当前标签的名称
        tab.hasChanged = false;

      }
      //更新页面数据
      this.sqlTableData.list.forEach(item => {
        if (item.sid === updateData.sid) {
          Object.assign(item, updateData); // 更新匹配的对象
        }
      });

      //         // 保存更新后的标签页数据

    },


//     updateSqlData(componentType, updateData) {
//     const tab = this.tabs.find(tab => tab.name === this.activeTabName);
//     if (tab) {
//         // 更新当前标签的标题
//         tab.title = updateData.indId;
//         tab.hasChanged = false;
//
//         // 更新当前标签页的 tabData 中的特定类型
//         tab.tabData[componentType] = updateData;
//
//         // 更新 sqlTableData 中匹配的对象
//         this.sqlTableData.list.forEach(item => {
//             if (item.sid === updateData.sid) {
//                 Object.assign(item, updateData); // 更新匹配的对象
//             }
//         });
//
//         // 保存更新后的标签页数据
//         this.saveTabsToLocalStorage();
//     }
// },

    updateTabTitle(sqlType, sql) {
      const tab = this.tabs.find(tab => tab.name === this.activeTabName);
      if (tab) {
        if (sqlType === 'sqlTotal') {
          if (tab.tabData.sqlTotal !== sql) {
            tab.hasChanged = true;
          } else {
            tab.hasChanged = false;
          }
        }
        if (sqlType === 'sqlDetail') {
          if (tab.tabData.sqlDetail !== sql) {
            tab.hasChanged = true;
          } else {
            tab.hasChanged = false;
          }
        }



      }
    },

    //处理路由过来的指标
    getDataRouter(){
    //  console.log("============================")
       if (this.$route.query && Object.keys(this.$route.query).length) {
      console.log('this.$route.query', this.$route.query); // 获取传递的 id
      let canshu = this.$route.query;
      canshu.indName = this.$route.query.thirdtarget;
      canshu.indId=this.$route.query.dataid;
      if (!canshu.author){
         canshu.author= this.user;
      }
      if (!canshu.indId){
         canshu.indId= '新增未命名编号';
      }
      if (!canshu.modelName){
           canshu.modelName=[];
      }
      if (!canshu.sqlTotal ){
        canshu.sqlTotal="//示例： select xxx  as " +canshu.indId +" from 你的逻辑";
      }
     this.addTab(canshu)
    }

    },

       openAPI(){
       window.open(process.env.VUE_APP_HOPPSCOTCH_API_URL, '_blank');
    }



  },
  watch: {
    activeTabName(newVal) {
      this.updateTabEffects(); // 标签页切换时更新效果

    },
  },


  //
  // created() {
  //       //处理路由过来的指标
  // this.getDataRouter();
  //
  // },
  mounted() {

       console.log('this.$route',this.$route);
  console.log(' this.$route.meta.keepAlive',this.$route.meta.keepAlive);
//
    this.handleSearchBoxSearch(this.searchQuery, 1, 20);
    // 监听组件MetricsTable的分页按钮
    EventBus.$on('search-box-query', (currentPage, pageSize) => {
      this.handleSearchBoxSearch(this.searchQuery, currentPage, pageSize);
    });
  },


  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },


  activated() {
     this.getDataRouter();
  },
  // deactivated() {
  //   // 页面被缓存时触发
  //   console.log('页面被缓存');
  // },


};
</script>

<style scoped>
/* 使用深度选择器确保样式应用到内部元素 */
/* 选中标签的样式 */
::v-deep .el-tabs__header .el-tabs__item.is-active {
  color: black;
  border-bottom: 2px solid black; /* 选中标签底部黑色划线 */

}

/* 鼠标悬浮时的标签样式 */
::v-deep .el-tabs__header .el-tabs__item:hover {
  color: black;
}

::v-deep .el-tabs__item {
  min-width: 120px; /* 最小宽度为 120px */
  padding: 0 16px; /* 添加左右 padding 以增加视觉空间 */
  text-align: center; /* 标签内容居中 */
  white-space: nowrap; /* 禁止换行 */
}


.split-container {
  margin: 0; /* 移除外边距 */
  padding: 0; /* 移除内边距 */
  display: flex;
  align-items: stretch;
  width: 100%;
}

.split-item {
  margin: 11px; /* 外边距 */
  width: 47%;
  word-wrap: break-word; /* 自动换行 */
  word-break: break-all; /* 如果单词过长，也能强制换行 */
  white-space: normal; /* 允许换行 */
}

</style>
