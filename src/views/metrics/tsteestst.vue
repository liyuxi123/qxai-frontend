<template>
  <div>
    <el-tabs v-model="activeTabName" type="card"  @tab-remove="removeTab">
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="tab.name"
        :label="tab.title"
        :name="tab.name"
        :closable="tab.name !== 'fixedTab'"
      >
      <!-- 当 tab.name === 'fixedTab' 时，渲染 MetricsTable 和 SearchBox 组件 -->
        <div v-if="tab.name === 'fixedTab'">


         <SearchBox
         placeholder="请输入搜索内容..."
        :loading="SearchBoxloading"
         @search="handleSearchBoxSearch"
         @input="handleSearchBoxInput"
         />
        <MetricsTable
            :tableData="sqlTableData"
            :visible="loadingSpinner"
            @add-tab="addTab" />
        </div>

     <!-- 当 tab.name !== 'fixedTab' 时，渲染两个 Sql 组件并各占50%宽度，中间用白线隔开 -->
    <div v-else >
      <div> <MetricsForm :dataForm="tab.tabData"></MetricsForm></div>

      <div class="split-container">
      <div class="split-item">
        <SqlEdit :tabData="tab.tabData"
                 :sql="tab.tabData.sqlTotal"
                 @update-data="updateSqlData"
        />
      </div>
      <div class="split-item">
        <SqlEdit :tabData="tab.tabData"
               :sql="tab.tabData.sqlDetail"
               @update-data="updateSqlData"
            />
      </div>
         </div>
    </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import SearchBox from '@/components/SearchBox.vue';
import MetricsTable from '@/views/metrics/MetricsTable.vue';
import SqlEdit from '@/views/metrics/SqlEdit.vue';
import MetricsForm from "@/views/metrics/Metricsform.vue";


export default {
    components: {
      MetricsForm,
      SearchBox,
      MetricsTable,
      SqlEdit
  },
  data() {
    return {

      SearchBoxloading: false,
      tabs: [
        {
          title: '指标列表',
          name: 'fixedTab',
          isActive: true // 默认选中的标签
        }
      ],
      activeTabName: 'fixedTab', // 默认选中标签的名称
      tabIndex: 1 ,// 用于生成新标签的索引
      sqlTableData: [],
      loadingSpinner:false,
      updateFlag:false,

    };
  },
  methods: {
      handleSearchBoxSearch(query) {
        this.SearchBoxloading = true; // 触发搜索框加载动画
        this.loadingSpinner= true //触发MreticsTable的加载动画
       console.log('执行搜索，查询内容:', query);

      setTimeout(() => {
          this.SearchBoxloading = false; // close搜索框加载动画
          this.loadingSpinner= false //   close MreticsTable的加载动画
          this.sqlTableData=[
        {
          indId: 'c7',
          indName: '出院人数指标',
          modelName:'国考绩效',
          sqlTotalResult: 9,
          sqlTotal: 'select count(1) from user',
          sqlDetail: 'select * from user',
          updateTime: '2016-05-03',
        },
          {
          indId: 'c8',
          indName: '出院人数指标',
          modelName:'国考绩效',
          sqlTotalResult: 9,
          sqlTotal: 'select count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from userselect count(1) from user',
          sqlDetail: 'select * from user',
          updateTime: '2016-05-03',
        },
              {
          indId: '1',
          indName: '出院人数指标',
          modelName:'国考绩效',
          sqlTotalResult: 9,
          sqlTotal: 'select count(1) from user',
          sqlDetail: 'select * from user',
          updateTime: '2016-05-03',
        },
              {
          indId: '2',
          indName: '出院院标出院人数指标',
          modelName:'国考绩效',
          sqlTotalResult: 9,
          sqlTotal: 'select count(1) from user',
          sqlDetail: 'select * from user',
          updateTime: '2016-05-03',
        },
              {
          indId: '3',
          indName: '出院人数指标',
          modelName:'国考绩效',
          sqlTotalResult: 9,
          sqlTotal: 'select count(1) from user',
          sqlDetail: 'select * from user',
          updateTime: '2016-05-03',
        },
        // ... (其他数据)
      ];

        console.log('搜索完成');
      }, 2000);
    },
      handleSearchBoxInput(query) {
      console.log('输入内容:', query);
    },


    addTab(tabData = null) {
      const newTabName = `tab${++this.tabIndex}`;
      this.tabs.push({
        title: tabData.indId,
        name: newTabName,
        content: `这是新标签 ${this.tabIndex} 的内容`,
        isActive: false ,// 新标签默认不选中
        tabData: tabData ,// 传递的行数据
      });
      this.activeTabName = newTabName; // 切换到新添加的标签页
      this.updateTabEffects(); // 更新标签页效果
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
        updateSqlData(updateFlag = null){
        if (updateFlag){
          this.updateFlag=updateFlag;
          console.log("保存sql后触发更新标志updateFlag"+this.updateFlag)
        }
        },
      open() {
        this.$alert('这是一段内容', '标题名称', {
          confirmButtonText: '确定',
        });
      },

  },
watch: {
  activeTabName(newVal) {
    this.updateTabEffects(); // 标签页切换时更新效果
    // 如果切换到了 'fixedTab' 标签，判断是否有sql保存，有得触发跟新
    if (newVal === 'fixedTab') {
     if (this.updateFlag){

       this.open();

        //  this.handleSearchBoxSearch(''); // 你可以根据需要传入默认搜索内容
          this.updateFlag=false;
     }
    }
  }
},
};
</script>

<style scoped>
/* 使用深度选择器确保样式应用到内部元素 */
/* 选中标签的样式 */
::v-deep .el-tabs__header .el-tabs__item.is-active {

  color: black;
  border-bottom: 2px solid black; /* 选中标签底部黑色划线 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 5); /* 增加阴影 */
}
/* 鼠标悬浮时的标签样式 */
::v-deep .el-tabs__header .el-tabs__item:hover {
  color: black;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 5); /* 增加阴影 */
}




.split-container {
  margin: 0;  /* 移除外边距 */
  padding: 0; /* 移除内边距 */
  display: flex;
  align-items: stretch;
  width: 100%;
}

.split-item {
  margin: 11px;  /* 外边距 */
  width: 47%;
  word-wrap: break-word; /* 自动换行 */
  word-break: break-all; /* 如果单词过长，也能强制换行 */
  white-space: normal; /* 允许换行 */
}

</style>
