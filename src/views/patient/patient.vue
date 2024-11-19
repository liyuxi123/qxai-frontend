<template>
  <div class="patient-card-list">
    <!-- 右上角数字时钟 -->
    <div class="clock">
      {{ currentTime }}
    </div>
    <!-- 搜索框和按钮 -->
    <div class="search-bar">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        placeholder="开始时间"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="time-picker"
      />
      <span>至</span>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        placeholder="结束时间"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="time-picker"
      />

      <!-- 新增选择器 -->
      <el-select
        v-model="deptCode"
        filterable
        placeholder="获取科室中....."
        class="select-category"
      >
        <el-option
          v-for="item in categories"
          :key="item.科室编号"
          :label="item.科室名称"
          :value="item.科室编号"
           class="custom-option"
        />
      </el-select>

      <el-input
        v-model="searchQuery"
        placeholder="输入内容搜索"
        clearable
        @clear="handleClear"
        class="search-input"
      />
      <el-button plain @click="handleSearch" class="search-button">搜索</el-button>
<!--      <span v-if="searchQuery" class="search-info">当前搜索: {{ searchQuery }}</span>-->

      <el-button type="info" @click="handleSearchAI" class="search-button">AI搜索</el-button>
    </div>

      <div v-if="loading">
    <!-- 加载动画组件 -->
    <LoadingSpinner :visible="loading" /> </div>
    <div v-else >

          <el-row >
        <el-col
          v-for="patient in patients"
          :key="patient.hospitalId"
          :span="6"
          :style="{ maxWidth: '240px' }"
        >
          <el-card
            class="patient-card"
            :body-style="{ padding: '15px' }"
            :style="{ backgroundColor: patient.状态 === '离院' ? '#dadada' : 'white', cursor: 'pointer' }"
            @dblclick.native="goToDetailPage(patient)"
          >
            <div slot="header" class="card-header">
              <img
                :src="patient.性别 === '男' ? require('@/assets/images/icon/male.png') : require('@/assets/images/icon/female.png')"
                alt="头像"
                class="avatar"
              />
              <span>{{ patient.姓名 }} {{ patient.科室 }}</span>
            </div>
            <div class="card-content">
              <!-- 动态渲染所有字段的键名和值，排除标题信息 -->
              <p v-for="(value, key) in patient" v-if="key !== '姓名'&&key !== '科室'&&key !== '性别'&&key !=='PAGEHELPER_ROW_ID'" :key="key">
                {{ key }} : {{ value }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页控件 -->
      <div class="pagination">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, total"
        ></el-pagination>
      </div>


    </div>

  </div>
</template>

<script>


import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {patientSearch , getDeptList} from '@/api/patient/patientAPI'

export default {
  components: {
    LoadingSpinner
      },

  data() {
    return {
      startTime: this.getDaysAgoStartOfDay(3), // 初始化为当前时间前三天的零点
      endTime: new Date(), // 初始化为当前时间
      currentTime: '',
      patients: [],
      searchQuery: '', // 用于搜索
      deptCode: '', // 选择的分类选项
      currentPage: 1, // 当前页码
      pageSize: 21, // 每页显示的条数
      total: 0, // 总条目数
      loading: false, // 加载状态
      categories: [], // 分类选项列表
    };
  },
  methods: {
    formatDateToYMDHMS(date) {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始计数，需要加 1
  let day = String(date.getDate()).padStart(2, '0');
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
},
    async fetchPatients(pageNum = 1, pageSize = 21, deptCode,searchQuery = '',startTime,endTime) {
      this.loading = true;
      try {
        const response = await  patientSearch(
            pageNum,
            pageSize,
            searchQuery,
            deptCode,
            this.formatDateToYMDHMS(new Date(startTime)),
            this.formatDateToYMDHMS(new Date(endTime)));


        if (response.data.code===200){
        this.patients = response.data.data.data; // 假设返回的数据包含患者列表
        this.total = response.data.data.total; // 假设返回的数据包含总条目数
        }
         else {
        this.$message.error(`错误/patientInfo/search: ${response.data.data.message || '获取数据失败'}`);
        }


      } catch (error) {
         this.$message.error(`错误/patientInfo/search: ${error || '获取数据失败'}`);
      } finally {
        this.loading = false;
      }
    },
    async fetchDeptList(){
         console.log("========fetchDeptList=======");

       this.loading = true;
      try {

        const response = await  getDeptList();
        this.categories = response.data.data; //
        if (!this.deptCode ){
          this.deptCode ="000000";
        }
      } catch (error) {
        console.error('获取科室列表失败:', error);
        this.deptCode ="获取科室失败"
      } finally {
        this.loading = false;
      }
    },

    // 点击搜索按钮时调用
    handleSearch() {
      this.currentPage = 1; // 重置为第一页
      this.fetchPatients(this.currentPage, this.pageSize,this.deptCode, this.searchQuery,this.startTime,this.endTime);
    },
    handleSearchAI() {
      console.log('开始时间:', this.startTime);
      console.log('结束时间:', this.endTime);
      console.log('查询内容:', this.searchQuery);
      this.loading = true; // 开始加载
      setTimeout(() => {
        this.loading = false; // 停止加载
        this.currentPage = 1; // 搜索后重置为第一页
      }, 6000); // 模拟加载时间
    },
    handleClear() {
      this.searchQuery = '';
    },
    // 点击分页控件时调用
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchPatients(this.currentPage, this.pageSize,this.deptCode, this.searchQuery,this.startTime,this.endTime);
    },


   goToDetailPage(patient) {
      let tabData={};
      tabData.patient=patient

     this.addTab(tabData)
   },



    updateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.currentTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    },
    getDaysAgoStartOfDay(days) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      date.setHours(0, 0, 0, 0); // 将时间部分设置为零点
      return date;
    },

      addTab(tabData = null) {
    this.$emit('add-tab',tabData); // 触发父组件的 add-tab 方法
  },


  },




   async   mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
      await   this.fetchDeptList();
     console.log("this.deptCode"+this.deptCode)
    // 初次加载时获取数据
     this.fetchPatients(this.currentPage, this.pageSize,this.deptCode, this.searchQuery,this.startTime,this.endTime);
  },

};
</script>
<style scoped>
.patient-card-list {
  padding: 20px  !important;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 20px 20px;
  position: relative;
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
  width: 40%;
}

