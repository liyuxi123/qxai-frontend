<template>
  <div>
    <el-input v-model="pageData" placeholder="请输入内容"></el-input>
  </div>
</template>

<script  >

export default {
  name:'user',
  data() {
    return {
      pageData: null
    };
  },
  mounted() {
   console.log('this.$route',this.$route);
  console.log(' this.$route.meta.keepAlive',this.$route.meta.keepAlive);
    // 只在首次加载时执行
    this.fetchData();
  },


  // activated() {
  //   // 每次返回该页面时触发（数据保持不变）
  //   console.log('页面被激活，数据不变');
  // },
  // deactivated() {
  //   // 页面被缓存时触发
  //   console.log('页面被缓存');
  // },
  methods: {

    fetchData() {
          console.log('0000000000000000000000',  this.$route.meta.keepAlive);
      // 模拟数据加载
      this.pageData = '这是页面的数据';
    }
  }
}
</script>
