<template>
  <div class="patient-dashboard">
    <!-- 左侧病人基本信息 -->
    <div class="info-card-container">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" :body-style="{ padding: '10px' }">
        <div slot="header" class="card-header">
          <span>基本信息</span>
        </div>
        <div class="card-content">

          <!-- 动态渲染所有字段的键名和值，排除标题信息 -->
          <p v-for="(value, key) in patient" v-if="key!=='PAGEHELPER_ROW_ID'" :key="key">
            {{ key }} : {{ value }}
          </p>

        </div>
      </el-card>

      <!-- 诊断信息 -->
      <el-card class="info-card" :body-style="{ padding: '10px' }">
        <div slot="header" class="card-header">
          <span>诊断信息</span>
        </div>
        <el-table :data="diagnoses" style="width: 100%; margin-top: 10px">
          <el-table-column
              v-for="(value, key) in diagnoses[0]"
              :key="key"
              :prop="key"
              :label="key"
              width="150">
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 右侧详细信息 -->
    <div class="details-container">
      <!-- 患者转科时间轴 -->
      <el-card class="details-card horizontal-timeline-card" :body-style="{ padding: '10px' }">
        <div slot="header" class="card-header">
          <span>患者转科时间轴&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ currentTime }}</span>

        </div>
        <div class="horizontal-timeline">
          <el-timeline>
            <el-timeline-item
                v-for="event in transferTimeline"
                :key="event.date"
                :timestamp="event.date"
                placement="top"
                style="display: inline-block; text-align: center;"
            >
              {{ event.description }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>

      <!-- 患者临床数据 -->
      <el-card class="details-card" :body-style="{ padding: '10px' }">
        <div slot="header" class="card-header">
          <span>患者临床数据</span>
        </div>
        <el-tabs v-model="activeTab" class="tabs-container" type="card">
          <el-tab-pane label="医嘱信息" name="orders">
            <el-table :data="orders.slice((ordersPage - 1) * pageSize, ordersPage * pageSize)"
                      style="width: 100%; margin-top: 10px">
              <el-table-column
                  v-for="(value, key) in orders[0]"
                  :key="key"
                  :prop="key"
                  :label="key"
                  width="150">
              </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @current-change="handleOrdersPageChange"
                :current-page="ordersPage"
                :page-size="pageSize"
                :total="orders.length"
                layout="prev, pager, next"
                style="margin-top: 10px;"
            />
          </el-tab-pane>
          <el-tab-pane label="检查信息" name="exams">

            <el-table :data="exams.slice((examsPage - 1) * pageSize, examsPage * pageSize)"
                      style="width: 100%; margin-top: 10px">
              <el-table-column
                  v-for="(value, key) in exams[0]"
                  :key="key"
                  :prop="key"
                  :label="key"
                  width="150">
              </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @current-change="handleExamsPageChange"
                :current-page="examsPage"
                :page-size="pageSize"
                :total="exams.length"
                layout="prev, pager, next"
                style="margin-top: 10px;"
            />

          </el-tab-pane>
          <el-tab-pane label="病历信息" name="records">
            <el-table :data="records.slice((recordsPage - 1) * pageSize, recordsPage * pageSize)"
                      style="width: 100%;"
                      height="500px"
                      @row-dblclick="handleRowClickEmr">
              <el-table-column prop="病历时间" label="病历时间" width="100"></el-table-column>
              <el-table-column prop="病历名称" label="病历名称" width="150"></el-table-column>
              <el-table-column prop="病历内容" label="病历内容"></el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @current-change="handleRecordsPageChange"
                :current-page="recordsPage"
                :page-size="pageSize"
                :total="records.length"
                layout="prev, pager, next"
                style="margin-top: 10px;"
            />
          </el-tab-pane>
          <el-tab-pane label="手术信息" name="surgeries">
            <el-table :data="surgeries.slice((surgeriesPage - 1) * pageSize, surgeriesPage * pageSize)"
                      style="width: 100%;"
                      height="500px">
              <el-table-column
                  v-for="(value, key) in surgeries[0]"
                  :key="key"
                  :prop="key"
                  :label="key"
                  width="150">
              </el-table-column>
            </el-table>
            <el-pagination
                class="pagination"
                @current-change="handleSurgeriesPageChange"
                :current-page="surgeriesPage"
                :page-size="pageSize"
                :total="surgeries.length"
                layout="prev, pager, next"
                style="margin-top: 10px;"
            />

          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>

import {getEmr, searchOperate, searchDiagnosis, searchAdvice, searchInspect} from '@/api/patient/patientAPI'

export default {
  props: {
    patientData: {
      type: Object,
      default: () => ({}),
      required: true, // 如果 Data 是必需的，可以加上 required
    },
  },

  data() {
    return {
      currentTime: '',
      patient: this.patientData,
      diagnoses: [
        {diagnosis: '心肌梗塞', date: '2024-08-01'},
        {diagnosis: '高血压', date: '2024-08-05'}
      ],
      transferTimeline: [
        {date: '2024-08-01', description: '入院'},
        {date: '2024-08-05', description: '转入心内科'},
        {date: '2024-08-10', description: '转出心内科'}
      ],
      orders: [
        {orderName: '药物治疗', orderDate: '2024-08-01'},
        {orderName: '物理治疗', orderDate: '2024-08-03'}
      ],
      exams: [
        {examName: '心电图', examResult: '正常'},
        {examName: '血常规', examResult: '异常'}
      ],
      records: '',
      surgeries: [
        {surgeryName: '心脏搭桥手术', surgeryDate: '2024-08-07'},
        {surgeryName: '胃镜检查', surgeryDate: '2024-08-09'}
      ],
      activeTab: 'orders',
      pageSize: 10,
      ordersPage: 1,
      examsPage: 1,
      recordsPage: 1,
      surgeriesPage: 1
    };
  },
  methods: {
    handleOrdersPageChange(page) {
      this.ordersPage = page;
    },
    handleExamsPageChange(page) {
      this.examsPage = page;
    },
    handleRecordsPageChange(page) {
      this.recordsPage = page;
    },
    handleSurgeriesPageChange(page) {
      this.surgeriesPage = page;
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

    async getEmrData(patientid = this.patient.病案号) {
      try {
        const response = await getEmr(patientid);
        this.records = response.data.data;
      } catch (error) {
        console.error('获取病历数据失败/patientInfo/searchEmr:', error);
      }
    },

    async getOperateData(patientid = this.patient.病案号) {
      try {
        const response = await searchOperate(patientid);
        this.surgeries = response.data.data;
      } catch (error) {
        console.error('获取手术数据失败/patientInfo/searchOperate:', error);
      }
    },

    async getDiagnosisData(patientid = this.patient.病案号) {
      try {
        const response = await searchDiagnosis(patientid);
        this.diagnoses = response.data.data;
      } catch (error) {
        console.error('获取诊断数据失败/patientInfo/searchDiagnosis:', error);
      }
    },

    async getAdviceData(patientid = this.patient.病案号) {
      try {
        const response = await searchAdvice(patientid);
        this.orders = response.data.data;
      } catch (error) {
        console.error('获取医嘱数据失败/patientInfo/searchAdvice:', error);
      }
    },

    async getInspectData(patientid = this.patient.病案号) {
      try {
        const response = await searchInspect(patientid);
        this.exams = response.data.data;
      } catch (error) {
        console.error('获取检查数据失败/patientInfo/searchInspect:', error);
      }
    },


    handleRowClickEmr(row) {
      const index = this.records.findIndex(record => record === row); // 找到当前行的index
      // 浅拷贝 this.patient
      let tabData = {};
      tabData.patient = this.patient
      tabData.index = index;

      // 将 this.records 转换为 JSON 字符串
      tabData.records = this.records;

      // console.log(tabData); // 调试输出

      // 将 tabData 转换为 JSON 字符串后传递
      this.addTab(tabData);
    },

    addTab(tabData = null) {
      this.$emit('add-tab-chat', tabData); // 触发父组件的 add-tab-chat方法
    },

  },

  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);

   const caseNumber = this.patient.病案号;
  // 并行执行多个方法
  Promise.all([
    this.getEmrData(caseNumber),
    this.getOperateData(caseNumber),
    this.getDiagnosisData(caseNumber),
    this.getAdviceData(caseNumber),
    this.getInspectData(caseNumber)
  ])
  .then(() => {
    console.log("所有数据获取成功");
  })
  .catch((error) => {
    console.error("获取数据时出错：", error);
  });
  }
};
</script>