.search-button {
  height: 38px; /* Ensure button height aligns with input height */
}

.select-category {
  margin-right: 10px; /* 调整选择器和其他元素之间的间距 */
  width: 150px; /* 调整选择器宽度 */
}

.search-info {
  margin-left: 10px;
  font-size: 14px;
  color: #555;
}

.patient-card {
  width: 240px; /* 固定宽度 */
  height: 180px; /* 固定高度 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 1);
  transition: box-shadow 0.2s ease-in; /* 鼠标悬停时的过渡效果 */
}

.patient-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 1); /* 鼠标悬停时的阴影效果 */
}

.card-header {
  display: flex;
  align-items: center;
    height: 1px; /* 固定高度 */
}

.avatar {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-loading-mask {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-option .el-select-dropdown__item {
  color: black;      /* 设置文字颜色为黑色 */
  font-weight: bold; /* 设置字体加粗 */
}

/* 确保在下拉项悬停或选中时仍然保留样式 */
.custom-option:hover, .custom-option.is-selected {
  color: black;      /* 设置文字颜色为黑色 */
  font-weight: bold; /* 设置字体加粗 */
}

/* 如果还需要调整整个选择器的样式 */
.select-category {
  width: 200px; /* 调整选择器宽度 */
}

.card-content {
  font-size: 12px; /* 调整文字大小 */
  line-height: 1.4; /* 设置行高，让文字的可读性更好 */
  color: black; /* 可选：设置文字颜色 */
}
.card-header{

    font-size: 12px; /* 调整文字大小 */
  line-height: 1.4; /* 设置行高，让文字的可读性更好 */
  color: black; /* 可选：设置文字颜色 */
}

</style>
