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



        <span>{{"main"}}</span>



           <el-button
          size="small"
          @click="addTab"
        >add</el-button>
        </div>
     <!-- 当 tab.name !== 'fixedTab' 时，渲染两个 Sql 组件并各占50%宽度，中间用白线隔开 -->
    <div v-else >
  <span>{{tab.content}}</span>
    </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>





export default {

  data() {
    return {

      tabs: [
        {
          title: '指标列表',
          name: 'fixedTab',
          isActive: true // 默认选中的标签
        }
      ],
      activeTabName: 'fixedTab', // 默认选中标签的名称
      tabIndex: 1 ,// 用于生成新标签的索引

    };
  },
  methods: {
    addTab() {
      const newTabName = `tab${++this.tabIndex}`;
      this.tabs.push({
        title: this.tabIndex,
        name: newTabName,
        content: `这是新标签 ${this.tabIndex} 的内容`,
        isActive: false ,// 新标签默认不选中
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

  },
watch: {
  activeTabName(newVal) {
    this.updateTabEffects(); // 标签页切换时更新效果
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




</style>