<style scoped>


.patient-dashboard {
  display: flex;
  padding: 10px;
  background-color: white;
}

.info-card-container {

  width: 20%;
  padding: 10px;


}

.info-card {
  color: black;
  margin-bottom: 10px;

}

.card-header {
  font-size: 16px; /* 调整字体大小 */
  color: black;
  background-color: #dadada;
  line-height: 10px; /* 调整行高 */
  padding: 1px 0; /* 调整上下内边距 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
  border-radius: 4px; /* 可选：添加圆角，让阴影效果更柔和 */
}

::v-deep .el-card__header {
  background-color: white;
  padding: 2px 2px;
  border-bottom: 1px solid white;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;

}


.card-content p {
  color: black;
  margin: 3px 0;
  font-size: 13px;
}

.details-container {
  color: black;
  background-color: white;
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.details-card {
  color: black;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.horizontal-timeline-card {
  background-color: white;
  height: 100px; /* 调整为所需的高度 */
  box-shadow: 0 2px 8px rgba(166, 166, 166, 6);
}

.horizontal-timeline {
  background-color: white;
  font-weight: bolder;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 5px;
  height: 100%; /* 确保时间轴填充整个卡片区域 */
}

.horizontal-timeline .el-timeline-item {
  background-color: white;
  font-weight: bolder;
  display: inline-block;
  text-align: center;
  margin-right: 15px;
}

.tabs-container {
  color: black;
  background-color: white;
  margin-top: 15px;
}

.tab-content {
  background-color: white;
  color: black;
  padding-top: 15px;
}

.pagination {
  background-color: white;
  text-align: right;
  margin-top: 5px;
}

</style>
